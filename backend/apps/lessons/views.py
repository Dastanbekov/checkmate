from rest_framework import generics, permissions
from .models import Lesson
from .serializers import LessonSerializer

class LessonListView(generics.ListAPIView):
    queryset = Lesson.objects.all().order_by('difficulty', 'id')
    serializer_class = LessonSerializer
    permission_classes = (permissions.AllowAny,)

class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = (permissions.AllowAny,)
