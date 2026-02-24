# Setup & Configuration Guide

> **Project:** hgourmet-platform
> **Last updated:** 2026-02-22
>
> This guide covers all infrastructure prerequisites needed to run the project
> in development and production environments.

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [Supabase Project](#2-supabase-project)
3. [Database (PostgreSQL)](#3-database-postgresql)
4. [Authentication (Supabase Auth)](#4-authentication-supabase-auth)
5. [Storage (Supabase Storage)](#5-storage-supabase-storage)
6. [Next.js Configuration](#6-nextjs-configuration)
7. [Business Data to Customize](#7-business-data-to-customize)
8. [Quick Start Checklist](#8-quick-start-checklist)

---

## 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase project credentials:

```bash
cp .env.local.example .env.local
```

| Variable | Type | Where to find |
|:---------|:-----|:-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Dashboard → Settings → API → `anon` `public` key |

Both variables are exposed to the browser (prefix `NEXT_PUBLIC_`). This is safe because
RLS policies enforce access control at the database level.

> **Note:** The project does not currently use `SUPABASE_SERVICE_ROLE_KEY`. All operations
> go through the anon key + RLS policies or through authenticated user sessions.

---

## 2. Supabase Project

### Create the project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g., `hgourmet-platform`) and set the database password
3. Select a region close to your users (e.g., `US West (Oregon) — us-west-2`)
4. Copy the **Project URL** and **anon key** into your `.env.local`

### Relevant dashboard sections

| Section | Used for |
|:--------|:---------|
| Table Editor / SQL Editor | Database tables and migrations |
| Authentication | Magic Link (OTP) provider, URL config |
| Storage | `product-images`, `banner-images`, `brand-logos`, `recipe-images`, `category-images` buckets |
| Settings → API | Project URL, anon key |

---

## 3. Database (PostgreSQL)

### 3.1 Run the migration

Go to **SQL Editor** in the Supabase Dashboard and execute in order:

```
supabase/migrations/001_categories_and_products.sql
supabase/migrations/002_banners.sql
supabase/migrations/003_brands.sql
supabase/migrations/004_recipes.sql
supabase/migrations/005_enabler2_schema_evolution.sql
```

This creates:

| Table | Purpose |
|:------|:--------|
| `categories` | Product categories with `name` (unique), `slug` (unique), `display_order`, `is_active` |
| `products` | Products with FK to categories, `price` (CHECK > 0), `slug` (unique), `sku` (unique), image URL, and boolean flags (`is_available`, `is_visible`, `is_featured`, `is_seasonal`) |

### 3.2 Schema details

**Categories:**

| Column | Type | Constraints |
|:-------|:-----|:------------|
| `id` | `uuid` | PK, auto-generated |
| `name` | `text` | NOT NULL, UNIQUE |
| `slug` | `text` | NOT NULL, UNIQUE |
| `description` | `text` | nullable |
| `display_order` | `integer` | NOT NULL, default 0 |
| `is_active` | `boolean` | NOT NULL, default true |
| `created_at` | `timestamptz` | NOT NULL, default now() |

**Products:**

| Column | Type | Constraints |
|:-------|:-----|:------------|
| `id` | `uuid` | PK, auto-generated |
| `category_id` | `uuid` | FK → categories.id, ON DELETE RESTRICT |
| `name` | `text` | NOT NULL |
| `slug` | `text` | NOT NULL, UNIQUE |
| `description` | `text` | nullable |
| `price` | `numeric(10,2)` | NOT NULL, CHECK (price > 0) |
| `image_url` | `text` | nullable |
| `sku` | `text` | UNIQUE, nullable |
| `is_available` | `boolean` | NOT NULL, default true |
| `is_featured` | `boolean` | NOT NULL, default false |
| `is_seasonal` | `boolean` | NOT NULL, default false |
| `is_visible` | `boolean` | NOT NULL, default true |
| `created_at` | `timestamptz` | NOT NULL, default now() |
| `updated_at` | `timestamptz` | NOT NULL, default now() (auto-updated via trigger) |

### 3.3 Indexes

| Index | Columns | Purpose |
|:------|:--------|:--------|
| `idx_products_category_id` | `category_id` | FK lookup performance |
| `idx_products_visible_available` | `is_visible, is_available` | Storefront filtering |
| `idx_products_featured` | `is_featured` | "Lo más vendido" section |
| `idx_products_seasonal` | `is_seasonal` | "Temporada" section |

### 3.4 RLS Policies

RLS is enabled on both tables. The migration creates 4 policies:

| Policy | Table | Role | Operation | Condition |
|:-------|:------|:-----|:----------|:----------|
| `categories_anon_select` | categories | anon | SELECT | `true` (full public read) |
| `categories_auth_all` | categories | authenticated | ALL | `true` (admin full access) |
| `products_anon_select` | products | anon | SELECT | `is_visible = true` (only visible products) |
| `products_auth_all` | products | authenticated | ALL | `true` (admin full access) |

### 3.5 Trigger

A `BEFORE UPDATE` trigger on `products` automatically sets `updated_at = now()` on every update.

### 3.6 Banners migration (HU-2.5)

Run in **SQL Editor**:

```
supabase/migrations/002_banners.sql
```

This creates:

| Table | Purpose |
|:------|:--------|
| `banners` | Homepage carousel banners with `title`, `subtitle`, `image_url` (NOT NULL), `link_url`, `is_active`, `display_order` |

**RLS Policies:**

| Policy | Role | Operation | Condition |
|:-------|:-----|:----------|:----------|
| `banners_anon_select` | anon | SELECT | `is_active = true` (only active banners) |
| `banners_auth_all` | authenticated | ALL | `true` (admin full access) |

### 3.7 Seed data (optional, for development)

```
supabase/seed.sql
```

Inserts 6 categories (1 inactive) and 15 products with various combinations of
`is_featured`, `is_seasonal`, `is_available`, `is_visible` for testing all states.

### 3.8 ENABLER-2 migration (schema evolution + staging)

`005_enabler2_schema_evolution.sql` adds:

- Domain fields:
  - `categories.image_url` (for HU-1.5 category image management)
  - `products.barcode`, `products.sat_code` (for HU-2.3 CSV import)
- Staging tables:
  - `import_batches`
  - `product_import_raw`
  - `category_mapping_rules`
  - `product_import_issues`
- RLS policies:
  - Admin-only full access (`authenticated`) for staging tables
  - Public read (`anon`) only for active mapping rules (`category_mapping_rules`)
- Seeded mapping rules:
  - `v1` rules with priority system (10 dept-base, 20 category override, 30 exact dept+cat)

---

## 4. Authentication (Supabase Auth)

The admin panel uses **Magic Link (Email OTP)** — no passwords.

### 4.1 Enable Email OTP Provider

1. Go to **Authentication → Providers → Email**
2. Ensure **Email** is enabled
3. Confirm that **"Enable Email Confirmations"** is configured (Supabase enables it by default)

### 4.2 Configure Redirect URLs

Go to **Authentication → URL Configuration**:

| Setting | Development | Production |
|:--------|:------------|:-----------|
| **Site URL** | `http://localhost:3000` | `https://your-domain.com` |
| **Redirect URLs** | `http://localhost:3000/auth/callback` | `https://your-domain.com/auth/callback` |

> **Important:** Add BOTH the dev and production callback URLs to the "Redirect URLs" list.

### 4.3 Auth Flow Summary

```
User enters email → signInWithOtp() → Email with Magic Link
  → User clicks link → /auth/callback?code=XXX
  → exchangeCodeForSession(code) → Redirect to /admin
```

### 4.4 Files involved

| File | Role |
|:-----|:-----|
| `src/components/admin/LoginForm.tsx` | Login form with email input |
| `src/app/auth/callback/route.ts` | Exchanges OTP code for session |
| `src/middleware.ts` | Refreshes session cookies on every request |
| `src/lib/supabase/middleware.ts` | Protects `/admin/*` routes, redirects unauthenticated users |
| `src/app/(admin)/admin/layout.tsx` | Double-check: verifies session server-side |
| `src/app/(admin)/admin/actions.ts` | `signOut()` server action |

### 4.5 Admin users

Create admin users via the Supabase Dashboard:

1. Go to **Authentication → Users → Add User**
2. Enter the admin's email address
3. The admin will receive a Magic Link on their first login

> **Note:** There is no role-based system yet. Any authenticated user can access `/admin/*`.
> For the MVP, only create accounts for authorized administrators.

---

## 5. Storage (Supabase Storage)

### 5.1 Create the `product-images` bucket

1. Go to **Storage** in the Supabase Dashboard
2. Click **New Bucket**
3. Name: `product-images`
4. **Public bucket:** Yes (images are served via public URLs)
5. File size limit: **5 MB** (also validated in application code)
6. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### 5.2 Storage Policies

After creating the bucket, add these policies under **Storage → Policies → New Policy**:

**Policy 1: Public read access**

| Setting | Value |
|:--------|:------|
| Name | `Public read access` |
| Allowed operations | SELECT |
| Target roles | anon, authenticated |
| USING expression | `(bucket_id = 'product-images'::text)` |

**Policy 2: Authenticated full access**

| Setting | Value |
|:--------|:------|
| Name | `Authenticated full access` |
| Allowed operations | INSERT, UPDATE, DELETE |
| Target roles | authenticated |
| USING expression | `(bucket_id = 'product-images'::text)` |

> **Note:** Supabase auto-populates the USING expression with the bucket filter when
> you create policies through the Dashboard UI. If you see it pre-filled, just confirm it.

### 5.3 Create the `banner-images` bucket (HU-2.5)

1. Go to **Storage** in the Supabase Dashboard
2. Click **New Bucket**
3. Name: `banner-images`
4. **Public bucket:** Yes
5. File size limit: **5 MB**
6. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

Apply the same policy structure as `product-images`:

**Policy 1: Public read access**

| Setting | Value |
|:--------|:------|
| Name | `Public read access` |
| Allowed operations | SELECT |
| Target roles | anon, authenticated |
| USING expression | `(bucket_id = 'banner-images'::text)` |

**Policy 2: Authenticated full access**

| Setting | Value |
|:--------|:------|
| Name | `Authenticated full access` |
| Allowed operations | INSERT, UPDATE, DELETE |
| Target roles | authenticated |
| USING expression | `(bucket_id = 'banner-images'::text)` |

### 5.4 Create the `brand-logos` bucket (HU-2.6)

1. Go to **Storage** in the Supabase Dashboard
2. Click **New Bucket**
3. Name: `brand-logos`
4. **Public bucket:** Yes
5. File size limit: **5 MB**
6. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

Apply the same policy structure as `product-images`:

**Policy 1: Public read access**

| Setting | Value |
|:--------|:------|
| Name | `Public read access` |
| Allowed operations | SELECT |
| Target roles | anon, authenticated |
| USING expression | `(bucket_id = 'brand-logos'::text)` |

**Policy 2: Authenticated full access**

| Setting | Value |
|:--------|:------|
| Name | `Authenticated full access` |
| Allowed operations | INSERT, UPDATE, DELETE |
| Target roles | authenticated |
| USING expression | `(bucket_id = 'brand-logos'::text)` |

### 5.5 How images work in the app

- **Upload:** Admin creates/edits a product, banner, brand, or recipe → file is sent via FormData to a server action → server action uploads to the corresponding bucket with a UUID filename
- **Display:** Public URL from `storage.getPublicUrl()` is stored in `products.image_url`, `banners.image_url`, `brands.logo_url`, or `recipes.image_url`
- **Cleanup:** When an image is replaced or the record is deleted, the old image file is removed from storage

### 5.6 Buckets roadmap

| Bucket | Story | Purpose |
|:-------|:------|:--------|
| `category-images` | ENABLER-2 / HU-1.5 | Category card/showcase images managed from admin |
| `recipe-images` | HU-2.8 / HU-4.3 | Recipe cover images (admin upload delivered in HU-2.8; storefront rendering in HU-4.3) |

---

## 6. Next.js Configuration

### 6.1 Image Optimization

`next.config.ts` is configured to accept Supabase Storage URLs:

```typescript
images: {
  remotePatterns: [{
    protocol: "https",
    hostname: "*.supabase.co",
    pathname: "/storage/v1/object/public/**",
  }],
}
```

No additional image configuration is needed. When deploying to Vercel, image optimization
works automatically.

### 6.2 Middleware

The middleware (`src/middleware.ts`) runs on every request except static assets. It:
- Refreshes the Supabase session cookie (required for SSR auth)
- Redirects unauthenticated users from `/admin/*` to `/login`
- Redirects authenticated users from `/login` to `/admin`

### 6.3 Fonts

Google Fonts (**Poppins** for headings, **Nunito** for body) are loaded via `next/font/google`
and self-hosted at build time. No API key or external configuration needed.

---

## 7. Business Data to Customize

These values are hardcoded in `src/lib/constants.ts` and should be updated before production:

| Constant | Current Value | Action |
|:---------|:-------------|:-------|
| `WHATSAPP_NUMBER` | `"529991234567"` | Replace with the real WhatsApp Business number |
| `SOCIAL_LINKS.facebook` | `"https://facebook.com/hgourmet"` | Verify the real Facebook page URL |
| `SOCIAL_LINKS.instagram` | `"https://instagram.com/hgourmet"` | Verify the real Instagram profile URL |
| `STORE_INFO.name` | `"HGourmet"` | Confirm the brand name |
| `STORE_INFO.tagline` | `"Insumos Gourmet para Repostería"` | Confirm the tagline |
| `STORE_INFO.city` | `"Mérida, Yucatán"` | Confirm the city |

---

## 8. Quick Start Checklist

### First-time setup (development)

```
# 1. Clone and install
git clone <repo-url>
cd hgourmet-platform
npm install

# 2. Environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run the app
npm run dev
```

### Supabase configuration checklist

- [ ] Create Supabase project and copy URL + anon key to `.env.local`
- [ ] **Database:** Run migrations `001` → `005` in SQL Editor (including `005_enabler2_schema_evolution.sql`)
- [ ] **Database (optional):** Run `supabase/seed.sql` for test data
- [ ] **Auth:** Enable Email provider with Magic Link
- [ ] **Auth:** Set Site URL to `http://localhost:3000` (dev) / production URL
- [ ] **Auth:** Add `http://localhost:3000/auth/callback` to Redirect URLs
- [ ] **Auth:** Add production callback URL to Redirect URLs
- [ ] **Auth:** Create at least one admin user via Dashboard → Authentication → Users
- [ ] **Storage:** Create `product-images` bucket (public, 5 MB limit)
- [ ] **Storage:** Create `category-images` bucket (public, 5 MB limit)
- [ ] **Storage:** Add `Public read access` policy (SELECT, anon + authenticated)
- [ ] **Storage:** Add `Authenticated full access` policy (INSERT/UPDATE/DELETE, authenticated)

### Production deployment (Vercel)

- [ ] Connect GitHub repository to Vercel
- [ ] Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] Update Supabase Auth Site URL to production domain
- [ ] Add production `/auth/callback` URL to Supabase Redirect URLs
- [ ] Update `src/lib/constants.ts` with real business data
- [ ] Verify `next.config.ts` image hostname matches your Supabase project
