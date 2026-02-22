# Technical Specification

> **Project:** hgourmet-platform
> **Last updated:** 2026-02-20

---

## Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| **Framework** | Next.js (App Router) | 15.x |
| **Database** | Supabase (PostgreSQL) | Latest |
| **UI** | TailwindCSS | 4.x |
| **Language** | TypeScript | 5.x |
| **Hosting** | Vercel | — |
| **Auth** | Supabase Auth | — |
| **Storage** | Supabase Storage | — |
| **Analytics** | Google Analytics 4 | — |
| **Email** | EmailJS or Resend | — |

---

## Data Model

### Core Tables

#### categories

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Primary key |
| `name` | `text` | NOT NULL, UNIQUE | Category display name (e.g., "Chocolate", "Harinas") |
| `slug` | `text` | NOT NULL, UNIQUE | URL-friendly identifier |
| `description` | `text` | | Optional category description |
| `display_order` | `integer` | NOT NULL, default `0` | Sorting position in navigation |
| `is_active` | `boolean` | NOT NULL, default `true` | Whether the category is visible |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |

#### products

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Primary key |
| `category_id` | `uuid` | FK → categories.id, NOT NULL | Product category |
| `name` | `text` | NOT NULL | Product name |
| `slug` | `text` | NOT NULL, UNIQUE | URL-friendly identifier |
| `description` | `text` | | Product description |
| `price` | `numeric(10,2)` | NOT NULL, CHECK > 0 | Price in MXN |
| `image_url` | `text` | | Main product image (Supabase Storage) |
| `sku` | `text` | UNIQUE | Stock-keeping unit for future POS integration |
| `is_available` | `boolean` | NOT NULL, default `true` | Whether the product is in stock |
| `is_featured` | `boolean` | NOT NULL, default `false` | Shown in "Lo más vendido" |
| `is_seasonal` | `boolean` | NOT NULL, default `false` | Shown in "Productos de temporada" |
| `is_visible` | `boolean` | NOT NULL, default `true` | Admin can hide without deleting |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update timestamp |

#### banners

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Primary key |
| `title` | `text` | | Banner headline |
| `subtitle` | `text` | | Banner subtext |
| `image_url` | `text` | NOT NULL | Banner image (Supabase Storage) |
| `link_url` | `text` | | Optional CTA link |
| `is_active` | `boolean` | NOT NULL, default `true` | Whether the banner is displayed |
| `display_order` | `integer` | NOT NULL, default `0` | Sorting position in carousel |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |

#### recipes

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Primary key |
| `title` | `text` | NOT NULL | Recipe title |
| `slug` | `text` | NOT NULL, UNIQUE | URL-friendly identifier |
| `content` | `text` | NOT NULL | Recipe body (Markdown or rich text) |
| `image_url` | `text` | | Cover image |
| `is_published` | `boolean` | NOT NULL, default `false` | Publication status |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update timestamp |

#### newsletter_subscribers

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Primary key |
| `email` | `text` | NOT NULL, UNIQUE | Subscriber email address |
| `is_active` | `boolean` | NOT NULL, default `true` | Subscription status |
| `subscribed_at` | `timestamptz` | NOT NULL, default `now()` | Subscription timestamp |

#### brands

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Primary key |
| `name` | `text` | NOT NULL | Brand/supplier name |
| `logo_url` | `text` | | Brand logo (Supabase Storage) |
| `website_url` | `text` | | Brand website link |
| `display_order` | `integer` | NOT NULL, default `0` | Sorting position |
| `is_active` | `boolean` | NOT NULL, default `true` | Whether the brand is displayed |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |

### Relationships

- `products.category_id` → `categories.id` (FK, ON DELETE RESTRICT)

### Indexes

- `products(category_id)` — fast category filtering
- `products(is_visible, is_available)` — public catalog query
- `products(is_featured)` — featured products section
- `products(is_seasonal)` — seasonal products section
- `newsletter_subscribers(email)` — unique constraint lookup

---

## Authentication

- **Method:** Email + Password (admin-only login)
- **Provider:** Supabase Auth
- **Session management:** Server-side cookies via `@supabase/ssr`
- **Protected routes:** `/admin/*` (all admin panel pages)
- **Public routes:** All storefront pages (catalog, product detail, contact, recipes)
- **Admin provisioning:** Manual account creation via Supabase dashboard (no self-registration)

---

## Security (RLS Policies)

| Table | Role | SELECT | INSERT | UPDATE | DELETE | Policy Logic |
|:------|:-----|:-------|:-------|:-------|:-------|:-------------|
| categories | anon | Yes | No | No | No | Public read for storefront |
| categories | authenticated | Yes | Yes | Yes | Yes | Full admin access |
| products | anon | Yes (visible only) | No | No | No | `is_visible = true` filter |
| products | authenticated | Yes | Yes | Yes | Yes | Full admin access |
| banners | anon | Yes (active only) | No | No | No | `is_active = true` filter |
| banners | authenticated | Yes | Yes | Yes | Yes | Full admin access |
| recipes | anon | Yes (published only) | No | No | No | `is_published = true` filter |
| recipes | authenticated | Yes | Yes | Yes | Yes | Full admin access |
| newsletter_subscribers | anon | No | Yes | No | No | Subscribe only |
| newsletter_subscribers | authenticated | Yes | Yes | Yes | Yes | Full admin access |
| brands | anon | Yes (active only) | No | No | No | `is_active = true` filter |
| brands | authenticated | Yes | Yes | Yes | Yes | Full admin access |

### Storage Policies

| Bucket | Role | Upload | Read | Delete |
|:-------|:-----|:-------|:-----|:-------|
| `product-images` | anon | No | Yes | No |
| `product-images` | authenticated | Yes | Yes | Yes |
| `banner-images` | anon | No | Yes | No |
| `banner-images` | authenticated | Yes | Yes | Yes |
| `recipe-images` | anon | No | Yes | No |
| `recipe-images` | authenticated | Yes | Yes | Yes |
| `brand-logos` | anon | No | Yes | No |
| `brand-logos` | authenticated | Yes | Yes | Yes |

---

## Architecture Decisions (ADRs)

### ADR-001: Public Storefront with Admin-Only Auth

- **Context:** The storefront is a catalog without user accounts or checkout. Only store owners need to manage content.
- **Decision:** No public user registration. Authentication is limited to admin users (store owners) provisioned manually via Supabase dashboard.
- **Consequences:** Simpler auth flow. No user profile management needed. Future phases (Fase 2+) will add customer accounts when payment is introduced.

### ADR-002: WhatsApp Link Instead of API

- **Context:** The MVP requires WhatsApp ordering but the business doesn't have WhatsApp Business API.
- **Decision:** Use `https://wa.me/{number}?text={message}` deep links with pre-filled product context instead of API integration.
- **Consequences:** Zero cost. No API quotas. Works on all devices. Limited tracking (use UTM params). Future migration to WhatsApp Business API possible in Fase 3+.

### ADR-003: CSV Import for Bulk Product Upload

- **Context:** Store has 300-1000 products. Manual entry is impractical for initial load.
- **Decision:** Build a CSV import feature in the admin panel that maps columns to product fields.
- **Consequences:** Enables initial bulk load from POS export. Column mapping must handle edge cases (missing images, invalid prices). Validation and error reporting needed.

### ADR-004: SKU Field for Future POS Integration

- **Context:** Future roadmap includes automatic POS synchronization (Fase 4).
- **Decision:** Include an optional `sku` field in the products table from day one.
- **Consequences:** No immediate cost. Enables smooth migration when POS integration is built. SKU uniqueness enforced at DB level.

### ADR-005: Typed Data-Fetching Helpers for Supabase Queries

- **Context:** Supabase's TypeScript types resolve to `never` when chaining multiple `.eq()` filters on the same query (e.g., `.eq("slug", slug).eq("is_active", true).single()`). This breaks type inference in Server Components and prevents the build from compiling under strict TypeScript.
- **Decision:** Wrap all Supabase queries in typed helper functions (e.g., `fetchActiveCategory(slug): Promise<Category | null>`) that use explicit type assertions (`as T | null`) on the query result. Each Server Component page imports these helpers instead of inlining Supabase queries.
- **Consequences:** Slightly more boilerplate per page, but ensures type safety across all Server Components. Centralizes data access logic, making it easier to add caching or error handling later. All future stories must follow this pattern.
- **Origin:** HU-1.1 (discovered during implementation of Tasks 7 and 10)

### ADR-006: Inline Styles for Third-Party Brand Colors in Tailwind 4

- **Context:** Tailwind 4 does not generate arbitrary value classes (e.g., `bg-[#25D366]`) that are not statically referenced in CSS at build time. This caused the WhatsApp CTA button to render with a white background (invisible text) in production.
- **Decision:** Any component using a specific brand color not part of the project's design system (e.g., WhatsApp green `#25D366`, Facebook blue `#1877F2`) must use `style={{ backgroundColor: "...", color: "..." }}` inline props instead of Tailwind arbitrary value classes. Project-owned colors must be defined as CSS custom properties in `globals.css` and referenced as Tailwind tokens.
- **Consequences:** Slightly less concise JSX for components with third-party brand colors. However, guarantees correct rendering in all environments. Hover/active effects for these elements must use CSS transitions or `onMouseEnter`/`onMouseLeave` handlers.
- **Origin:** HU-1.2 (discovered during manual validation of WhatsAppCTA component)

---

## Server/Client Strategy

- **Default:** All data logic is **Server-side** (Server Components + Server Actions).
- **Client Components** are used only when: interactive state, browser APIs, or real-time subscriptions are needed.
- **Classification convention:**
  - `[SC]` — Server Component (data fetching, rendering)
  - `[CC]` — Client Component (interactivity, `useState`, `useEffect`)
  - `[SA]` — Server Action (mutations, form submissions)

### Component Classification

| Component | Type | Justification |
|:----------|:-----|:--------------|
| Product listing page | `[SC]` | Server-rendered catalog with SEO |
| Product detail page | `[SC]` | Static content, SEO-critical |
| Category navigation | `[SC]` | Server-rendered nav menu |
| Banner carousel | `[CC]` | Auto-play animation, user interaction |
| Search/filter bar | `[CC]` | Real-time input handling |
| WhatsApp CTA button | `[CC]` | Dynamic message composition |
| Newsletter form | `[CC]` | Form state + submission |
| Admin product form | `[CC]` | Complex form with image upload |
| Admin CSV import | `[CC]` | File handling + progress feedback |
| Product CRUD actions | `[SA]` | Server-side mutations |
| Banner CRUD actions | `[SA]` | Server-side mutations |
| Newsletter subscribe | `[SA]` | Server-side insert |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (storefront)/       # Public-facing routes
│   │   ├── page.tsx        # Homepage (banners, featured, seasonal)
│   │   ├── categorias/     # Category listing and detail
│   │   ├── productos/      # Product detail pages
│   │   ├── recetas/        # Recipes and tips
│   │   └── contacto/       # Contact page (WhatsApp, social, map)
│   ├── (admin)/            # Protected admin routes
│   │   ├── admin/          # Admin dashboard
│   │   │   ├── productos/  # Product management
│   │   │   ├── categorias/ # Category management
│   │   │   ├── banners/    # Banner management
│   │   │   ├── recetas/    # Recipe management
│   │   │   └── boletin/    # Newsletter subscriber list
│   │   └── login/          # Admin login page
│   └── layout.tsx          # Root layout
├── components/             # Shared UI components
│   ├── ui/                 # Base UI primitives (Button, Card, Input, etc.)
│   ├── storefront/         # Storefront-specific components
│   └── admin/              # Admin-specific components
├── lib/                    # Utilities and helpers
│   ├── supabase/           # Supabase client setup (server + client)
│   ├── utils.ts            # General utilities
│   └── constants.ts        # WhatsApp number, social links, etc.
├── types/                  # TypeScript type definitions
│   └── database.ts         # Supabase generated types
└── tests/                  # Test files
    ├── integration/        # Integration tests
    └── e2e/                # End-to-end tests
```

---

## Design Tokens

> Visual identity based on "Gourmet moderno y familiar" tone.

### Color Palette (to validate with client)

| Token | Option A: Cálidos Pastel | Option B: Chocolate y Crema | Option C: Minimal Gourmet |
|:------|:-------------------------|:----------------------------|:--------------------------|
| Primary | Rosa palo `#E8B4B8` | Marrón cacao `#6B4226` | Negro `#1A1A1A` |
| Secondary | Dorado suave `#D4A574` | Crema `#F5E6D3` | Rosé `#C4A882` |
| Background | Beige `#FDF6F0` | Beige claro `#FAF3EB` | Blanco `#FAFAFA` |
| Accent | Dorado `#C9A84C` | Dorado `#C9A84C` | Dorado `#C9A84C` |
| Text | Marrón oscuro `#3D2B1F` | Marrón oscuro `#3D2B1F` | Negro `#1A1A1A` |

### Typography

- **Headings:** Poppins (sans-serif, rounded)
- **Body:** Nunito or Lato (sans-serif, readable)
- **Fallback:** system-ui, sans-serif
