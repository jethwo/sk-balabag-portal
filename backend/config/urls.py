from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path("django-admin/", admin.site.urls),  # Django's built-in admin (backup + photo galleries)
    path("api/", include("core.urls")),
    # Serves uploaded PDFs/photos from MEDIA_ROOT. Fine for a small site; for heavy traffic
    # put nginx in front or move files to cloud storage.
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
