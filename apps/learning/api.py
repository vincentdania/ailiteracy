from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enrollment, Lesson, LessonProgress
from .serializers import LessonProgressResponseSerializer, LessonProgressUpdateSerializer


class LessonProgressAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, lesson_id: int):
        serializer = LessonProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        lesson = get_object_or_404(Lesson, pk=lesson_id)
        enrollment = Enrollment.objects.filter(user=request.user, course=lesson.module.course).first()

        if not enrollment:
            return Response({"detail": "Not enrolled in this course."}, status=status.HTTP_403_FORBIDDEN)

        progress, _ = LessonProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)

        if serializer.validated_data["completed"]:
            progress.completed_at = timezone.now()
        else:
            progress.completed_at = None
        progress.save(update_fields=["completed_at"])

        payload = {
            "lesson_id": lesson.id,
            "completed": bool(progress.completed_at),
            "progress_percentage": enrollment.progress_percentage,
        }
        response_serializer = LessonProgressResponseSerializer(payload)
        return Response(response_serializer.data)
