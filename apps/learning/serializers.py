from rest_framework import serializers


class LessonProgressUpdateSerializer(serializers.Serializer):
    completed = serializers.BooleanField(default=True)


class LessonProgressResponseSerializer(serializers.Serializer):
    lesson_id = serializers.IntegerField()
    completed = serializers.BooleanField()
    progress_percentage = serializers.IntegerField()
