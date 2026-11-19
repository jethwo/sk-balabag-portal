import nh3
from django.core.exceptions import ValidationError
from django.core.files.storage import storages
from django.core.validators import FileExtensionValidator
from django.db import models

CENTERS = ["Health", "Education", "Peace-building and Security", "Governance", "Active Citizenship",
           "Environment", "Social Inclusion and Equity", "Economic Empowerment", "Global Mobility"]
CENTER_CHOICES = [(c, c) for c in CENTERS]
STATUS_CHOICES = [(s, s) for s in ("Planned", "Ongoing", "Completed")]
PARTNER_TYPES = [(t, t) for t in ("Government", "NGO", "Private", "School")]


def reports_storage():
    return storages["reports"]


def max_20mb(f):
    if f.size > 20 * 1024 * 1024:
        raise ValidationError("File too large (max 20 MB).")


class PPA(models.Model):
    """A Project, Program or Activity."""
    title = models.CharField(max_length=200)
    date_posted = models.DateField()
    project_dates = models.CharField(max_length=120, blank=True, help_text="e.g. July 3-5, 2026")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Planned")
    center = models.CharField("Center of participation", max_length=60, choices=CENTER_CHOICES)
    committees = models.CharField("Committees in charge", max_length=200, blank=True)
    description = models.TextField(blank=True, help_text="Rich text (HTML), sanitized on save")
    cover_image = models.ImageField(upload_to="ppas/", null=True, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_posted", "-id"]
        verbose_name = "PPA"

    def save(self, *args, **kwargs):
        self.description = nh3.clean(self.description)  # strip scripts etc. from rich text
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PPAImage(models.Model):
    """Extra photos for a PPA (activity gallery)."""
    ppa = models.ForeignKey(PPA, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="ppas/gallery/")
    caption = models.CharField(max_length=200, blank=True)


class Report(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    file = models.FileField(upload_to="reports/", storage=reports_storage,
                            validators=[FileExtensionValidator(["pdf"]), max_20mb])
    thumbnail = models.ImageField(upload_to="reports/thumbs/", null=True, blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-date", "-id"]

    def __str__(self):
        return self.title


class Partner(models.Model):
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=20, choices=PARTNER_TYPES)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to="partners/", null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Official(models.Model):
    """Directory entry. Publish OFFICIAL contact details only (Data Privacy Act)."""
    name = models.CharField(max_length=150)
    position = models.CharField(max_length=120)
    committee = models.CharField(max_length=150, blank=True)
    photo = models.ImageField(upload_to="officials/", null=True, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.position})"


class Objective(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class SiteSettings(models.Model):
    """One row only: homepage text, banner, contact details."""
    hero_text = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="site/", null=True, blank=True)
    partner_text = models.TextField(blank=True)
    partner_photo1 = models.ImageField(upload_to="site/", null=True, blank=True)
    partner_photo2 = models.ImageField(upload_to="site/", null=True, blank=True)
    stat1_number = models.CharField(max_length=20, blank=True)
    stat1_label = models.CharField(max_length=60, blank=True)
    stat2_number = models.CharField(max_length=20, blank=True)
    stat2_label = models.CharField(max_length=60, blank=True)
    address = models.CharField(max_length=200, default="Barangay Balabag, Pavia, Iloilo")
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    facebook = models.URLField(blank=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        return cls.objects.get_or_create(pk=1)[0]
