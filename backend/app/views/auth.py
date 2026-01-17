from app.models.user import User
from app.serializers.user import UserSerializer
from datetime import timedelta
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from app.csrf_mixins import CSRFEnforcedViewSetMixin
from app.authentication import JWTAuthenticationFromCookie


class AuthViewSet(CSRFEnforcedViewSetMixin, viewsets.ViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]

    @action(
        detail=False,
        methods=["post"],
        url_path="sign-up",
        permission_classes=[AllowAny],
    )
    def sign_up(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="sign-in",
        permission_classes=[AllowAny],
    )
    def sign_in(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")
        remember_me = request.data.get("rememberMe", False)

        if "@" in identifier:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
                username = user_obj.username
            except User.DoesNotExist:
                username = None
        else:
            username = identifier

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        if remember_me:
            refresh.set_exp(lifetime=timedelta(days=30))

        user_serializer = UserSerializer(user, context={"request": request})

        response = Response(
            {
                "user": user_serializer.data,
            }
        )

        response.set_cookie(
            key="refresh",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=30 * 24 * 60 * 60 if remember_me else None,  # 30 days or session
        )

        response.set_cookie(
            key="access",
            value=str(refresh.access_token),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60,  # 1 hour
        )

        return response

    @action(
        detail=False,
        methods=["post"],
        url_path="sign-out",
        authentication_classes=[JWTAuthenticationFromCookie],
        permission_classes=[IsAuthenticated],
    )
    def sign_out(self, request):
        response = Response(
            {"detail": "Signed out successfully"}, status=status.HTTP_200_OK
        )

        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response

    @action(
        detail=False,
        methods=["post"],
        url_path="refresh-access",
        permission_classes=[AllowAny],
    )
    def refresh_access(self, request):
        refresh_cookie = request.COOKIES.get("refresh")
        if not refresh_cookie:
            return Response(
                {"detail": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_cookie)
            access_token = refresh.access_token
        except Exception:
            return Response(
                {"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        response = Response(
            {"detail": "Access token refreshed"}, status=status.HTTP_200_OK
        )
        response.set_cookie(
            key="access",
            value=str(access_token),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60,  # 1 hour
        )
        return response
