from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("ppas", views.PPAViewSet)
router.register("ppa-images", views.PPAImageViewSet)
router.register("reports", views.ReportViewSet)
router.register("partners", views.PartnerViewSet)
router.register("officials", views.OfficialViewSet)
router.register("objectives", views.ObjectiveViewSet)

urlpatterns = [
    path("site/", views.SiteSettingsView.as_view()),
    path("auth/login/", views.LoginView.as_view()),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/me/", views.MeView.as_view()),
    path("", include(router.urls)),
]
