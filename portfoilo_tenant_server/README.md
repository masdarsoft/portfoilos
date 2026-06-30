# Portfolio Tenant Server — Django REST API

Multi-tenant SaaS backend for event rental portfolio websites.  
Each tenant (business customer) gets their own branded portfolio site hosted at `{subdomain}.najdalzian.com` or a custom domain.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Django 5+ |
| API | Django REST Framework |
| Auth | SimpleJWT (access + refresh tokens) |
| Docs | drf-spectacular → Swagger UI + ReDoc |
| DB | PostgreSQL 16 |
| Storage | Whitenoise (local) / django-storages (S3) |
| Package Manager | `uv` |

---

## Project Structure

```
portfoilo_tenant_server/
├── config/
│   ├── settings/
│   │   ├── base.py          ← shared settings
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py              ← root URL registry (/api/v1/...)
│   └── asgi.py
├── core/
│   ├── models.py            ← TimestampedModel (UUID pk + timestamps)
│   ├── permissions.py       ← IsTenantMember, IsOwner, IsEditorOrAbove
│   └── pagination.py        ← StandardResultsPagination
├── apps/
│   ├── accounts/            ← TenantUser + JWT auth
│   ├── tenants/             ← Tenant model, domain resolution
│   ├── catalog/             ← ServiceCategory, Gallery, Reviews
│   ├── pages/               ← Page, PageTab, ContentBlock (page builder)
│   └── bookings/            ← BookingRequest + WhatsApp signal
├── .env.example
└── pyproject.toml
```

---

## Quick Start

```bash
# 1. Clone and enter the server folder
cd portfoilo_tenant_server

# 2. Install uv
pip install uv

# 3. Create venv and install deps
uv sync

# 4. Copy environment file
cp .env.example .env
# Edit .env with your DB credentials

# 5. Run migrations
uv run python manage.py migrate --settings=config.settings.development

# 6. Create superuser
uv run python manage.py createsuperuser --settings=config.settings.development

# 7. Start dev server
uv run python manage.py runserver --settings=config.settings.development
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/login/` | Public | Get JWT tokens |
| `POST` | `/api/v1/auth/refresh/` | Public | Refresh access token |
| `POST` | `/api/v1/auth/logout/` | Auth | Blacklist token |
| `GET/PATCH` | `/api/v1/auth/me/` | Auth | User profile |
| `GET` | `/api/v1/tenants/resolve/?domain=` | Public | Resolve tenant by host |
| `GET/PATCH` | `/api/v1/tenants/me/` | Auth | Tenant info |
| `PATCH` | `/api/v1/tenants/me/theme/` | Owner | Update theme colors |
| `PATCH` | `/api/v1/tenants/me/analytics/` | Owner | Update GTM/GA IDs |
| `GET` | `/api/v1/catalog/?domain=` | Public | List service categories |
| `GET` | `/api/v1/catalog/<slug>/?domain=` | Public | Category detail |
| `GET/POST` | `/api/v1/catalog/admin/` | Auth | Admin: categories |
| `POST` | `/api/v1/catalog/admin/reorder/` | Auth | Reorder categories |
| `GET` | `/api/v1/pages/<domain>/` | Public | List published pages |
| `GET` | `/api/v1/pages/<domain>/<slug>/` | Public | Full page with blocks+tabs |
| `GET/POST` | `/api/v1/pages/admin/` | Auth | Admin: pages |
| `GET/POST` | `/api/v1/pages/admin/<slug>/tabs/` | Auth | Admin: tabs |
| `GET/POST` | `/api/v1/pages/admin/<slug>/blocks/` | Auth | Admin: blocks |
| `POST` | `/api/v1/bookings/?domain=` | Public | Submit booking |
| `GET` | `/api/v1/bookings/admin/` | Auth | List bookings |

---

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

---

## Implementation Guide

To flesh out the stub views, follow the prompts in [`../template_1_nejd/multitenant_prompts.md`](../template_1_nejd/multitenant_prompts.md).
Feed each PHASE prompt sequentially to an AI to generate complete, production-ready code.

---

## Template System

This server powers all frontend templates. New customers get:
```
template_1_nejd/    ← Next.js static portfolio (Najd Al-Zain style)
template_2_xxx/     ← (future) different layout/theme
template_3_xxx/     ← (future) ...
```

All templates query the same Django REST API using the `?domain=` param for tenant resolution.
