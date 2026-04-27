from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Club, Tournament, TournamentMatch
from .serializers import ClubSerializer, TournamentSerializer
import random

class ClubListCreateView(generics.ListCreateAPIView):
    queryset = Club.objects.all().order_by('-created_at')
    serializer_class = ClubSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        club = serializer.save(owner=self.request.user)
        club.members.add(self.request.user)

class JoinClubView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        club = get_object_or_404(Club, pk=pk)
        if request.user in club.members.all():
            club.members.remove(request.user)
            return Response({"status": "left"}, status=status.HTTP_200_OK)
        else:
            club.members.add(request.user)
            return Response({"status": "joined"}, status=status.HTTP_200_OK)

class TournamentListCreateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, club_pk):
        club = get_object_or_404(Club, pk=club_pk)
        tournaments = club.tournaments.all().order_by('-created_at')
        return Response(TournamentSerializer(tournaments, many=True).data)

    def post(self, request, club_pk):
        club = get_object_or_404(Club, pk=club_pk)
        name = request.data.get('name', f"{club.name} Tournament")
        t = Tournament.objects.create(club=club, name=name, created_by=request.user)
        t.participants.add(request.user)
        return Response(TournamentSerializer(t).data, status=status.HTTP_201_CREATED)

class JoinTournamentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        t = get_object_or_404(Tournament, pk=pk)
        if t.status != 'upcoming':
            return Response({"error": "Tournament already started"}, status=status.HTTP_400_BAD_REQUEST)
        if request.user in t.participants.all():
            t.participants.remove(request.user)
            return Response({"status": "left"})
        t.participants.add(request.user)
        return Response({"status": "joined"})

class GenerateBracketView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        t = get_object_or_404(Tournament, pk=pk)
        if t.created_by != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        if t.status != 'upcoming':
            return Response({"error": "Bracket already generated"}, status=status.HTTP_400_BAD_REQUEST)

        players = list(t.participants.all())
        if len(players) < 2:
            return Response({"error": "Need at least 2 players"}, status=status.HTTP_400_BAD_REQUEST)

        random.shuffle(players)
        # Pair them up (R1)
        matches = []
        for i in range(0, len(players) - 1, 2):
            m = TournamentMatch.objects.create(
                tournament=t, round_number=1,
                player_white=players[i], player_black=players[i+1]
            )
            matches.append(m)

        t.status = 'active'
        t.save()
        return Response(TournamentSerializer(t).data)
