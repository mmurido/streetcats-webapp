import re
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from app.models.user import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=True)
    country = serializers.CharField(
        required=True, error_messages={"required": "Country is required."}
    )
    birthday = serializers.DateField(
        required=True, error_messages={"required": "Birthday is required."}
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "avatar",
            "country",
            "birthday",
        ]
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True},
            "country": {"required": True},
            "birthday": {"required": True},
        }

    def get_avatar(self, obj):
        if not obj.avatar:
            return None

        return f"{settings.MEDIA_HOST}{obj.avatar.url}"

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters.")
        if len(value) > 20:
            raise serializers.ValidationError("Username must be at most 20 characters.")
        if not re.match(r"^[a-zA-Z0-9_]+$", value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and underscores."
            )
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        return value

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )
        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one digit."
            )
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )
        return value

    def validate_birthday(self, value):
        today = timezone.now().date()
        if value > today:
            raise serializers.ValidationError("Birthday cannot be in the future.")

        min_age = 13
        max_age = 120
        age = (
            today.year
            - value.year
            - ((today.month, today.day) < (value.month, value.day))
        )

        if age < min_age:
            raise serializers.ValidationError(
                f"User must be at least {min_age} years old."
            )

        if age > max_age:
            raise serializers.ValidationError(
                f"User age cannot be more than {max_age} years."
            )

        return value

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "password" in validated_data:
            validated_data["password"] = make_password(validated_data["password"])
        return super().update(instance, validated_data)
