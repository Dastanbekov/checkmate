from django.db import models

class Lesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    initial_fen = models.CharField(max_length=150)
    solution_pgn = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, default='Beginner')

    class Meta:
        app_label = 'lessons'

    def __str__(self):
        return self.title
