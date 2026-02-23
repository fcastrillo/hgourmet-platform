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

- **Method:** Email OTP / Magic Link (admin-only login)
- **Provider:** Supabase Auth (`signInWithOtp`)
- **Session management:** Server-side cookies via `@supabase/ssr`
- **Protected routes:** `/admin/*` (all admin panel pages)
- **Public routes:** All storefront pages (catalog, product detail, contact, recipes)
- **Admin provisioning:** Manual account creation via Supabase dashboard (no self-registration)
- **Flow:** Admin enters email → receives magic link via email → clicks link → session created → redirected to `/admin`
- **No password reset flow needed:** OTP eliminates password management entirely

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

### ADR-008: Email OTP (Magic Link) for Admin Authentication

- **Context:** The admin panel requires authentication for 1-2 non-technical users (store owners). Options considered: Email + Password, Email OTP / Magic Link, Phone OTP (SMS), and Email + Phone 2FA.
- **Decision:** Use Supabase Auth's `signInWithOtp({ email })` (Magic Link) instead of Email + Password. The admin enters their email, receives a one-time login link, and clicking it creates a server-side session.
- **Rationale:** (1) Zero password management burden for non-technical users — impossible to "forget the password". (2) Only 1-2 users, well within Supabase free tier email limits (4/hour). (3) Login is infrequent — session persists via cookies, so re-authentication is rare. (4) Eliminates the need to build a password reset flow. (5) Superior security — each login uses a single-use token, no static password to leak.
- **Consequences:** Login depends on email delivery speed (typically 5-30 seconds). If SMTP fails or emails land in spam, admins cannot log in. Mitigated by: (a) low volume makes delivery reliable, (b) admins can be trained to check spam on first use, (c) Supabase SMTP works well for low-volume auth emails. No password reset UI needed. Future customer auth (Fase 2+) can use a different method (password, social) — Supabase supports multiple auth methods simultaneously.
- **Origin:** FEAT-2 (architectural decision before HU-2.1 implementation)

### ADR-009: Admin Table UI Standard (Icon Buttons, Inline Toggle, Optimistic Updates)

- **Context:** HU-2.4 used text buttons ("Editar", "Eliminar") and a static badge for active/inactive state, requiring a modal to toggle visibility. This pattern was functional but verbose — the user requested a more compact, agile UI as the standard for all admin management tables.
- **Decision:** All admin CRUD tables (categories, banners, brands, products) must follow this UI pattern:
  1. **Action column:** 3 icon buttons (Heroicons outline SVGs) instead of text buttons: pencil (edit), eye/eye-slash (toggle visibility), trash (delete).
  2. **Native tooltips:** Each icon button uses the `title` attribute for hover tooltip and `aria-label` for accessibility.
  3. **Inline toggle:** The eye/eye-slash icon toggles `is_active` (or equivalent boolean) directly via a dedicated server action (e.g., `toggleCategoryActive`), without opening a modal.
  4. **Optimistic UI:** Use `activeOverrides` state (Record) + `useTransition` to reflect the toggle change instantly in the badge and icon, before the server responds. Clear the override after the server action completes.
  5. **Mobile:** Icon buttons with visible text labels and `min-h-[44px]` touch targets.
  6. **Aria-labels:** `aria-label="Editar"`, `aria-label="Activar"/"Desactivar"`, `aria-label="Eliminar"` — tests should query by `aria-label`, not by text content.
- **Consequences:** Consistent UX across all admin tables. Faster interaction for admins (one-click toggle vs. open modal → toggle → save → close). Slightly more complex component state management (optimistic overrides), but the pattern is well-tested and reusable. All future admin tables (HU-2.2, HU-2.5, HU-2.6) must follow this standard.
- **Origin:** HU-2.7 (established as the new admin UI standard)

### ADR-010: React State-Driven Toggle Styling in Tailwind 4

- **Context:** During HU-2.2 implementation, toggle switches in `ProductForm` using Tailwind's `peer-checked:` variant (a CSS-only pattern where a hidden checkbox input with class `peer` controls sibling styling) did not work in Tailwind 4. The `peer-checked:` utility classes were not generated correctly by Tailwind 4's JIT engine, resulting in visually unresponsive toggles despite correct HTML state.
- **Decision:** All toggle/switch components must use React state (`checked` prop) with conditional Tailwind classes instead of CSS-only `peer`/`peer-checked:` selectors. Pattern:
  ```tsx
  <div className={checked ? "bg-primary" : "bg-gray-200"} />
  <div className={checked ? "translate-x-5" : "translate-x-0"} />
  ```
  Do NOT use `peer` class on the input or `peer-checked:` on sibling elements.
- **Consequences:** Slightly more JavaScript (React re-renders on toggle), but fully reliable across Tailwind versions. All future form components with toggles (HU-2.5 banners, HU-2.6 brands) must follow this pattern. Existing toggles in `CategoryTable` (ADR-009 optimistic toggle) already use React state and are unaffected.
- **Origin:** HU-2.2 (discovered during implementation)

### ADR-007: Client-Side Data Fetching for Interactive Features

- **Context:** HU-1.3 requires real-time search with 300ms debounce. Server Components cannot handle interactive state or real-time user input. The project had a browser Supabase client (`src/lib/supabase/client.ts`) created in HU-1.1 but never used — all queries were server-side.
- **Decision:** For features requiring real-time interactivity (search, filtering, live updates), use the **browser Supabase client** from Client Components. Apply the **Orchestrator Pattern**: the parent Server Component fetches initial/static data (SSR), passes it as props to a Client Component that conditionally activates client-side fetching only when the user interacts. Query helpers for client-side use live in separate files from server-side helpers (e.g., `queries/search.ts` uses browser client vs `queries/products.ts` uses server client).
- **Consequences:** Clear separation between server and client data access. Initial page load remains fast (SSR). Client-side fetches only happen on user interaction. RLS policies apply equally to both clients (same anon key). Future interactive features (admin filters, live previews) should follow this same pattern.
- **Origin:** HU-1.3 (discovered during implementation of search and category filter)

### ADR-011: SVG Size Safety — Standard Tailwind Classes + Native width/height Attributes

- **Context:** During HU-4.3 implementation, inline SVG icons using Tailwind arbitrary pixel values (`h-[17px]`, `h-[22px]`) rendered with oversized dimensions in the browser. Tailwind 4's JIT engine did not generate these arbitrary classes at runtime, causing the browser to fall back to the SVG's intrinsic size (default 24×24 or larger). This is the same underlying issue as ADR-006 (arbitrary values not generated by Tailwind 4) but applied to SVG dimensions rather than colors.
- **Decision:** All inline SVG icons must use **two complementary sizing mechanisms**:
  1. Standard Tailwind utility classes (e.g., `h-4 w-4`, `h-5 w-5`, `h-6 w-6`) — never arbitrary values like `h-[Xpx]`.
  2. Native SVG attributes `width={N}` and `height={N}` as an explicit fallback that works regardless of CSS processing.
  ```tsx
  <svg
    className="h-4 w-4 shrink-0 text-primary"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    ...
  />
  ```
- **Consequences:** Slightly more verbose JSX for SVG elements, but guarantees correct sizing in all environments (development, production, SSR, CSS hydration edge cases). Zero visual regression risk from Tailwind JIT class generation timing. All future stories using inline SVG icons must apply this double-safety pattern from the start.
- **Origin:** HU-4.3 (discovered during visual validation and post-commit fix)

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
| Admin login form | `[CC]` | Email input + OTP verification state |
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
