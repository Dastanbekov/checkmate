from django.core.management.base import BaseCommand
from apps.lessons.models import Lesson

SEED_LESSONS = [
    {
        "title": "Mate in 1: The Back Rank",
        "description": "White to move. The black king is trapped on the back rank. Find the checkmate in 1 move!",
        "initial_fen": "3R3k/8/8/8/8/8/8/7K w - - 0 1",
        "solution_pgn": "Rd8#",
        "difficulty": "Beginner"
    },
    {
        "title": "The Scholar's Mate",
        "description": "White to move. This is one of the fastest checkmates in chess. Deliver checkmate in 1!",
        "initial_fen": "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
        "solution_pgn": "Qxf7#",
        "difficulty": "Beginner"
    },
    {
        "title": "Fork Attack: Knight",
        "description": "White to move. Your knight can attack both the king and the queen at the same time. Find the fork!",
        "initial_fen": "4k3/4q3/8/8/3N4/8/8/4K3 w - - 0 1",
        "solution_pgn": "Nf5",
        "difficulty": "Intermediate"
    },
    {
        "title": "Discovered Check",
        "description": "White to move. By moving one piece, you'll reveal a check from another. Find the powerful discovered check!",
        "initial_fen": "4k3/8/8/8/8/2B5/8/R3K3 w Q - 0 1",
        "solution_pgn": "Ba5+",
        "difficulty": "Intermediate"
    },
    {
        "title": "Queen Sacrifice for Mate",
        "description": "White to move. Sometimes you need to sacrifice your most powerful piece to win. Find the queen sacrifice that leads to checkmate!",
        "initial_fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5",
        "solution_pgn": "Qd5",
        "difficulty": "Advanced"
    },
]

class Command(BaseCommand):
    help = 'Seed the database with starter lessons'

    def handle(self, *args, **options):
        if Lesson.objects.count() > 0:
            self.stdout.write(self.style.WARNING('Lessons already seeded.'))
            return
        
        for data in SEED_LESSONS:
            Lesson.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(SEED_LESSONS)} lessons.'))
