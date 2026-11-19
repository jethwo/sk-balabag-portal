from rest_framework import serializers

from .models import PPA, Objective, Official, Partner, PPAImage, Report, SiteSettings


class PPAImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PPAImage
        fields = ["id", "ppa", "image", "caption"]


class PPASerializer(serializers.ModelSerializer):
    images = PPAImageSerializer(many=True, read_only=True)
    # Without an explicit default, a multipart form that omits the checkbox would mean "False".
    is_published = serializers.BooleanField(default=True)

    class Meta:
        model = PPA
        fields = "__all__"


class ReportSerializer(serializers.ModelSerializer):
    is_published = serializers.BooleanField(default=True)

    class Meta:
        model = Report
        fields = "__all__"


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = "__all__"


class OfficialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Official
        fields = "__all__"


class ObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objective
        fields = "__all__"


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ["id"]
