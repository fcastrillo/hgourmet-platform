# HU-2.6: Gestión de marcas/proveedores

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** Low

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** gestionar la lista de marcas y proveedores que se muestran en la sección "Nuestras Marcas" del sitio
- **Para poder:** destacar las marcas con las que trabaja la tienda y actualizar la lista cuando se agreguen nuevos proveedores

---

## Acceptance Criteria

1. La lista de marcas muestra nombre, logo (miniatura), sitio web, orden y estado (activa/inactiva).
2. El formulario de creación/edición incluye: nombre, logo (upload a bucket `brand-logos`), website URL (opcional), y toggle is_active.
3. Se puede reordenar marcas mediante controles de subir/bajar.
4. Las imágenes de logo se suben a Supabase Storage bucket `brand-logos`.
5. Solo las marcas con is_active = true se muestran en la sección pública.

---

## BDD Scenarios

### Escenario 1: Crear marca exitosamente

> **Dado que** soy una administradora autenticada,
> **Cuando** creo una nueva marca con nombre "Wilton", logo y website, y presiono "Guardar",
> **Entonces** la marca se crea, el logo se sube a Supabase Storage, y la marca aparece en la sección "Nuestras Marcas" del storefront.

### Escenario 2: Desactivar marca

> **Dado que** quiero dejar de mostrar una marca temporalmente,
> **Cuando** desactivo el toggle "Activa" de la marca,
> **Entonces** la marca deja de mostrarse en el storefront pero permanece en la lista del panel.

### Escenario 3: Marca sin nombre (error)

> **Dado que** intento crear una marca sin nombre,
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra un mensaje de validación "El nombre es obligatorio" y no crea el registro.

---

## Technical Notes

- **Components:** Brand list `[SC]`, Brand table `[CC]`, Brand form `[CC]`, Brand CRUD actions `[SA]`, `toggleBrandActive` `[SA]`
- **Storage:** Bucket `brand-logos` para logos de marcas
- **Display order:** Asignar `MAX(display_order) + 1` al crear
- **UI Standard (ADR-009):** Seguir el patrón establecido en HU-2.7:
  - Columna Acciones con icon buttons (pencil, eye/eye-slash, trash) + tooltip nativo
  - Toggle inline de `is_active` con server action dedicada y actualización optimista
  - Mobile: icon buttons con label visible y `min-h-[44px]`
  - Aria-labels: `aria-label="Editar"`, `aria-label="Activar"/"Desactivar"`, `aria-label="Eliminar"`
