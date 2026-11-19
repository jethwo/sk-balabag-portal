from datetime import date

from django.core.management.base import BaseCommand

from core.models import PPA, Objective, Partner, SiteSettings


class Command(BaseCommand):
    help = "Add placeholder content so you can see the site working."

    def handle(self, *args, **opts):
        s = SiteSettings.load()
        s.hero_text = "Open, accountable and youth-led. Browse our projects, programs and reports."
        s.partner_text = "We work with agencies, schools and groups to serve the youth of Balabag."
        s.stat1_number, s.stat1_label, s.stat2_number, s.stat2_label = "0", "PPAs completed", "0", "partners"
        s.save()
        if not Objective.objects.exists():
            for i in range(1, 5):
                Objective.objects.create(title=f"Objective {i}", description="Replace in the admin dashboard.", order=i)
        if not PPA.objects.exists():
            PPA.objects.create(title="Sample: Medical Mission", date_posted=date.today(), status="Completed",
                               center="Health", committees="Committee on Health",
                               description="<p>Placeholder entry. Edit it in the admin dashboard.</p>")
        if not Partner.objects.exists():
            Partner.objects.create(name="Sample Partner", type="Government", description="Placeholder.")
        self.stdout.write(self.style.SUCCESS("Demo content added."))
