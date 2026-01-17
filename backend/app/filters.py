import django_filters
from django.contrib.gis.geos import Polygon
from django.contrib.gis.db.models.functions import Distance
from app.models.post import Post


class PostFilter(django_filters.FilterSet):
    bbox = django_filters.CharFilter(method="filter_bbox")

    class Meta:
        model = Post
        fields = []

    def filter_bbox(self, queryset, name, value):
        try:
            coords = value.split(",")
            if len(coords) != 4:
                return queryset

            sw_lng, sw_lat, ne_lng, ne_lat = map(float, coords)

            if not (
                -180 <= sw_lng <= 180
                and -180 <= ne_lng <= 180
                and -90 <= sw_lat <= 90
                and -90 <= ne_lat <= 90
            ):
                return queryset

            bbox = Polygon.from_bbox((sw_lng, sw_lat, ne_lng, ne_lat))
            bbox.srid = 4326
            center = bbox.centroid
            center.srid = 4326

            return (
                queryset.filter(location__point__within=bbox)
                .annotate(distance=Distance("location__point", center))
                .order_by("distance")
            )

        except (ValueError, TypeError, AttributeError):
            return queryset
