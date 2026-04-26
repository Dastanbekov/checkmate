from django.urls import path
from .views import ClubListCreateView, JoinClubView

urlpatterns = [
    path('clubs/', ClubListCreateView.as_view(), name='club-list-create'),
    path('clubs/<int:pk>/join/', JoinClubView.as_view(), name='club-join'),
]
