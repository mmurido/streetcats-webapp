from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.core.validators import FileExtensionValidator
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(_("email address"), unique=True)
    country = models.CharField(max_length=2)
    birthday = models.DateField()
    avatar = models.ImageField(
        upload_to="avatars/",
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])],
        null=True,
        blank=True,
    )
