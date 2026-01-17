from django.urls import path, include
from rest_framework.routers import SimpleRouter
from app.views.auth import AuthViewSet
from app.views.user import UserViewSet
from app.views.post import PostViewSet
from app.views.comment import CommentViewSet
from app.views.heart import HeartView


router = SimpleRouter(trailing_slash=False)
router.register(r"auth", AuthViewSet, basename="auth")
router.register(r"users", UserViewSet)
router.register(r"posts", PostViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "posts/<int:post_pk>/comments",
        CommentViewSet.as_view({"get": "for_post", "post": "create"}),
    ),
    path(
        "posts/<int:post_pk>/hearts",
        HeartView.as_view(),
        {"resource_type": "posts"},
    ),
    path(
        "posts/<int:post_pk>/comments/<int:comment_pk>/hearts",
        HeartView.as_view(),
        {"resource_type": "comments"},
    ),
]
