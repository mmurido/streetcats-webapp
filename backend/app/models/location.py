from django.contrib.gis.db import models


class Location(models.Model):
    name = models.CharField(max_length=200)
    point = models.PointField(
        geography=True,
        srid=4326,
        spatial_index=True,
    )
