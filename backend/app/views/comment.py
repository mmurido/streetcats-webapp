from app.models.comment import Comment
from app.serializers.comment import CommentSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from app.csrf_mixins import CSRFEnforcedViewSetMixin


class CommentViewSet(CSRFEnforcedViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_queryset(self):
        qs = Comment.objects.select_related("user", "post")
        post_pk = self.kwargs.get("post_pk")
        if post_pk:
            qs = qs.filter(post_id=post_pk)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, post_id=self.kwargs.get("post_pk"))

    @action(detail=False, methods=["get"])
    def for_post(self, request, post_pk=None):
        comments = Comment.objects.filter(post_id=post_pk)
        page = self.paginate_queryset(comments)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
