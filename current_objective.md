# Objective: HU-2.1 — Autenticación de administradoras

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero iniciar sesión con mi email mediante un enlace mágico (Magic Link) en un panel protegido, para poder acceder de forma segura a las funciones de gestión del catálogo sin necesidad de recordar contraseñas
- **Spec Level:** Standard
- **Git Strategy:** trunk (commits on main)
- **TDD Mode:** flexible (IMPLEMENT → TEST → REFACTOR)

## Acceptance Criteria (BDD)

### Escenario 1: Solicitar Magic Link
> **Dado que** soy una administradora con una cuenta provisionada en Supabase Auth,
> **Cuando** ingreso mi email en la página de login y presiono "Enviar enlace",
> **Entonces** el sistema envía un Magic Link a mi correo y muestra un mensaje de confirmación.

### Escenario 2: Login exitoso vía Magic Link
> **Dado que** recibí un Magic Link válido en mi correo,
> **Cuando** hago clic en el enlace,
> **Entonces** el sistema me autentica, crea una sesión server-side y me redirige al dashboard `/admin`.

### Escenario 3: Cerrar sesión
> **Dado que** soy una administradora autenticada,
> **Cuando** hago clic en "Cerrar sesión",
> **Entonces** el sistema invalida la sesión y me redirige a la página de login.

### Escenario 4: Acceso no autorizado (error)
> **Dado que** soy un usuario no autenticado,
> **Cuando** intento acceder a cualquier ruta `/admin/*` directamente por URL,
> **Entonces** el sistema me redirige a `/login` sin exponer contenido del panel.

### Escenario 5: Email no registrado (error)
> **Dado que** ingreso un email que no está registrado en el sistema,
> **Cuando** envío el formulario de login,
> **Entonces** el sistema muestra el mismo mensaje de confirmación genérico (sin revelar si el email existe o no), pero no envía ningún enlace.

## Implementation Plan

### Task 1: Supabase middleware for session refresh + route protection ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/supabase/middleware.ts`, `src/middleware.ts`
- **Commit:** e8c9138

### Task 2: Auth callback route handler ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/auth/callback/route.ts`
- **Commit:** e8c9138

### Task 3: Login page + LoginForm component ✅
- **Type:** [SC] page + [CC] form
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/login/page.tsx`, `src/components/admin/LoginForm.tsx`
- **Commit:** e8c9138

### Task 4: Admin layout + dashboard placeholder + logout ✅
- **Type:** [SC] layout + [SC] page + [SA] logout action
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/admin/layout.tsx`, `src/app/(admin)/admin/page.tsx`, `src/app/(admin)/admin/actions.ts`, `src/components/admin/AdminSidebar.tsx`
- **Commit:** e8c9138

### Task 5: Integration tests ✅
- **Type:** [TEST]
- **Cycle:** TEST ✅
- **Files modified:** `src/tests/integration/hu-2.1-scenarios.test.tsx`
- **Results:** 10 tests passing, 103 total (0 regressions)
- **Commit:** 9669f96

### Task 6: Manual testing + refactor ✅
- **Type:** [REFACTOR]
- **Cycle:** REFACTOR ✅
- **TypeScript:** `npx tsc --noEmit` — 0 errors
- **Build:** `npx next build` — successful
- **Tests:** 103 passing, 0 failing

## Database Changes

None — Supabase Auth uses its own internal `auth.users` table. Admin accounts are provisioned manually via Supabase Dashboard.

## Manual Testing Checklist
- [ ] Navigate to `/admin` without session → redirected to `/login`
- [ ] Navigate to `/admin/productos` without session → redirected to `/login`
- [ ] Enter valid admin email on `/login` → "Revisa tu correo" message shown
- [ ] Enter non-registered email → same confirmation message shown (no information leak)
- [ ] Click Magic Link in email → redirected to `/admin` dashboard with session active
- [ ] Dashboard shows admin email and navigation menu
- [ ] Click "Cerrar sesión" → session invalidated, redirected to `/login`
- [ ] Navigate to `/login` with active session → redirected to `/admin`
- [ ] Storefront routes (`/`, `/categorias/*`, `/productos/*`) remain publicly accessible
- [ ] No TypeScript errors: `npx tsc --noEmit`

## Definition of Done
- [ ] All 5 BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] Middleware protects `/admin/*` routes
- [ ] Session persists across page reloads (cookie-based)
- [ ] Storefront unaffected by auth changes
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.1):` convention
- [ ] Tag `HU-2.1` created

## Deviations

- **Task 5 file location:** Plan specified `src/__tests__/middleware.test.ts` and `src/__tests__/auth-callback.test.ts` as separate files, but tests were consolidated into a single file `src/tests/integration/hu-2.1-scenarios.test.tsx` following the existing project convention (all HU tests live in `src/tests/integration/`). This provides better consistency with HU-1.x test files.
- **AdminSidebar as separate component:** Plan did not explicitly call for extracting the sidebar into its own component, but it was extracted as `src/components/admin/AdminSidebar.tsx` (Client Component) for better separation of concerns — the layout remains a Server Component while interactive navigation lives in the sidebar.
