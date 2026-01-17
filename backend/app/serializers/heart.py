from rest_framework import serializers
from app.models.heart import Heart


class HeartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heart
        fields = ["id", "user", "content_type", "object_id", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
