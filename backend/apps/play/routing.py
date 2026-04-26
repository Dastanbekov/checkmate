from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/play/bot/$', consumers.BotPlayConsumer.as_asgi()),
    re_path(r'ws/play/matchmaking/$', consumers.MatchmakingConsumer.as_asgi()),
    re_path(r'ws/play/online/(?P<room_name>[\w-]+)/$', consumers.MultiplayerConsumer.as_asgi()),
]
