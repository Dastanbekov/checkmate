from django.urls import path
from .views import ClubListCreateView, JoinClubView, TournamentListCreateView, JoinTournamentView, GenerateBracketView

urlpatterns = [
    path('clubs/', ClubListCreateView.as_view(), name='club-list-create'),
    path('clubs/<int:pk>/join/', JoinClubView.as_view(), name='club-join'),
    path('clubs/<int:club_pk>/tournaments/', TournamentListCreateView.as_view(), name='tournament-list-create'),
    path('tournaments/<int:pk>/join/', JoinTournamentView.as_view(), name='tournament-join'),
    path('tournaments/<int:pk>/bracket/', GenerateBracketView.as_view(), name='tournament-bracket'),
]
