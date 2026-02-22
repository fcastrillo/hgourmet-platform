# Objective: HU-1.2 — Ficha de detalle de producto

## Context

- **Feature:** FEAT-1 — Catálogo Digital de Productos
- **Story:** Como cliente de HGourmet, quiero ver la ficha completa de un producto con su imagen, descripción, precio y disponibilidad, para poder tomar una decisión de compra informada antes de contactar por WhatsApp
- **Spec Level:** Lite
- **Git Strategy:** trunk (commits directamente a `main`)
- **Estimate:** S (~4–8 horas)
- **tdd_mode:** flexible (IMPLEMENT → TEST → REFACTOR)

## Acceptance Criteria (BDD)

### Scenario 1: Visualización completa de producto disponible

- **Dado que:** El producto "Chocolate Belga 1kg" existe con `is_visible = true`, `is_available = true`, precio $350.00, e imagen cargada
- **Cuando:** El cliente accede a `/productos/chocolate-belga-1kg`
- **Entonces:** Se muestra la ficha con imagen optimizada, nombre "Chocolate Belga 1kg", precio "$350.00 MXN", descripción completa, badge "Disponible", y un botón "Pide por WhatsApp"

### Scenario 2: Producto con metadatos SEO correctos

- **Dado que:** El producto "Harina de Almendra 500g" tiene nombre, descripción e imagen
- **Cuando:** Un motor de búsqueda o red social rastrea la URL `/productos/harina-de-almendra-500g`
- **Entonces:** La página contiene meta tags con `og:title`, `og:description`, `og:image` y `<title>` generados a partir de los datos del producto

### Scenario 3: Navegación con breadcrumb

- **Dado que:** El producto "Molde Silicona Rosas" pertenece a la categoría "Moldes"
- **Cuando:** El cliente visualiza la ficha del producto
- **Entonces:** Se muestra un breadcrumb "Inicio > Moldes > Molde Silicona Rosas" con enlaces activos a cada nivel

### Scenario 4: Producto no disponible

- **Dado que:** El producto "Sprinkles Arcoíris" tiene `is_available = false`
- **Cuando:** El cliente accede a la ficha del producto
- **Entonces:** Se muestra la ficha completa con un badge "Agotado" visible, y el botón de WhatsApp está deshabilitado o no se muestra

### Scenario 5: Producto no visible o inexistente (Error/Excepción)

- **Dado que:** El producto tiene `is_visible = false`, o el slug solicitado no existe
- **Cuando:** El cliente accede directamente a la URL del producto
- **Entonces:** Se muestra una página 404 con mensaje amigable y enlace para volver al catálogo

## Implementation Plan

### Task 1: Typed data-fetching helpers para productos (~30 min) ✅

- **Type:** `[SC]` / lib
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Commit:** `c275981`
- **Files:**
  - `src/lib/supabase/queries/products.ts` *(crear)* — helpers `fetchProductBySlug(slug)`, `fetchProductWithCategory(slug)`
- **Details:**
  - `fetchProductBySlug(slug: string): Promise<Product | null>` — filtra `is_visible = true` y slug, usa patrón ADR-005 (typed assertion)
  - La query hace JOIN con `categories` para obtener `category_name` y `category_slug` (para breadcrumb)
  - Retornar `null` si no existe → la page llama `notFound()`
- **Verification:** `npx tsc --noEmit` sin errores

### Task 2: Configurar remotePatterns para Supabase Storage (~15 min) ✅

- **Type:** Config
- **Cycle:** IMPLEMENT ✅ → REFACTOR ✅
- **Note:** Ya estaba configurado desde HU-1.1 — no requirió cambios ✅
- **Files:**
  - `next.config.ts` *(modificar)* — agregar `remotePatterns` para el dominio de Supabase Storage
- **Details:**
  - Extraer el hostname de `NEXT_PUBLIC_SUPABASE_URL` (env var existente)
  - Pattern: `{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }`
  - Fallback para imágenes null: usar placeholder local o gradient CSS
- **Verification:** `npm run build` sin warnings de Image domain

### Task 3: Componente Breadcrumb `[SC]` (~20 min) ✅

- **Type:** `[SC]` Server Component
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Commit:** `c275981`
- **Files:**
  - `src/components/storefront/Breadcrumb.tsx` *(crear)*
- **Details:**
  - Props: `items: { label: string; href?: string }[]`
  - Último item sin href (item activo, no clickeable)
  - Separador: `>` o `/` con accesibilidad (`aria-label="breadcrumb"`, `aria-current="page"` en último item)
  - Estilos alineados con la paleta del proyecto
- **Verification:** Renderiza correctamente en Vitest (snapshot o assert text)

### Task 4: Componente WhatsAppCTA `[CC]` (~20 min) ✅

- **Type:** `[CC]` Client Component
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Commit:** `c275981`
- **Files:**
  - `src/components/storefront/WhatsAppCTA.tsx` *(crear)*
- **Details:**
  - Props: `productName: string`, `isAvailable: boolean`
  - Si `isAvailable = true`: botón verde con ícono WhatsApp, `href="https://wa.me/{WHATSAPP_NUMBER}?text=..."` mensaje pre-compuesto con nombre del producto
  - Si `isAvailable = false`: botón deshabilitado (badge "Agotado" o botón `disabled`)
  - `WHATSAPP_NUMBER` desde `src/lib/constants.ts` (ya existe)
  - Abrir en `_blank` con `rel="noopener noreferrer"`
- **Verification:** Test verifica href generado y estado disabled cuando `isAvailable=false`

### Task 5: Página de detalle `/productos/[slug]` con generateMetadata `[SC]` (~45 min) ✅

- **Type:** `[SC]` Server Component — crítico para SEO
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Commit:** `c275981`
- **Files:**
  - `src/app/(storefront)/productos/[slug]/page.tsx` *(crear)*
  - `src/app/(storefront)/productos/[slug]/not-found.tsx` *(crear)*
- **Details:**
  - `generateMetadata({ params })`: llama `fetchProductBySlug`, construye `title`, `description`, `openGraph.images`
  - Fallback SEO si `image_url` es null: no incluir `og:image` o usar imagen placeholder
  - `generateStaticParams()`: NO usar en MVP (demasiados productos, SSR on-demand es suficiente)
  - Cuerpo de la página:
    - `<Image>` de Next.js con `priority` (LCP), `fill` o dimensiones fijas
    - Breadcrumb: Inicio → [Categoría] → [Producto]
    - Badge: "Disponible" (verde) o "Agotado" (gris/rojo)
    - Precio formateado: `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`
    - Descripción con `whitespace-pre-wrap` para líneas múltiples
    - `<WhatsAppCTA>` como Client Component embebido
  - Si `fetchProductBySlug` retorna `null` → `notFound()`
- **Verification:** `npm run dev` + acceso manual a `/productos/[slug-real]`

### Task 6: Tests de integración para HU-1.2 (~45 min) ✅

- **Type:** `[TEST]`
- **Cycle:** TEST ✅ → REFACTOR ✅
- **Commit:** `c275981` | Tests: 64/64 passing (10 suites)
- **Files:**
  - `src/tests/integration/hu-1.2-scenarios.test.tsx` *(crear)*
  - `src/tests/integration/ProductDetail.test.tsx` *(crear)*
  - `src/tests/integration/WhatsAppCTA.test.tsx` *(crear)*
  - `src/tests/integration/Breadcrumb.test.tsx` *(crear)*
- **Details:**
  - `hu-1.2-scenarios.test.tsx`: test de cada BDD scenario (mock de Supabase, validar renders)
  - Scenario 1: producto visible+disponible → badge "Disponible", botón WhatsApp activo
  - Scenario 4: `is_available=false` → badge "Agotado", CTA deshabilitado
  - Scenario 5: slug inexistente → `notFound()` llamado
  - `WhatsAppCTA.test.tsx`: href correcto, atributo `disabled` en estado agotado
  - `Breadcrumb.test.tsx`: ítems renderizados, último sin href, `aria-current="page"`
- **Verification:** `npx vitest run` — 100% passing, sin errores TS

### Task 7: Validación end-to-end (~20 min) — ⏳ PENDIENTE (manual)
- **Files:** ninguno (solo ejecución)
- **Details:**
  - `npm run build` — sin errores TypeScript ni Next.js
  - `npm run dev` — verificar:
    - `/productos/[slug-de-producto-real]` carga correctamente
    - **Chrome DevTools → Elements**: meta tags `og:title`, `og:description` presentes
    - Breadcrumb navega a `/categorias/[slug]`
    - Botón WhatsApp abre `wa.me/...` con texto correcto
    - Producto con `is_available=false` muestra badge "Agotado"
    - URL inválida (`/productos/slug-fake`) devuelve 404
  - Lighthouse mobile score ≥ 90 en página de producto
- **Verification:** `npm run build` exitoso + checklist manual completo

## Database Changes

Ninguno — HU-1.2 reutiliza las tablas `products` y `categories` con sus columnas y RLS existentes.

> Query requerida:
> ```sql
> SELECT p.*, c.name as category_name, c.slug as category_slug
> FROM products p
> JOIN categories c ON p.category_id = c.id
> WHERE p.slug = $1 AND p.is_visible = true;
> ```

## Manual Testing Checklist

- [ ] Acceder a `/productos/[slug-real]` con producto disponible — ver imagen, nombre, precio, badge "Disponible"
- [ ] Clic en botón WhatsApp — abre `wa.me/` con texto pre-compuesto con nombre del producto
- [ ] Ver breadcrumb: "Inicio > [Categoría] > [Producto]" — cada enlace navega correctamente
- [ ] Verificar en DevTools: `<title>`, `og:title`, `og:description`, `og:image` en `<head>`
- [ ] Acceder a producto con `is_available = false` — badge "Agotado", botón deshabilitado
- [ ] Acceder a `/productos/slug-que-no-existe` — página 404 amigable con enlace al catálogo
- [ ] Compartir enlace en WhatsApp Web — preview muestra imagen y descripción (og: tags)
- [ ] Verificar en mobile (Chrome DevTools Toggle Device) — layout responsivo correcto

## Definition of Done

- [ ] Todos los BDD criteria tienen tests pasando (Scenarios 1-5)
- [ ] `npx tsc --noEmit` — cero errores TypeScript
- [ ] `npm run build` — cero errores, cero warnings
- [ ] `npx vitest run` — 100% passing
- [ ] RLS validada: query filtra `is_visible = true` (anon no ve productos ocultos)
- [ ] Entry en CHANGELOG.md redactada
- [ ] Todos los cambios committed con prefijo `feat(HU-1.2):`
- [ ] Tag `HU-1.2` creado en git
