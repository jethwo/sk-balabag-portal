from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import PPA

PPA_DATA = {"title": "Clean-up Drive", "date_posted": "2026-07-03", "center": "Environment", "status": "Planned"}


class ApiTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.admin = User.objects.create_user("admin", password="pw-12345-x", is_staff=True)
        self.user = User.objects.create_user("viewer", password="pw-12345-x")

    def auth(self, user):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + Token.objects.create(user=user).key)

    def test_public_can_read_but_not_write(self):
        self.assertEqual(self.client.get("/api/ppas/").status_code, 200)
        self.assertIn(self.client.post("/api/ppas/", PPA_DATA).status_code, (401, 403))

    def test_non_staff_cannot_write(self):
        self.auth(self.user)
        self.assertEqual(self.client.post("/api/ppas/", PPA_DATA).status_code, 403)

    def test_staff_can_create_and_rich_text_is_sanitized(self):
        self.auth(self.admin)
        r = self.client.post("/api/ppas/", {**PPA_DATA, "description": "<p>Hi</p><script>alert(1)</script>"})
        self.assertEqual(r.status_code, 201)
        self.assertNotIn("script", PPA.objects.get().description)

    def test_drafts_hidden_from_public(self):
        PPA.objects.create(**PPA_DATA, is_published=False)
        self.assertEqual(len(self.client.get("/api/ppas/").json()), 0)
        self.auth(self.admin)
        self.assertEqual(len(self.client.get("/api/ppas/").json()), 1)

    def test_login_only_for_staff(self):
        bad = self.client.post("/api/auth/login/", {"username": "viewer", "password": "pw-12345-x"})
        self.assertEqual(bad.status_code, 403)
        ok = self.client.post("/api/auth/login/", {"username": "admin", "password": "pw-12345-x"})
        self.assertIn("token", ok.json())

    def test_site_settings_public_read_staff_write(self):
        self.assertEqual(self.client.get("/api/site/").status_code, 200)
        self.assertIn(self.client.patch("/api/site/", {"hero_text": "x"}).status_code, (401, 403))
