from django.db import models
from django.contrib.auth.models import User
import random

class Club(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_clubs')
    members = models.ManyToManyField(User, related_name='clubs', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.username} in {self.club.name}"

class Tournament(models.Model):
    STATUS_CHOICES = [('upcoming','Upcoming'), ('active','Active'), ('finished','Finished')]
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='tournaments')
    name = models.CharField(max_length=150)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, related_name='tournaments', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TournamentMatch(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    round_number = models.IntegerField()
    player_white = models.ForeignKey(User, on_delete=models.CASCADE, related_name='white_matches')
    player_black = models.ForeignKey(User, on_delete=models.CASCADE, related_name='black_matches')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    result = models.CharField(max_length=10, blank=True)  # "1-0", "0-1", "1/2-1/2"

    def __str__(self):
        return f"R{self.round_number}: {self.player_white} vs {self.player_black}"
