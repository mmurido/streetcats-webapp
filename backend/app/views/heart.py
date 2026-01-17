from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from app.models.heart import Heart
from app.csrf_mixins import CSRFEnforcedAPIViewMixin


class HeartView(CSRFEnforcedAPIViewMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        resource_type = kwargs.get("resource_type")

        if resource_type == "posts":
            object_id = kwargs.get("post_pk")
        elif resource_type == "comments":
            object_id = kwargs.get("comment_pk")
        else:
            return Response({"detail": "Invalid resource type"}, status=400)

        model = self._get_model(resource_type)
        content_type = ContentType.objects.get_for_model(model)
        heart, created = Heart.objects.get_or_create(
            user=request.user, content_type=content_type, object_id=object_id
        )

        if not created:
            return Response(
                {"liked": True, "detail": "Already liked"}, status=status.HTTP_200_OK
            )
        return Response({"liked": True}, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        resource_type = kwargs.get("resource_type")

        if resource_type == "posts":
            object_id = kwargs.get("post_pk")
        elif resource_type == "comments":
            object_id = kwargs.get("comment_pk")
        else:
            return Response({"detail": "Invalid resource type"}, status=400)

        model = self._get_model(resource_type)
        content_type = ContentType.objects.get_for_model(model)
        Heart.objects.filter(
            user=request.user, content_type=content_type, object_id=object_id
        ).delete()
        return Response({"liked": False}, status=status.HTTP_204_NO_CONTENT)

    def _get_model(self, resource_type: str):
        if resource_type == "posts":
            from app.models.post import Post

            return Post
        elif resource_type == "comments":
            from app.models.comment import Comment

            return Comment
        return None
