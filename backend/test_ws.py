import asyncio
import websockets

async def test():
    try:
        async with websockets.connect('ws://127.0.0.1:8000/ws/play/bot/') as ws:
            print('Connected!')
            res = await ws.recv()
            print('Received:', res)
            await ws.send('{"move":"e2e4"}')
            res2 = await ws.recv()
            print('Received after move:', res2)
    except Exception as e:
        print('Error:', e)

asyncio.run(test())
