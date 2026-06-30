# Multi-Tenant SaaS Portfolio — Full Stack Blueprint
## Django REST API Backend + Next.js 16 Frontend

> **Architecture Philosophy:**
> - Django backend split into small, single-responsibility apps (tenants, catalog, pages, bookings, accounts)
> - REST API via Django REST Framework — versioned, token-protected, cleanly serialized
> - Next.js frontend split into atomic components (atoms → molecules → organisms → blocks → pages)
> - Complete tenant admin control: create portfolios, build pages, add tabs, manage content blocks

---

## PHASE 1 — Django Backend: Project Bootstrap & App Structure

```text
Act as a Senior Django Architect. I am building a multi-tenant SaaS platform for event rental portfolio
websites (e.g., tents, ACs, chairs, heritage tents). Each tenant gets their own branded portfolio site.

Create the following Django project structure with strict separation of concerns:

PROJECT ROOT: `backend/`
├── config/
│   ├── settings/
│   │   ├── base.py          ← shared settings (installed apps, middleware, DRF config, auth)
│   │   ├── development.py   ← DEBUG=True, SQLite or local Postgres
│   │   └── production.py    ← DEBUG=False, whitenoise, secure cookies
│   ├── urls.py              ← root URL conf, includes each app's urls.py under /api/v1/
│   └── asgi.py
├── apps/
│   ├── tenants/             ← Multi-tenant management
│   ├── catalog/             ← Rental service categories, gallery, reviews
│   ├── pages/               ← Dynamic pages, tabs, content blocks
│   ├── bookings/            ← Customer booking requests
│   └── accounts/            ← Tenant admin authentication (JWT)
└── core/
    ├── models.py            ← abstract TimestampedModel
    ├── permissions.py       ← IsTenantMember, IsOwner
    └── pagination.py        ← StandardResultsPagination

Setup rules:
1. Use `uv` for dependency management (pyproject.toml).
2. Use `django-environ` to load variables from a `.env` file.
3. Register each app via AppConfig with a descriptive verbose_name.
4. Use UUIDField as primary key on ALL models.
5. Abstract base model `TimestampedModel` (created_at, updated_at) in core/models.py.
6. Configure `django-cors-headers` to accept the Next.js frontend origin.
7. Configure `whitenoise` for static/media files in production.
8. DRF global config in base.py:
   - DEFAULT_AUTHENTICATION_CLASSES: JWTAuthentication
   - DEFAULT_PERMISSION_CLASSES: IsAuthenticated (overridden per view where needed)
   - DEFAULT_PAGINATION_CLASS: core.pagination.StandardResultsPagination
   - PAGE_SIZE: 50
9. Required packages:
   django, djangorestframework, djangorestframework-simplejwt, django-cors-headers,
   django-environ, Pillow, psycopg2-binary, whitenoise, django-filter, django-storages (optional).

Output:
- pyproject.toml
- config/settings/base.py
- config/settings/development.py
- config/settings/production.py
- config/urls.py
- core/models.py
- core/permissions.py
- core/pagination.py
- Each app's apps.py
```

---

## PHASE 2 — Django App: `tenants` — Multi-Tenant Core

```text
Inside `apps/tenants/`, write complete production-ready code. Rules:
- Separate files: models/, serializers.py, views.py, urls.py, managers.py, admin.py.
- Each model in its own file inside models/.

### Model: Tenant  (apps/tenants/models/tenant.py)
Fields:
- id:               UUIDField (primary_key=True, default=uuid4)
- subdomain:        SlugField (unique=True) — e.g. 'najd-al-zain'
- custom_domain:    CharField (blank, null, unique) — optional apex domain
- name:             CharField — e.g. 'مؤسسة ملك الحفلات'
- tagline:          CharField (blank)
- phone:            CharField
- whatsapp:         CharField
- email:            EmailField (blank)
- address:          TextField (blank)
- city:             CharField (blank)
- geo_lat:          DecimalField (max_digits=9, decimal_places=6, null)
- geo_lng:          DecimalField (max_digits=9, decimal_places=6, null)
- logo:             ImageField (upload_to='tenants/logos/')
- favicon:          ImageField (upload_to='tenants/favicons/', blank)
- theme:            JSONField — { primary, dark, light, gold_accent, gold_light, bg_soft }
- analytics:        JSONField — { gtm_id, ga_id }
- language:         CharField (choices=['ar','en'], default='ar')
- direction:        CharField (choices=['rtl','ltr'], default='rtl')
- font_family:      CharField (default='Tajawal')
- is_active:        BooleanField (default=True)
- meta_title:       CharField (blank)
- meta_description: TextField (blank)
- Inherits TimestampedModel

### Manager: TenantManager  (apps/tenants/managers.py)
- active()           → filters is_active=True
- get_by_host(host)  → checks custom_domain first, then derives from subdomain

### Serializer: (apps/tenants/serializers.py)
- TenantPublicSerializer  — read-only fields for Next.js public API (no sensitive data)
- TenantAdminSerializer   — all fields, used by authenticated admin endpoints

### Views: (apps/tenants/views.py)
- TenantResolveView      — GET /api/v1/tenants/resolve/?domain=<host>
                           Public. Returns TenantPublicSerializer. Used by Next.js middleware.
- TenantDetailView       — GET/PUT/PATCH /api/v1/tenants/me/
                           Auth required. Returns/updates the authenticated user's tenant.
- TenantThemeView        — PATCH /api/v1/tenants/me/theme/
                           IsOwner permission. Updates theme JSON only.
- TenantAnalyticsView    — PATCH /api/v1/tenants/me/analytics/
                           IsOwner permission. Updates GTM/GA IDs.

### URLs: (apps/tenants/urls.py)
- path('resolve/', TenantResolveView.as_view())
- path('me/', TenantDetailView.as_view())
- path('me/theme/', TenantThemeView.as_view())
- path('me/analytics/', TenantAnalyticsView.as_view())

### Admin: (apps/tenants/admin.py)
- TenantAdmin with list_display, search_fields, fieldsets grouped:
  (Identity | Branding | Contact | SEO | Theme & Analytics)

Output all files with full docstrings and type hints.
```

---

## PHASE 3 — Django App: `catalog` — Service Categories

```text
Inside `apps/catalog/`, build the rental service catalog. Rules:
- models/ package — one file per model.
- Separate: serializers.py, views.py, urls.py, filters.py, admin.py.

### Model: ServiceCategory  (apps/catalog/models/category.py)
Fields:
- id:            UUIDField
- tenant:        ForeignKey(Tenant, CASCADE, related_name='categories')
- slug:          SlugField — unique_together with tenant
- title:         CharField
- seo_title:     CharField
- description:   TextField
- seo_description: TextField (blank)
- seo_keywords:  JSONField (default=list) — list of keyword strings
- main_image:    ImageField (upload_to='catalog/main/')
- icon:          CharField (blank) — lucide icon name
- features:      JSONField (default=list) — list of feature bullet strings
- blog_content:  TextField (blank) — markdown body
- display_order: PositiveIntegerField (default=0)
- is_active:     BooleanField (default=True)
- Inherits TimestampedModel

### Model: CategoryGallery  (apps/catalog/models/gallery.py)
Fields:
- id:            UUIDField
- category:      ForeignKey(ServiceCategory, CASCADE, related_name='gallery_images')
- image:         ImageField (upload_to='catalog/gallery/')
- caption:       CharField (blank)
- display_order: PositiveIntegerField (default=0)
- Inherits TimestampedModel

### Model: ServiceReview  (apps/catalog/models/review.py)
Fields:
- id:            UUIDField
- category:      ForeignKey(ServiceCategory, CASCADE, related_name='reviews')
- reviewer_name: CharField
- city:          CharField (blank)
- rating:        PositiveSmallIntegerField (validators: 1–5)
- text:          TextField
- review_date:   CharField (blank) — e.g. '2026-04'
- is_visible:    BooleanField (default=True)
- Inherits TimestampedModel

### Serializers: (apps/catalog/serializers.py)
- CategoryGallerySerializer     — id, image (absolute URL), caption, display_order
- ServiceReviewSerializer       — all fields, read-only for public
- ServiceCategoryListSerializer — id, slug, title, seo_title, main_image, icon, display_order
- ServiceCategoryDetailSerializer — all fields including nested gallery_images and reviews

### Views: (apps/catalog/views.py)
- CategoryListView       — GET    /api/v1/catalog/
                           Public. Filtered by tenant via query param ?domain=<host>.
                           Returns ServiceCategoryListSerializer list, ordered by display_order.
- CategoryDetailView     — GET    /api/v1/catalog/<slug>/
                           Public. Fetches by (slug + tenant). Returns ServiceCategoryDetailSerializer.
- CategoryAdminListView  — GET/POST /api/v1/catalog/admin/
                           Auth + IsTenantMember. Creates new category for current tenant.
- CategoryAdminDetailView — GET/PUT/PATCH/DELETE /api/v1/catalog/admin/<slug>/
                           Auth + IsTenantMember. Full CRUD on a single category.
- CategoryReorderView    — POST /api/v1/catalog/admin/reorder/
                           Auth + IsTenantMember. Accepts [{id, display_order}] and bulk updates.
- GalleryAdminView       — POST/DELETE /api/v1/catalog/admin/<slug>/gallery/
                           Auth + IsTenantMember. Upload or delete gallery images.
- ReviewAdminView        — GET/POST /api/v1/catalog/admin/<slug>/reviews/
                           Auth + IsTenantMember. Manage reviews per category.

### Filters: (apps/catalog/filters.py)
- CategoryFilter using django-filter: filter by is_active, tenant (via domain)

### Admin: (apps/catalog/admin.py)
- ServiceCategoryAdmin with TabularInline for CategoryGallery and ServiceReview

Output all files fully documented.
```

---

## PHASE 4 — Django App: `pages` — Dynamic Pages, Tabs & Content Blocks

```text
Inside `apps/pages/`, build the complete page builder engine.

### Model: Page  (apps/pages/models/page.py)
Fields:
- id:               UUIDField
- tenant:           ForeignKey(Tenant, CASCADE, related_name='pages')
- title:            CharField — internal admin label
- slug:             SlugField — unique_together with tenant (e.g., 'home', 'about', 'services')
- page_type:        CharField (choices=['home','services','about','gallery','contact','custom'])
- meta_title:       CharField (blank)
- meta_description: TextField (blank)
- meta_keywords:    JSONField (default=list)
- og_image:         ImageField (blank)
- canonical_url:    URLField (blank)
- is_published:     BooleanField (default=False)
- display_order:    PositiveIntegerField (default=0)
- Inherits TimestampedModel

### Model: PageTab  (apps/pages/models/tab.py)
Tabs are the horizontal scrollable chips in the header (like the service category bar in Najd Al-Zain).
Fields:
- id:            UUIDField
- page:          ForeignKey(Page, CASCADE, related_name='tabs')
- label:         CharField — display text, e.g. 'تأجير مكيفات'
- icon:          CharField (blank) — lucide icon name
- tab_type:      CharField (choices=['category_link','custom_url','section_anchor'])
- link_value:    CharField — slug, full URL, or #anchor-id
- display_order: PositiveIntegerField (default=0)
- is_active:     BooleanField (default=True)
- Inherits TimestampedModel

### Model: ContentBlock  (apps/pages/models/block.py)
Fields:
- id:            UUIDField
- page:          ForeignKey(Page, CASCADE, related_name='blocks')
- block_type:    CharField — one of the choices listed below
- content:       JSONField — schema depends on block_type
- display_order: PositiveIntegerField (default=0)
- is_visible:    BooleanField (default=True)
- Inherits TimestampedModel

BLOCK_TYPE choices and their `content` schema:
- 'hero':           { headline, subheadline, cta_primary_text, cta_primary_url,
                      cta_secondary_text, cta_secondary_url, video_urls: [], poster_image }
- 'services_grid':  { title, subtitle, category_slugs: [] }
- 'about':          { heading, body_text, stats: [{label, value}], image_url }
- 'gallery':        { heading, layout: 'masonry|grid', category_slug }
- 'contact':        { heading, show_phone, show_whatsapp, show_email, show_map, map_embed_url }
- 'faq':            { heading, items: [{question, answer}] }
- 'testimonials':   { heading, category_slug }
- 'text_banner':    { text, background_color, text_color, align: 'center|right|left' }
- 'custom_html':    { html_content }

### Serializers: (apps/pages/serializers.py)
- ContentBlockSerializer — all block fields
- PageTabSerializer      — all tab fields
- PageListSerializer     — id, slug, title, page_type, is_published, display_order
- PageDetailSerializer   — all page fields + nested blocks (ordered) + nested tabs (ordered)

### Views: (apps/pages/views.py)
PUBLIC (used by Next.js for rendering):
- PagePublicView       — GET /api/v1/pages/<domain>/<slug>/
                         Returns PageDetailSerializer. Only if is_published=True.
- PageListPublicView   — GET /api/v1/pages/<domain>/
                         Returns PageListSerializer list (published only, ordered).

ADMIN (requires auth + IsTenantMember):
- PageAdminListView    — GET/POST /api/v1/pages/admin/
- PageAdminDetailView  — GET/PUT/PATCH/DELETE /api/v1/pages/admin/<slug>/
- PageReorderView      — POST /api/v1/pages/admin/reorder/
- TabAdminListView     — GET/POST /api/v1/pages/admin/<slug>/tabs/
- TabAdminDetailView   — GET/PUT/PATCH/DELETE /api/v1/pages/admin/<slug>/tabs/<tab_id>/
- TabReorderView       — POST /api/v1/pages/admin/<slug>/tabs/reorder/
- BlockAdminListView   — GET/POST /api/v1/pages/admin/<slug>/blocks/
- BlockAdminDetailView — GET/PUT/PATCH/DELETE /api/v1/pages/admin/<slug>/blocks/<block_id>/
- BlockReorderView     — POST /api/v1/pages/admin/<slug>/blocks/reorder/

### Admin: (apps/pages/admin.py)
- PageAdmin with inlines: PageTabInline (TabularInline), ContentBlockInline (StackedInline)
- custom readonly JSON preview of block content

Output all model files, serializers.py, views.py, urls.py, admin.py — fully documented.
```

---

## PHASE 5 — Django App: `bookings` — Booking Pipeline

```text
Inside `apps/bookings/`, build the customer inquiry system.

### Model: BookingRequest  (apps/bookings/models/booking.py)
Fields:
- id:                   UUIDField
- tenant:               ForeignKey(Tenant, CASCADE, related_name='bookings')
- category:             ForeignKey(ServiceCategory, SET_NULL, null, blank)
- customer_name:        CharField
- customer_phone:       CharField
- customer_email:       EmailField (blank)
- event_date:           DateField (null, blank)
- event_type:           CharField (blank) — e.g. 'زفاف', 'عزاء', 'فعالية'
- quantity:             PositiveIntegerField (default=1)
- notes:                TextField (blank)
- source:               CharField (choices=['website','whatsapp','phone'], default='website')
- status:               CharField (choices=['new','contacted','confirmed','completed','cancelled'])
- whatsapp_redirect_url: TextField (blank) — auto-generated via signal
- Inherits TimestampedModel

### Signal: (apps/bookings/signals.py)
- post_save on BookingRequest: build whatsapp_redirect_url from tenant.whatsapp +
  URL-encoded Arabic message including customer_name, category, event_date, notes.

### Serializers: (apps/bookings/serializers.py)
- BookingCreateSerializer  — customer-facing (public), validates phone format
- BookingAdminSerializer   — full fields + status choices for admin views
- BookingStatusSerializer  — only status field, for quick status updates

### Views: (apps/bookings/views.py)
- BookingCreateView        — POST /api/v1/bookings/
                             PUBLIC (AllowAny). Resolves tenant by ?domain= param.
                             On success returns 201 + whatsapp_redirect_url for frontend redirect.
- BookingAdminListView     — GET /api/v1/bookings/admin/
                             Auth + IsTenantMember. Filterable by status, event_date range.
- BookingAdminDetailView   — GET/PATCH /api/v1/bookings/admin/<id>/
                             Auth + IsTenantMember. View or update status/notes.

### Admin: (apps/bookings/admin.py)
- BookingAdmin: list_display, list_filter (status, source, event_date), search_fields
- Clickable whatsapp_redirect_url in readonly_fields

Output all files fully documented.
```

---

## PHASE 6 — Django App: `accounts` — Tenant Authentication

```text
Inside `apps/accounts/`, build JWT authentication for tenant admin users.

### Model: TenantUser  (apps/accounts/models.py)
- Extends AbstractUser
- tenant: ForeignKey(Tenant, CASCADE, related_name='users')
- role:   CharField (choices=['owner','editor','viewer'], default='editor')
- avatar: ImageField (upload_to='accounts/avatars/', blank)

### Serializers: (apps/accounts/serializers.py)
- RegisterSerializer        — creates new TenantUser tied to a Tenant
- LoginSerializer           — email + password, returns JWT pair
- UserProfileSerializer     — id, email, name, role, avatar
- ChangePasswordSerializer  — old_password + new_password validation

### Views: (apps/accounts/views.py)
- TokenObtainView     — POST /api/v1/auth/login/
                         AllowAny. Returns { access, refresh, user: {id, name, role} }
- TokenRefreshView    — POST /api/v1/auth/refresh/
                         AllowAny. Wraps simplejwt TokenRefreshView.
- UserProfileView     — GET/PATCH /api/v1/auth/me/
                         Auth required. Returns/updates profile.
- ChangePasswordView  — POST /api/v1/auth/change-password/
                         Auth required.
- LogoutView          — POST /api/v1/auth/logout/
                         Auth required. Blacklists refresh token (simplejwt blacklist app).

### Permissions: (core/permissions.py)
- IsTenantMember  — checks request.user.tenant == object.tenant
- IsOwner         — checks request.user.role == 'owner'
- IsEditorOrAbove — checks role in ['owner', 'editor']

Output: models.py, serializers.py, views.py, urls.py, apps.py — fully documented.
```

---

## PHASE 7 — REST API: URL Registry & API Documentation

```text
Wire up all Django REST API endpoints under a versioned prefix /api/v1/.
Also set up automatic interactive API documentation.

### config/urls.py — root URL configuration:
urlpatterns = [
  /api/v1/auth/          → include('apps.accounts.urls')
  /api/v1/tenants/       → include('apps.tenants.urls')
  /api/v1/catalog/       → include('apps.catalog.urls')
  /api/v1/pages/         → include('apps.pages.urls')
  /api/v1/bookings/      → include('apps.bookings.urls')
  /admin/                → Django admin site
  /api/schema/           → drf-spectacular OpenAPI schema (yaml)
  /api/docs/             → Swagger UI (drf-spectacular)
  /api/redoc/            → ReDoc UI (drf-spectacular)
]

### API Documentation with drf-spectacular:
- Add drf-spectacular to INSTALLED_APPS and configure in base.py:
  SPECTACULAR_SETTINGS = {
    'TITLE': 'Multi-Tenant Portfolio API',
    'DESCRIPTION': 'REST API for event rental portfolio SaaS',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
  }
- Annotate each ViewSet and APIView with @extend_schema(tags=[...], summary=..., responses={...})
- Tag views by app: ['Tenants'], ['Catalog'], ['Pages'], ['Bookings'], ['Auth']

### Complete endpoint table:
METHOD   ENDPOINT                                         AUTH        DESCRIPTION
─────────────────────────────────────────────────────────────────────────────────
POST     /api/v1/auth/login/                              Public      Get JWT tokens
POST     /api/v1/auth/refresh/                            Public      Refresh access token
POST     /api/v1/auth/logout/                             Auth        Blacklist refresh token
GET|PATCH /api/v1/auth/me/                               Auth        View/edit user profile
POST     /api/v1/auth/change-password/                   Auth        Change password

GET      /api/v1/tenants/resolve/?domain=<host>          Public      Resolve tenant by domain
GET|PATCH /api/v1/tenants/me/                            Auth        View/update tenant info
PATCH    /api/v1/tenants/me/theme/                       IsOwner     Update theme colors
PATCH    /api/v1/tenants/me/analytics/                   IsOwner     Update GTM/GA

GET      /api/v1/catalog/?domain=<host>                  Public      List active categories
GET      /api/v1/catalog/<slug>/?domain=<host>           Public      Category detail + gallery + reviews
GET|POST /api/v1/catalog/admin/                          Auth        Admin: list/create categories
GET|PUT|PATCH|DELETE /api/v1/catalog/admin/<slug>/       Auth        Admin: manage single category
POST     /api/v1/catalog/admin/reorder/                  Auth        Reorder categories
GET|POST /api/v1/catalog/admin/<slug>/gallery/           Auth        Upload gallery images
DELETE   /api/v1/catalog/admin/<slug>/gallery/<gid>/     Auth        Delete gallery image
GET|POST /api/v1/catalog/admin/<slug>/reviews/           Auth        Manage reviews

GET      /api/v1/pages/<domain>/                         Public      List published pages for tenant
GET      /api/v1/pages/<domain>/<slug>/                  Public      Full page (tabs + blocks)
GET|POST /api/v1/pages/admin/                            Auth        Admin: list/create pages
GET|PUT|PATCH|DELETE /api/v1/pages/admin/<slug>/         Auth        Admin: manage page
POST     /api/v1/pages/admin/reorder/                    Auth        Reorder pages
GET|POST /api/v1/pages/admin/<slug>/tabs/                Auth        Manage tabs on a page
GET|PUT|PATCH|DELETE /api/v1/pages/admin/<slug>/tabs/<id>/ Auth       Single tab CRUD
POST     /api/v1/pages/admin/<slug>/tabs/reorder/        Auth        Reorder tabs
GET|POST /api/v1/pages/admin/<slug>/blocks/              Auth        Manage blocks on a page
GET|PUT|PATCH|DELETE /api/v1/pages/admin/<slug>/blocks/<id>/ Auth     Single block CRUD
POST     /api/v1/pages/admin/<slug>/blocks/reorder/      Auth        Reorder blocks

POST     /api/v1/bookings/?domain=<host>                 Public      Submit booking inquiry
GET      /api/v1/bookings/admin/                         Auth        List bookings (filterable)
GET|PATCH /api/v1/bookings/admin/<id>/                   Auth        View/update booking status

Output: the complete config/urls.py, each app's urls.py, drf-spectacular decorators on views.
```

---

## PHASE 8 — Next.js Atomic Component Architecture

```text
Act as a Senior Next.js and UI/UX engineer. I am building the frontend for a multi-tenant event
portfolio SaaS using Next.js 16 App Router. The backend is a Django REST API.

Design the full atomic component folder structure and write the base configuration. Rules:
- ALL components are small, single-responsibility, in their own file under `components/`.
- Follow Atomic Design strictly: atoms → molecules → organisms → blocks.
- Use TypeScript throughout with strict type definitions in `types/`.
- Use Tailwind CSS v4 with CSS variables for per-tenant theming.
- Data fetching: native `fetch` in Server Components, custom hooks in Client Components.
- Use `framer-motion` ONLY for modal open/close and page transitions.
- Use `lucide-react` for all icons.
- NO Apollo, NO GraphQL — pure REST.

TYPES: (types/)
├── tenant.ts      ← Tenant, TenantTheme, TenantAnalytics
├── catalog.ts     ← ServiceCategory, CategoryGallery, ServiceReview
├── pages.ts       ← Page, PageTab, ContentBlock, BlockType
└── booking.ts     ← BookingRequest, BookingStatus

COMPONENT STRUCTURE:
components/
├── atoms/
│   ├── Button.tsx            ← variants: primary | secondary | ghost | danger | whatsapp
│   ├── Badge.tsx             ← service category chip label
│   ├── StarRating.tsx        ← 1–5 star display (read-only)
│   ├── SectionTag.tsx        ← small uppercase gold label above headings
│   ├── GoldDivider.tsx       ← decorative horizontal rule
│   ├── ScrollingText.tsx     ← horizontal marquee banner of service names
│   ├── PhoneLink.tsx         ← tel: anchor + phone icon
│   ├── WhatsappLink.tsx      ← wa.me anchor + WhatsApp icon
│   ├── LoadingSpinner.tsx    ← animated loading indicator
│   └── OptimizedImage.tsx    ← next/image with aspect-ratio + blur placeholder
├── molecules/
│   ├── ServiceCard.tsx       ← image card: icon + title + description + dual CTA buttons
│   ├── ReviewCard.tsx        ← stars + reviewer name + city + text
│   ├── StatItem.tsx          ← big number + label (e.g. '500+ عميل')
│   ├── FeatureItem.tsx       ← checkmark icon + feature string
│   ├── GalleryThumb.tsx      ← image tile with hover scale + optional caption overlay
│   ├── FaqItem.tsx           ← expandable accordion question/answer
│   ├── BookingFormFields.tsx ← controlled inputs: name, phone, date, event type, notes
│   ├── CategoryTab.tsx       ← single tab pill (active/inactive states)
│   ├── PageNavLink.tsx       ← header nav link with active underline
│   └── BlockWrapper.tsx      ← section wrapper with padding, scroll reveal animation
├── organisms/
│   ├── Header.tsx            ← sticky glass nav: logo + desktop links + WhatsApp CTA + hamburger
│   ├── MobileDrawer.tsx      ← slide-in mobile nav with links + WhatsApp button
│   ├── CategoryTabBar.tsx    ← full horizontal scrolling tab bar (built from PageTab[] data)
│   ├── Footer.tsx            ← 4-col: brand | quick links | top services | contact info
│   ├── FloatingActions.tsx   ← fixed bottom-right: WhatsApp + Phone buttons
│   ├── BookingModal.tsx      ← framer-motion modal: booking form → submit → WhatsApp redirect
│   ├── GalleryGrid.tsx       ← masonry or uniform grid layout with lightbox
│   ├── ReviewsCarousel.tsx   ← horizontal scroll of ReviewCards
│   └── ServiceDetailView.tsx ← full category page: gallery + features + blog + reviews + CTA
├── blocks/                   ← maps 1:1 to ContentBlock.block_type from Django
│   ├── HeroBlock.tsx         ← cycling video (desktop) / poster (mobile) + headline + CTAs
│   ├── ServicesGridBlock.tsx ← grid of ServiceCards fetched by category_slugs
│   ├── AboutBlock.tsx        ← text + stats grid + image
│   ├── GalleryBlock.tsx      ← GalleryGrid pulling images from category_slug
│   ├── ContactBlock.tsx      ← contact details + optional Google Maps embed
│   ├── FaqBlock.tsx          ← list of FaqItems
│   ├── TestimonialsBlock.tsx ← ReviewsCarousel from category_slug
│   ├── TextBannerBlock.tsx   ← full-width colored banner with centered text
│   ├── CustomHtmlBlock.tsx   ← raw HTML (dangerouslySetInnerHTML, sanitized)
│   └── BlockRenderer.tsx     ← switch on block.block_type → renders correct block component
└── providers/
    ├── TenantProvider.tsx    ← React context: shares tenant data to all client components
    └── ThemeInjector.tsx     ← injects tenant.theme as CSS variables onto <html> :root

Write the full code for:
1. All types in types/*.ts
2. BlockRenderer.tsx — exhaustive switch on block_type
3. TenantProvider.tsx + ThemeInjector.tsx
4. Button.tsx — all 5 variants with proper Tailwind classes
5. ServiceCard.tsx — full implementation
6. CategoryTabBar.tsx — scrolling tabs from PageTab[]
7. BookingModal.tsx — framer-motion modal + REST POST to /api/v1/bookings/ + WhatsApp redirect
8. HeroBlock.tsx — video/poster logic + mobile detection
```

---

## PHASE 9 — Next.js App Router: Pages & REST Integration

```text
Build the complete Next.js App Router page structure. All data fetching uses native fetch()
calling the Django REST API. No Apollo, no GraphQL.

FILE STRUCTURE:
app/
├── domains/
│   └── [domain]/
│       ├── layout.tsx                      ← server: fetch tenant → inject theme, fonts, analytics
│       ├── page.tsx                        ← server: fetch home page blocks → BlockRenderer
│       ├── [pageSlug]/
│       │   └── page.tsx                    ← server: fetch page by slug → BlockRenderer
│       └── [pageSlug]/
│           └── [categorySlug]/
│               └── page.tsx               ← server: fetch category detail → ServiceDetailView
├── api/
│   └── tenant-resolve/
│       └── route.ts                       ← Edge: GET ?domain= → calls Django resolve endpoint
middleware.ts                              ← subdomain → /domains/{subdomain} rewrite

lib/
├── api/
│   ├── client.ts                          ← base fetch wrapper with error handling + caching
│   ├── tenants.ts                         ← getTenant(domain), updateTenant()
│   ├── catalog.ts                         ← getCategories(domain), getCategory(domain, slug)
│   ├── pages.ts                           ← getPages(domain), getPage(domain, slug)
│   └── bookings.ts                        ← createBooking(domain, data)
├── fonts.ts                               ← local Tajawal font loader (next/font/local)
└── utils/
    ├── schema.ts                          ← JSON-LD builders: buildLocalBusiness(), buildFAQPage(), buildServiceSchema()
    └── seo.ts                             ← generatePageMetadata(), generateCategoryMetadata()

Write complete implementations for:

1. lib/api/client.ts
   - apiFetch(path, options) wrapper:
     - Base URL from process.env.NEXT_PUBLIC_API_URL
     - Accepts cache strategy as parameter (no-store | force-cache | revalidate)
     - On 4xx/5xx: throws typed ApiError with status + message
     - TypeScript generic: apiFetch<T>(path, opts): Promise<T>

2. lib/api/tenants.ts
   - getTenant(domain: string): Promise<Tenant>
     → GET /api/v1/tenants/resolve/?domain={domain}  cache: 'force-cache', revalidate: 3600

3. lib/api/pages.ts
   - getPages(domain: string): Promise<Page[]>
     → GET /api/v1/pages/{domain}/  cache: 'force-cache', revalidate: 60
   - getPage(domain: string, slug: string): Promise<Page>
     → GET /api/v1/pages/{domain}/{slug}/  cache: 'force-cache', revalidate: 60

4. lib/api/catalog.ts
   - getCategories(domain: string): Promise<ServiceCategory[]>
     → GET /api/v1/catalog/?domain={domain}  revalidate: 60
   - getCategory(domain: string, slug: string): Promise<ServiceCategory>
     → GET /api/v1/catalog/{slug}/?domain={domain}  revalidate: 60

5. lib/api/bookings.ts
   - createBooking(domain: string, data: BookingFormData): Promise<{whatsapp_redirect_url: string}>
     → POST /api/v1/bookings/?domain={domain}  no-cache

6. app/domains/[domain]/layout.tsx
   - Fetch: await getTenant(domain)
   - Set <html lang dir style (CSS vars from tenant.theme)>
   - Conditionally mount <GoogleTagManager> and <GoogleAnalytics>
   - Load Tajawal font via fonts.ts if tenant.font_family === 'Tajawal'
   - Render: <TenantProvider tenant={tenant}><ThemeInjector theme={tenant.theme}>
              <Header /><CategoryTabBar tabs={homePage.tabs} /><main>{children}</main>
              <Footer /><FloatingActions /></ThemeInjector></TenantProvider>

7. app/domains/[domain]/page.tsx
   - Fetch: await getPage(domain, 'home')
   - generateMetadata(): uses page.meta_title, page.meta_description, tenant.name
   - Inject JSON-LD: buildLocalBusiness(tenant) + buildFAQPage(faqBlock if exists)
   - Return: <BlockRenderer blocks={page.blocks} />

8. app/domains/[domain]/[pageSlug]/page.tsx
   - Fetch: await getPage(domain, pageSlug)
   - generateMetadata(): uses page SEO fields
   - generateStaticParams(): await getPages(domain) → map slugs (exclude 'home')
   - Return: <BlockRenderer blocks={page.blocks} />

9. app/domains/[domain]/[pageSlug]/[categorySlug]/page.tsx
   - Fetch: await getCategory(domain, categorySlug)
   - generateMetadata(): uses category SEO fields
   - generateStaticParams(): await getCategories(domain) × getPages(domain) → all combos
   - Inject JSON-LD: buildServiceSchema(category, tenant) + buildFAQPage(...)
   - Return: <ServiceDetailView category={category} />

10. middleware.ts
    - Parse host from request.headers.get('host')
    - Strip 'www.'
    - If host ends with process.env.ROOT_DOMAIN (e.g. 'najdalzian.com'):
        extract subdomain → rewrite to /domains/{subdomain}{pathname}
    - Else (custom domain):
        fetch /api/tenant-resolve?domain={host} → get subdomain → rewrite
    - Skip rewrites for: /_next/, /api/, /images/, /videos/, /fonts/,
      /favicon.ico, /robots.txt, /sitemap.xml, /icon.png

Output complete TypeScript code for all files above with proper types and error handling.
```

---

## PHASE 10 — Production Deployment Blueprint

```text
Write the complete production infrastructure for our Django REST + Next.js multi-tenant system on Ubuntu VPS.

### Docker Setup:
1. docker/django/Dockerfile
   - Stage 1 (builder): python:3.12-slim, install uv, install deps from pyproject.toml
   - Stage 2 (final): copy only installed packages + app code, run as non-root user
   - CMD: gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

2. docker/nextjs/Dockerfile
   - Stage 1 (deps): node:20-alpine, install pnpm, install dependencies
   - Stage 2 (builder): copy source, run pnpm build (output: standalone)
   - Stage 3 (runner): copy .next/standalone + .next/static + public, run as non-root
   - CMD: node server.js

3. docker-compose.yml services:
   - db:      postgres:16-alpine, volume: pgdata, healthcheck: pg_isready
   - redis:   redis:7-alpine, volume: redisdata
   - django:  build django image, env_file: backend/.env, depends_on: db (healthy)
               volumes: ./backend:/app, ./media:/app/media
   - nextjs:  build nextjs image, env_file: frontend/.env, depends_on: django
   - nginx:   nginx:alpine, volumes: ./nginx:/etc/nginx/conf.d, certs via certbot

### Nginx Configuration: nginx/conf.d/multitenant.conf
upstream django_api {
    server django:8000;
}
upstream nextjs_app {
    server nextjs:3000;
}

server {
    listen 80;
    server_name ~^(.+)\.najdalzian\.com$ najdalzian.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ~^(.+)\.najdalzian\.com$ najdalzian.com;

    ssl_certificate     /etc/letsencrypt/live/najdalzian.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/najdalzian.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    # Gzip
    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;

    # Django REST API + Admin + Static + Media
    location ~ ^/(api|admin|static|media)/ {
        proxy_pass http://django_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # All other traffic → Next.js
    location / {
        proxy_pass http://nextjs_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

### Environment Files:
backend/.env.example:
  SECRET_KEY=your-secret-key
  DEBUG=False
  DATABASE_URL=postgres://user:pass@db:5432/portfolio
  ALLOWED_HOSTS=.najdalzian.com,localhost
  CORS_ALLOWED_ORIGINS=https://najdalzian.com
  MEDIA_ROOT=/app/media
  MEDIA_URL=/media/
  ACCESS_TOKEN_LIFETIME_MINUTES=60
  REFRESH_TOKEN_LIFETIME_DAYS=7

frontend/.env.example:
  NEXT_PUBLIC_API_URL=https://najdalzian.com/api/v1
  NEXT_PUBLIC_ROOT_DOMAIN=najdalzian.com
  NEXT_PUBLIC_WHATSAPP_DEFAULT=966569436019

### CI/CD: deploy.sh
  git pull origin main
  docker compose build --no-cache django nextjs
  docker compose run --rm django python manage.py migrate
  docker compose run --rm django python manage.py collectstatic --noinput
  docker compose up -d
  docker compose exec nginx nginx -s reload
  echo "Deployment complete."

Output complete code for all Docker files, nginx config, env examples, and deploy.sh.
```