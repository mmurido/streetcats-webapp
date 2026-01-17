import uuid
import os
from django.conf import settings
from django.utils import timezone
from django.core.files.storage import default_storage
from django.contrib.gis.geos import Point
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from app.models.post import Post
from app.models.location import Location
from app.models.heart import Heart
from app.serializers.user import UserSerializer
from app.serializers.location import LocationSerializer
from app.serializers.comment import CommentSerializer


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    location = LocationSerializer(required=False, read_only=True)

    image_urls = serializers.SerializerMethodField(read_only=True)

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False),
        write_only=True,
        required=True,
        allow_empty=False,
        error_messages={
            "required": "At least one image is required.",
            "empty": "At least one image is required.",
        },
    )

    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    location_name = serializers.CharField(write_only=True)
    location_lat = serializers.FloatField(write_only=True)
    location_lng = serializers.FloatField(write_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "title",
            "description",
            "created_at",
            "location",
            "view_count",
            "heart_count",
            "comment_count",
            "is_liked",
            "image_urls",
            "uploaded_images",
            "comments",
            "location_name",
            "location_lat",
            "location_lng",
        ]
        read_only_fields = [
            "id",
            "view_count",
            "heart_count",
            "comment_count",
            "images",
        ]

    def get_image_urls(self, obj):
        if not obj.images:
            return []

        return [
            f"{settings.MEDIA_HOST}{img_data.get('url')}"
            for img_data in obj.images
            if img_data.get("url")
        ]

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters.")
        if len(value) > 300:
            raise serializers.ValidationError("Title must be at most 300 characters.")
        return value

    def validate_description(self, value):
        if len(value) < 10:
            raise serializers.ValidationError(
                "Description must be at least 10 characters."
            )
        if len(value) > 2000:
            raise serializers.ValidationError(
                "Description must be at most 2000 characters."
            )
        return value

    def validate_uploaded_images(self, value):
        if len(value) > 10:
            raise serializers.ValidationError("You can upload up to 10 images only.")

        for image in value:
            if image.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image size should not exceed 5MB.")

            allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
            if image.content_type not in allowed_types:
                raise serializers.ValidationError(
                    "Unsupported image format. Please upload JPEG, PNG, GIF, or WebP."
                )

        return value

    def validate_location_lat(self, value):
        if not (-90 <= value <= 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        return value

    def validate_location_lng(self, value):
        if not (-180 <= value <= 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        return value

    def create(self, validated_data):
        location_name = validated_data.pop("location_name")
        location_lat = validated_data.pop("location_lat")
        location_lng = validated_data.pop("location_lng")
        uploaded_images = validated_data.pop("uploaded_images", [])

        location = Location.objects.create(
            name=location_name, point=Point(location_lng, location_lat)
        )

        if not uploaded_images:
            raise serializers.ValidationError(
                {"uploaded_images": "At least one image is required."}
            )

        images_data = []
        for index, image_file in enumerate(uploaded_images):
            image_info = self.process_and_upload_image(image_file, index)
            images_data.append(image_info)

        post = Post.objects.create(
            location=location,
            user=self.context["request"].user,
            title=validated_data.get("title"),
            description=validated_data.get("description"),
            images=images_data,
        )

        return post

    def process_and_upload_image(self, image_file, order_index):
        ext = os.path.splitext(image_file.name)[1]
        filename = f"posts/{uuid.uuid4()}{ext}"

        saved_path = default_storage.save(filename, image_file)
        url = default_storage.url(saved_path)

        return {
            "url": url,
            "filename": filename,
            "original_name": image_file.name,
            "size": image_file.size,
            "content_type": image_file.content_type,
            "order": order_index,
            "uploaded_at": timezone.now().isoformat(),
        }

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_anonymous:
            return False
        content_type = ContentType.objects.get_for_model(obj)
        return Heart.objects.filter(
            content_type=content_type, object_id=obj.id, user=user
        ).exists()
