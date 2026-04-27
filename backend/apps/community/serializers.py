from rest_framework import serializers
from .models import Club, Tournament, TournamentMatch
from django.contrib.auth.models import User

class ClubSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ('id', 'name', 'description', 'owner', 'owner_name', 'member_count', 'is_member', 'created_at')
        read_only_fields = ('owner', 'created_at')

    def get_member_count(self, obj):
        return obj.members.count()

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False

class TournamentMatchSerializer(serializers.ModelSerializer):
    player_white_name = serializers.CharField(source='player_white.username', read_only=True)
    player_black_name = serializers.CharField(source='player_black.username', read_only=True)
    winner_name = serializers.CharField(source='winner.username', allow_null=True, read_only=True)

    class Meta:
        model = TournamentMatch
        fields = ('id', 'round_number', 'player_white_name', 'player_black_name', 'winner_name', 'result')

class TournamentSerializer(serializers.ModelSerializer):
    participant_count = serializers.SerializerMethodField()
    matches = TournamentMatchSerializer(many=True, read_only=True)
    is_participant = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Tournament
        fields = ('id', 'name', 'status', 'participant_count', 'matches', 'is_participant', 'created_by_name', 'created_at')

    def get_participant_count(self, obj):
        return obj.participants.count()

    def get_is_participant(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(id=request.user.id).exists()
        return False
