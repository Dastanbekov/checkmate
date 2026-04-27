from django.urls import path
from .views import LessonListView, LessonDetailView

urlpatterns = [
    path('', LessonListView.as_view(), name='lesson-list'),
    path('<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
]
