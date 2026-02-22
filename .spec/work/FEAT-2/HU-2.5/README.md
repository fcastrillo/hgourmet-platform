# HU-2.5: Gestión de banners rotativos

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** Medium

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** crear, editar, reordenar y activar/desactivar banners promocionales desde el panel
- **Para poder:** mantener la página principal actualizada con promociones y novedades sin soporte técnico

---

## Acceptance Criteria

1. La lista de banners muestra título, imagen (miniatura), link destino, orden y estado (activo/inactivo).
2. El formulario de creación/edición incluye: título, subtítulo (opcional), imagen (upload a bucket `banner-images`), link URL (opcional), y toggle is_active.
3. Se puede reordenar los banners mediante controles de subir/bajar.
4. Las imágenes se suben a Supabase Storage bucket `banner-images`.
5. Solo los banners con is_active = true se muestran en el carrusel de la página principal.

---

## BDD Scenarios

### Escenario 1: Crear banner exitosamente

> **Dado que** soy una administradora autenticada,
> **Cuando** creo un nuevo banner con título "Promoción Navidad", imagen y link a la categoría de temporada, y presiono "Guardar",
> **Entonces** el banner se crea, la imagen se sube a Supabase Storage, y el banner aparece en el carrusel de la página principal.

### Escenario 2: Desactivar banner

> **Dado que** quiero desactivar un banner porque la promoción terminó,
> **Cuando** desactivo el toggle "Activo" del banner,
> **Entonces** el banner deja de mostrarse en el carrusel público pero permanece en la lista del panel para reactivación futura.

### Escenario 3: Banner sin imagen (error)

> **Dado que** intento crear un banner sin subir una imagen,
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra un mensaje de validación "La imagen es obligatoria" y no crea el banner.

---

## Technical Notes

- **Components:** Banner list `[SC]`, Banner table `[CC]`, Banner form `[CC]`, Banner CRUD actions `[SA]`, `toggleBannerActive` `[SA]`
- **Storage:** Bucket `banner-images` para imágenes de banners
- **Display order:** Asignar `MAX(display_order) + 1` al crear
- **Carousel:** Integración con el componente carousel `[CC]` existente en storefront
- **UI Standard (ADR-009):** Seguir el patrón establecido en HU-2.7:
  - Columna Acciones con icon buttons (pencil, eye/eye-slash, trash) + tooltip nativo
  - Toggle inline de `is_active` con server action dedicada y actualización optimista
  - Mobile: icon buttons con label visible y `min-h-[44px]`
  - Aria-labels: `aria-label="Editar"`, `aria-label="Activar"/"Desactivar"`, `aria-label="Eliminar"`
