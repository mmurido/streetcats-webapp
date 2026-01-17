from app.models.user import User
from app.serializers.user import UserSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from app.csrf_mixins import CSRFEnforcedViewSetMixin


class UserViewSet(CSRFEnforcedViewSetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        elif self.action in ["update", "partial_update", "destroy", "me"]:
            return [IsAuthenticated()]

        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Use /auth/sign-up/ for user registration"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def perform_update(self, serializer):
        if self.request.user != self.get_object():
            raise PermissionDenied("You can only update your own profile.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance:
            raise PermissionDenied("You can only delete your own profile.")
        instance.delete()

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
