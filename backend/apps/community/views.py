from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Club
from .serializers import ClubSerializer

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
