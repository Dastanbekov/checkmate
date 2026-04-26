from django.urls import path
from .views import AnalyzeGameView

urlpatterns = [
    path('analyze/', AnalyzeGameView.as_view(), name='analyze_game'),
]
