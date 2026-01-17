from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from app.models.comment import Comment
from app.models.heart import Heart


@receiver(post_save, sender=Heart)
def increment_comment_heart_count(sender, instance, created, **kwargs):
    if created and instance.content_type.model == "comment":
        Comment.objects.filter(pk=instance.object_id).update(
            heart_count=F("heart_count") + 1
        )


@receiver(post_delete, sender=Heart)
def decrement_comment_heart_count(sender, instance, **kwargs):
    if instance.content_type.model == "comment":
        Comment.objects.filter(pk=instance.object_id).update(
            heart_count=F("heart_count") - 1
        )
