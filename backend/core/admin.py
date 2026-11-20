from django.contrib import admin

from .models import PPA, Objective, Official, Partner, PPAImage, Report, SiteSettings


class PPAImageInline(admin.TabularInline):
    model = PPAImage
    extra = 1


@admin.register(PPA)
class PPAAdmin(admin.ModelAdmin):
    list_display = ("title", "center", "status", "date_posted", "is_featured", "is_published")
    list_filter = ("center", "status", "is_featured", "is_published")
    list_editable = ("is_featured",)
    search_fields = ("title",)
    inlines = [PPAImageInline]


admin.site.register([Report, Partner, Official, Objective, SiteSettings])
