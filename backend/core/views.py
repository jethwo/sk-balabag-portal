from rest_framework import generics, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import PPA, Objective, Official, Partner, PPAImage, Report, SiteSettings
from .serializers import (ObjectiveSerializer, OfficialSerializer, PartnerSerializer, PPAImageSerializer,
                          PPASerializer, ReportSerializer, SiteSettingsSerializer)


class ContentViewSet(viewsets.ModelViewSet):
    """Public sees only published items; staff see everything (including drafts)."""

    def get_queryset(self):
        qs = super().get_queryset()
        if hasattr(qs.model, "is_published") and not self.request.user.is_staff:
            qs = qs.filter(is_published=True)
        return qs


class PPAViewSet(ContentViewSet):
    queryset = PPA.objects.prefetch_related("images")
    serializer_class = PPASerializer
    filter_backends = [SearchFilter]
    search_fields = ["title", "description", "center", "committees"]

    def get_queryset(self):
        qs = super().get_queryset()
        for param in ("center", "status"):
            if value := self.request.query_params.get(param):
                qs = qs.filter(**{param: value})
        return qs


class PPAImageViewSet(viewsets.ModelViewSet):
    queryset = PPAImage.objects.all()
    serializer_class = PPAImageSerializer


class ReportViewSet(ContentViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    filter_backends = [SearchFilter]
    search_fields = ["title"]


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer


class OfficialViewSet(viewsets.ModelViewSet):
    queryset = Official.objects.all()
    serializer_class = OfficialSerializer


class ObjectiveViewSet(viewsets.ModelViewSet):
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.load()


class LoginView(ObtainAuthToken):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"  # limits password guessing

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        if not user.is_staff:
            return Response({"detail": "This account is not an administrator."}, status=403)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"username": request.user.username, "is_staff": request.user.is_staff})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=204)
