import json
import chess
from channels.generic.websocket import AsyncWebsocketConsumer

class BotPlayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.board = chess.Board()
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'fen': self.board.fen()
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        move = text_data_json.get('move')
        
        if move:
            try:
                # User makes a move
                self.board.push_san(move)
                await self.send(text_data=json.dumps({
                    'type': 'move',
                    'move': move,
                    'fen': self.board.fen()
                }))
                
                # TODO: Trigger Celery task or asyncio task to get Stockfish move
                # For now, just a placeholder message
                await self.send(text_data=json.dumps({
                    'type': 'info',
                    'message': 'Engine is thinking...'
                }))
                
            except ValueError:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Invalid move'
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
