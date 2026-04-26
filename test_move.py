import asyncio
import websockets
import json

async def test():
    try:
        async with websockets.connect('ws://localhost:8000/ws/play/bot/') as ws:
            print('Connected!')
            res1 = await ws.recv()
            print('State:', res1)
            
            await ws.send(json.dumps({'move': 'e2e4', 'depth': 1}))
            print('Sent move e2e4')
            
            res2 = await ws.recv()
            print('Res2:', res2)
            
            res3 = await ws.recv()
            print('Res3:', res3)
            
            res4 = await ws.recv()
            print('Res4:', res4)
    except Exception as e:
        print('Error:', e)

asyncio.run(test())
