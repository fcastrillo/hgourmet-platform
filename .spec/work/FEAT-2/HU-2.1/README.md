# HU-2.1: Autenticación de administradoras

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** High

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** iniciar sesión con mi email mediante un enlace mágico (Magic Link) en un panel protegido
- **Para poder:** acceder de forma segura a las funciones de gestión del catálogo sin necesidad de recordar contraseñas

---

## Acceptance Criteria

1. La página de login muestra un campo de email con validación básica (formato de email válido).
2. Al enviar el email, el sistema muestra un mensaje de confirmación: "Revisa tu correo electrónico. Te enviamos un enlace para iniciar sesión."
3. Al hacer clic en el Magic Link recibido por email, la administradora es autenticada y redirigida al dashboard `/admin`.
4. Las rutas `/admin/*` están protegidas: un usuario no autenticado es redirigido a `/login`.
5. La sesión se mantiene mediante cookies seguras server-side (`@supabase/ssr`).
6. Existe un botón de "Cerrar sesión" visible en el panel que invalida la sesión y redirige a `/login`.

---

## BDD Scenarios

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

---

## Technical Notes

- **Auth method:** Email OTP / Magic Link via Supabase Auth (`signInWithOtp({ email })`) — ADR-008
- **Session management:** Server-side cookies via `@supabase/ssr`
- **Admin provisioning:** Manual via Supabase dashboard (ADR-001)
- **Protected routes:** Next.js middleware for `/admin/*`
- **Callback route:** `/auth/callback` to exchange the OTP token for a session
- **Components:** Login page `[CC]`, Auth callback handler `[SC]`, Auth middleware `[SC]`, Logout button `[CC]`
- **No password reset flow needed:** OTP eliminates password management entirely
