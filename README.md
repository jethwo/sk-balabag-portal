# SK Balabag Transparency Portal

React + TypeScript frontend, Django REST backend. Public website + admin dashboard.

```
skp/
├─ backend/    Django, Django REST Framework, PostgreSQL/SQLite, Cloudinary
└─ frontend/   React, TypeScript, Vite, Tailwind, shadcn/ui-style components, TanStack Query
```

## Run it on your computer

You need Python 3.11+, Node 20+ and Git. Use two terminals.

**Terminal 1: backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
python manage.py migrate
python manage.py createsuperuser   # this is your first admin account
python manage.py seed_demo         # optional placeholder content
python manage.py runserver         # http://localhost:8000
```

**Terminal 2: frontend**
```bash
cd frontend
npm install
npm run dev                        # http://localhost:5173
```

Open http://localhost:5173 for the website and http://localhost:5173/admin to sign in.
Django's own admin is at http://localhost:8000/django-admin/ (use it to add extra
photos to a PPA's gallery until a gallery screen is added to the dashboard).

## How the pieces fit

```
Browser (React) --Axios/TanStack Query--> /api/... (Django REST Framework) --> PostgreSQL
                                                         \--> Cloudinary (photos) / disk (PDFs)
```
- Anyone can read (GET). Only accounts with **staff status** can create/edit/delete
  (`core/permissions.py`). Make an editor in `/django-admin/` > Users > tick "Staff status".
- Login returns a token, which Axios sends as `Authorization: Token ...` (`frontend/src/lib/api.ts`).
- Rich text from TipTap is cleaned with `nh3` on the server and `DOMPurify` in the browser.
- To add a field to a content type: edit `backend/core/models.py`, run
  `python manage.py makemigrations && python manage.py migrate`, then add one line to
  `frontend/src/admin/config.ts`. The admin form and list update themselves.

## Tests
```bash
cd backend && python manage.py test
```

## Before going live (checklist)
1. Backend env vars: `DEBUG=False`, a long random `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
   (your frontend URL), `CSRF_TRUSTED_ORIGINS`, `DATABASE_URL` (PostgreSQL), `CLOUDINARY_URL`.
2. Run `python manage.py collectstatic --noinput` and serve with `gunicorn config.wsgi`.
3. Frontend: set `VITE_API_URL=https://your-api-domain/api`, run `npm run build`, host the `dist/`
   folder on a static host (Netlify, Vercel, Cloudflare Pages) with a "redirect all to index.html" rule.
4. **PDF reports live on the server's disk** (`backend/media/reports`). Many hosts (Render free tier,
   Railway without a volume) erase the disk on every deploy. Use a host with a persistent disk/volume
   or a VPS, or later point the "reports" entry in `STORAGES` at cloud storage.
5. Back up the database and the `media/` folder regularly.
6. Use HTTPS only. Create separate accounts for each SK official; never share passwords.
7. Data Privacy Act: publish only official contact details in the Directory.

## Known limits / next steps
- No gallery screen in the dashboard yet (the API and Django admin support it).
- Lists are not paginated; add DRF pagination once you have a few hundred PPAs.
- Tokens are stored in localStorage. This is acceptable with sanitized content, but consider
  cookie sessions or JWT with refresh tokens later.
- To add more shadcn/ui components: `cd frontend && npx shadcn@latest init`.
