from app.models.comment import Comment
from app.models.heart import Heart
from app.serializers.user import UserSerializer
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "post",
            "text",
            "heart_count",
            "is_liked",
            "created_at",
        ]
        read_only_fields = ["heart_count", "created_at", "post"]

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_anonymous:
            return False
        content_type = ContentType.objects.get_for_model(obj)
        return Heart.objects.filter(
            content_type=content_type, object_id=obj.id, user=user
        ).exists()
