from django.contrib.gis.db import models
from app.models.user import User
from app.models.post import Post


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    heart_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
