import json
import chess
import httpx
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer

# Global in-memory state for matchmaking and active games (Prototype only)
WAITING_QUEUE = []
ACTIVE_GAMES = {}

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        # Add to queue
        WAITING_QUEUE.append(self)
        
        await self.send(text_data=json.dumps({
            'type': 'info',
            'message': 'Searching for opponent...'
        }))
        
        self.match_players()

    async def disconnect(self, close_code):
        if self in WAITING_QUEUE:
            WAITING_QUEUE.remove(self)

    def match_players(self):
        if len(WAITING_QUEUE) >= 2:
            player1 = WAITING_QUEUE.pop(0)
            player2 = WAITING_QUEUE.pop(0)
            
            room_id = str(uuid.uuid4())
            ACTIVE_GAMES[room_id] = {
                'board': chess.Board(),
                'players': { 'w': None, 'b': None } # Will be filled when they connect
            }
            
            # Send match found to both
            import asyncio
            asyncio.create_task(player1.send(text_data=json.dumps({
                'type': 'match_found',
                'room_id': room_id,
                'color': 'w'
            })))
            
            asyncio.create_task(player2.send(text_data=json.dumps({
                'type': 'match_found',
                'room_id': room_id,
                'color': 'b'
            })))

class MultiplayerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chess_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        game_data = ACTIVE_GAMES.get(self.room_name)
        if not game_data:
            # Fallback if game state not found
            ACTIVE_GAMES[self.room_name] = {'board': chess.Board(), 'players': {}}
            game_data = ACTIVE_GAMES[self.room_name]

        # Send current board state
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'fen': game_data['board'].fen()
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # Notify opponent of disconnection
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'opponent_disconnected',
            }
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        move_str = text_data_json.get('move')
        
        if move_str:
            game_data = ACTIVE_GAMES.get(self.room_name)
            if not game_data:
                return
                
            board = game_data['board']
            
            try:
                try:
                    move = board.parse_san(move_str)
                except ValueError:
                    move = board.parse_uci(move_str)
                    
                if move not in board.legal_moves:
                    raise ValueError("Illegal move")
                    
                board.push(move)
                
                # Broadcast move
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chess_move',
                        'move': move.uci(),
                        'fen': board.fen(),
                        'turn': 'b' if board.turn == chess.BLACK else 'w'
                    }
                )
                
            except ValueError as e:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': f'Invalid move: {str(e)}'
                }))

    async def chess_move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'move',
            'move': event['move'],
            'fen': event['fen'],
            'turn': event['turn']
        }))
        
    async def opponent_disconnected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'info',
            'message': 'Opponent disconnected.'
        }))

class BotPlayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.board = chess.Board()
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
        if 'depth' in text_data_json:
            self.depth = int(text_data_json['depth'])
            
        move_str = text_data_json.get('move')
        if move_str:
            try:
                try:
                    move = self.board.parse_san(move_str)
                except ValueError:
                    move = self.board.parse_uci(move_str)
                    
                if move not in self.board.legal_moves:
                    raise ValueError("Illegal move")
                    
                self.board.push(move)
                
                await self.send(text_data=json.dumps({
                    'type': 'move',
                    'move': move.uci(),
                    'fen': self.board.fen(),
                    'turn': 'b' if self.board.turn == chess.BLACK else 'w'
                }))
                
                if self.board.is_game_over():
                    await self._send_game_over()
                    return

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
            "maxThinkingTime": 1000
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data, timeout=5.0)
                response.raise_for_status()
                result = response.json()
                
                bot_move_uci = result.get('move')
                if not bot_move_uci:
                    raise ValueError("API returned no move")
                
                bot_move = self.board.parse_uci(bot_move_uci)
                self.board.push(bot_move)
                
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
