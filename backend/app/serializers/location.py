from rest_framework import serializers
from django.contrib.gis.geos import Point
from app.models.location import Location


class LocationSerializer(serializers.ModelSerializer):
    lat_input = serializers.FloatField(write_only=True, required=False)
    lng_input = serializers.FloatField(write_only=True, required=False)

    lat = serializers.SerializerMethodField(read_only=True)
    lng = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Location
        fields = ["id", "name", "point", "lat_input", "lng_input", "lat", "lng"]
        read_only_fields = ["id", "point", "lat", "lng"]

    def get_lat(self, obj):
        return obj.point.y if obj.point else None

    def get_lng(self, obj):
        return obj.point.x if obj.point else None

    def validate(self, data):
        lat_input = data.get("lat_input")
        lng_input = data.get("lng_input")
        if lat_input is not None and not (-90 <= lat_input <= 90):
            raise serializers.ValidationError(
                {"lat_input": "Latitude must be between -90 and 90."}
            )
        if lng_input is not None and not (-180 <= lng_input <= 180):
            raise serializers.ValidationError(
                {"lng_input": "Longitude must be between -180 and 180."}
            )
        return data

    def create(self, validated_data):
        lat_input = validated_data.pop("lat_input", None)
        lng_input = validated_data.pop("lng_input", None)
        if lat_input is not None and lng_input is not None:
            validated_data["point"] = Point(lng_input, lat_input)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lat_input = validated_data.pop("lat_input", None)
        lng_input = validated_data.pop("lng_input", None)
        if lat_input is not None and lng_input is not None:
            instance.point = Point(lng_input, lat_input)
        return super().update(instance, validated_data)
