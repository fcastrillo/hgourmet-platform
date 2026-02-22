# HU-2.2: CRUD de productos desde el panel

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** High

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** crear, ver, editar y ocultar productos desde el panel de administración
- **Para poder:** mantener el catálogo actualizado con información precisa de precios, disponibilidad e imágenes

---

## Acceptance Criteria

1. La lista de productos muestra nombre, categoría, precio, disponibilidad, flags (featured/seasonal) y una miniatura de imagen.
2. La lista soporta paginación y búsqueda por nombre.
3. El formulario de creación/edición incluye: nombre, descripción, precio, categoría (select), imagen (upload a Supabase Storage), SKU, y toggles para is_available, is_featured, is_seasonal, is_visible.
4. El slug se genera automáticamente a partir del nombre al crear un producto.
5. Ocultar un producto (is_visible = false) lo retira del catálogo público sin eliminarlo de la base de datos.
6. La eliminación definitiva requiere una confirmación explícita (modal de confirmación).
7. Validaciones: precio > 0, nombre obligatorio, categoría obligatoria.
8. Al guardar, la imagen se sube a Supabase Storage bucket `product-images` y la URL se almacena en `image_url`.

---

## BDD Scenarios

### Escenario 1: Crear producto exitosamente

> **Dado que** soy una administradora autenticada en el panel,
> **Cuando** completo el formulario de nuevo producto con datos válidos (nombre, precio, categoría, imagen) y presiono "Guardar",
> **Entonces** el producto se crea en la base de datos, la imagen se sube a Supabase Storage, y el producto aparece en la lista del panel y en el catálogo público.

### Escenario 2: Editar producto

> **Dado que** soy una administradora viendo la lista de productos,
> **Cuando** hago clic en "Editar" de un producto existente, modifico el precio y presiono "Guardar",
> **Entonces** el precio se actualiza en la base de datos y el cambio se refleja inmediatamente en la lista del panel.

### Escenario 3: Ocultar producto (edge case)

> **Dado que** soy una administradora y quiero retirar un producto del catálogo sin eliminarlo,
> **Cuando** desactivo el toggle "Visible" de un producto,
> **Entonces** el producto deja de mostrarse en el storefront público pero sigue visible en la lista del panel con un indicador de "Oculto".

### Escenario 4: Validación de datos (error)

> **Dado que** intento crear un producto con precio ≤ 0 o sin nombre,
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra mensajes de validación específicos y no crea el registro.

---

## Technical Notes

- **Components:** Product list page `[SC]`, Product table `[CC]`, Product form `[CC]`, Product CRUD actions `[SA]`, `toggleProductVisible` `[SA]`
- **Storage:** Bucket `product-images` para imágenes de productos
- **Slug generation:** Automática desde el nombre (slugify)
- **RLS:** Authenticated users tienen full access (SELECT, INSERT, UPDATE, DELETE)
- **UI Standard (ADR-009):** Seguir el patrón establecido en HU-2.7:
  - Columna Acciones con icon buttons (pencil, eye/eye-slash, trash) + tooltip nativo
  - Toggle inline de `is_visible` con server action dedicada y actualización optimista (el toggle principal de visibilidad pública)
  - Los flags `is_featured` e `is_seasonal` permanecen en el formulario de edición (se cambian con menor frecuencia)
  - Mobile: icon buttons con label visible y `min-h-[44px]`
  - Aria-labels: `aria-label="Editar"`, `aria-label="Mostrar"/"Ocultar"`, `aria-label="Eliminar"`
