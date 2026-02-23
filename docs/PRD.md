# Product Requirements Document (PRD)

> **Project:** hgourmet-platform
> **Last updated:** 2026-02-20

---

## Vision

HGourmet es una tienda de insumos gourmet para repostería ubicada en Mérida, Yucatán. Ante la presión de costos operativos (renta del local físico), el proyecto busca trasladar la experiencia de compra a un canal digital que funcione como **canal de rescate operativo y continuidad comercial**. La plataforma permite a los clientes explorar el catálogo completo, verificar disponibilidad y realizar pedidos vía WhatsApp, reduciendo la dependencia del espacio físico sin perder la cercanía con la clientela local.

---

## Users

### Persona 1: Dueñas / Administradoras

- **Who:** Propietarias de HGourmet. Operan el negocio día a día sin formación técnica.
- **Goal:** Gestionar catálogo, precios e inventario de forma rápida y sencilla desde un panel administrativo.
- **Pain point:** Sistemas complicados o lentos. Dependen de presencia física para atender clientes y gestionar inventario.

### Persona 2: Clientes Locales (reposteros, estudiantes, amas de casa)

- **Who:** Compradores de insumos gourmet y utensilios de repostería en Mérida.
- **Goal:** Ver productos disponibles con precios, fotos y descripciones claras. Contactar rápido por WhatsApp para hacer pedidos.
- **Pain point:** No saber si hay stock disponible. Falta de fotos o descripciones de productos. Necesidad de ir físicamente a la tienda para ver el catálogo.

### Persona 3: Clientes Recurrentes (~500 en WhatsApp)

- **Who:** Compradores frecuentes con pedidos repetitivos, actualmente gestionados por WhatsApp.
- **Goal:** Consultar catálogo y disponibilidad desde el celular sin necesidad de preguntar por mensaje.
- **Pain point:** Confirmar todo por mensaje (disponibilidad, precios, novedades). Sin acceso autónomo al catálogo.

---

## MVP Scope

### IN Scope

- Catálogo digital de productos con navegación por categorías: Chocolate, Harinas, Sprinkles, Moldes, Materia Prima, Accesorios.
- Fichas de producto: imagen, nombre, descripción, precio, disponibilidad.
- Secciones "Lo más vendido" y "Productos de temporada".
- Enlace fijo de WhatsApp en todo el sitio para realizar pedidos.
- Página de contacto: WhatsApp, Facebook, Instagram, horarios, ubicación (mapa).
- Panel de administración para gestión de productos (CRUD + carga CSV).
- Control manual de inventario (alta / baja / ocultar productos sin stock).
- Banner rotativo editable en la página principal.
- Sección de recetas y tips (alta / ocultar / editar).
- Diseño responsivo (mobile-first).
- Integración con redes sociales (Facebook e Instagram — enlaces, sin feed dinámico).

### OUT of Scope (V1)

- Pagos en línea o carrito con checkout — pedidos se gestionan vía WhatsApp.
- Generación de guías de envío.
- Integración automática con sistema POS.
- Recomendaciones personalizadas por usuario.
- WhatsApp Business API (se usa enlace directo).
- Seguimiento de pedidos en la plataforma.
- Sistema de cuentas de usuario para clientes.
- Registro a boletín informativo (email) y gestión de suscriptores (se mueve a roadmap post-MVP).

---

## KPIs (Success Metrics)

| KPI | Target | Measurement Method |
|:----|:-------|:-------------------|
| Usuarios únicos mensuales | ≥ 500 en el primer mes | Google Analytics |
| Pedidos vía WhatsApp originados desde la web | ≥ 50 en el primer mes | UTM en enlace WhatsApp + tracking manual |
| Productos publicados activos | ≥ 300 | Conteo en panel de administración |
| Performance score (mobile) | ≥ 90/100 Lighthouse | Lighthouse audit |
| Feedback positivo de clientes | ≥ 80% menciones positivas | Monitoreo en WhatsApp y redes sociales |
| Reducción de costos operativos | ≥ 30% en gastos fijos | Comparación pre/post lanzamiento |

---

## Feature Overview

| ID | Feature | Priority | Status |
|:---|:--------|:---------|:-------|
| FEAT-1 | Catálogo Digital de Productos | High | Pending |
| FEAT-2 | Panel de Administración | High | Pending |
| FEAT-3 | Canal de Comunicación y Conversión WhatsApp | High | Pending |
| FEAT-4 | Contenido y Marketing Digital | Medium | Pending |

---

## Constraints

- **Timeline:** MVP agresivo de 2-3 semanas.
- **Budget:** Hosting ≤ 200 MXN/mes (Vercel free tier + Supabase free tier cubren el inicio).
- **Content:** Fotografía de productos será proporcionada por las dueñas; no hay presupuesto para producción profesional.
- **Branding:** No existe manual de marca. Se propondrán paletas basadas en el tono "gourmet moderno y familiar".
- **Training:** Las dueñas necesitan capacitación express (≤ 2 horas) para operar el panel de administración.
- **Geography:** Ventas limitadas a Mérida inicialmente. Pago contra entrega o terminal en tienda.
- **Inventory:** Actualización manual diaria o semanal desde el panel o CSV.
