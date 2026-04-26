import json
import chess
import httpx
from channels.generic.websocket import AsyncWebsocketConsumer

class BotPlayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.board = chess.Board()
        # Default depth. Can be modified by the user later to set difficulty.
        self.depth = 10 
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'fen': self.board.fen()
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        # Allow client to configure bot difficulty
        if 'depth' in text_data_json:
            self.depth = int(text_data_json['depth'])
            
        move_str = text_data_json.get('move')
        
        if move_str:
            try:
                # 1. Apply User's Move
                # Allow SAN (e.g. "Nf3") or UCI (e.g. "g1f3")
                try:
                    move = self.board.parse_san(move_str)
                except ValueError:
                    move = self.board.parse_uci(move_str)
                    
                if move not in self.board.legal_moves:
                    raise ValueError("Illegal move")
                    
                self.board.push(move)
                
                # Send back the state after user's move
                await self.send(text_data=json.dumps({
                    'type': 'move',
                    'move': move.uci(),
                    'fen': self.board.fen(),
                    'turn': 'b' if self.board.turn == chess.BLACK else 'w'
                }))
                
                # Check if game ended after user move
                if self.board.is_game_over():
                    await self._send_game_over()
                    return

                # 2. Get Bot's Move from API
                await self.send(text_data=json.dumps({
                    'type': 'info',
                    'message': 'Engine is thinking...'
                }))
                
                await self._make_bot_move()

            except ValueError as e:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': f'Invalid move: {str(e)}'
                }))
                
    async def _make_bot_move(self):
        url = "https://chess-api.com/v1"
        data = {
            "fen": self.board.fen(),
            "depth": self.depth,
            "maxThinkingTime": 1000 # 1 second max to keep it responsive
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data, timeout=5.0)
                response.raise_for_status()
                result = response.json()
                
                bot_move_uci = result.get('move') # e.g. "e7e5"
                if not bot_move_uci:
                    raise ValueError("API returned no move")
                
                # 3. Apply Bot's Move
                bot_move = self.board.parse_uci(bot_move_uci)
                self.board.push(bot_move)
                
                # Send back bot's move
                await self.send(text_data=json.dumps({
                    'type': 'move',
                    'move': bot_move.uci(),
                    'san': result.get('san'),
                    'fen': self.board.fen(),
                    'turn': 'b' if self.board.turn == chess.BLACK else 'w',
                    'eval': result.get('eval'),
                    'winChance': result.get('winChance')
                }))
                
                if self.board.is_game_over():
                    await self._send_game_over()
                    
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Bot failed to move: {str(e)}'
            }))
            
    async def _send_game_over(self):
        result = self.board.result()
        reason = "Unknown"
        if self.board.is_checkmate():
            reason = "Checkmate"
        elif self.board.is_stalemate():
            reason = "Stalemate"
        elif self.board.is_insufficient_material():
            reason = "Insufficient material"
            
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'result': result,
            'reason': reason
        }))

class MultiplayerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chess_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        move = text_data_json.get('move')
        
        if move:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chess_move',
                    'move': move
                }
            )

    async def chess_move(self, event):
        move = event['move']
        await self.send(text_data=json.dumps({
            'type': 'move',
            'move': move
        }))
