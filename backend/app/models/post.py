from django.contrib.gis.db import models
from app.models.user import User
from app.models.location import Location


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    title = models.CharField(max_length=200)
    description = models.TextField()
    images = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    view_count = models.PositiveIntegerField(default=0)
    heart_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
