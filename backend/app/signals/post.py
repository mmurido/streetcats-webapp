from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from app.models.post import Post
from app.models.heart import Heart
from app.models.comment import Comment


@receiver(post_save, sender=Heart)
def increment_heart_count(sender, instance, created, **kwargs):
    if created and instance.content_type.model == "post":
        Post.objects.filter(pk=instance.object_id).update(
            heart_count=F("heart_count") + 1
        )


@receiver(post_delete, sender=Heart)
def decrement_heart_count(sender, instance, **kwargs):
    if instance.content_type.model == "post":
        Post.objects.filter(pk=instance.object_id).update(
            heart_count=F("heart_count") - 1
        )


@receiver(post_save, sender=Comment)
def increment_comment_count(sender, instance, created, **kwargs):
    if created:
        Post.objects.filter(pk=instance.post_id).update(
            comment_count=F("comment_count") + 1
        )


@receiver(post_delete, sender=Comment)
def decrement_comment_count(sender, instance, **kwargs):
    Post.objects.filter(pk=instance.post_id).update(
        comment_count=F("comment_count") - 1
    )
