# FEAT-2: Panel de Administración

## Benefit Hypothesis

- **Para**: las dueñas/administradoras de HGourmet (personas sin formación técnica)
- **Que**: necesitan gestionar el catálogo de productos, categorías, banners y marcas de forma autónoma y rápida
- **Esta Feature**: provee un panel de administración web intuitivo con login seguro, CRUD completo de productos, carga masiva vía CSV, y gestión de categorías, banners rotativos y marcas/proveedores
- **Esperamos**: que las administradoras puedan mantener el catálogo actualizado sin soporte técnico externo, con una curva de aprendizaje de ≤2 horas de capacitación
- **Sabremos que hemos tenido éxito cuando**: las administradoras logren agregar, editar y ocultar productos sin asistencia externa, y el catálogo se mantenga con ≥300 productos activos publicados

---

## User Stories

| ID | Story | Priority |
|:---|:------|:---------|
| HU-2.1 | Autenticación de administradoras | High |
| HU-2.2 | CRUD de productos desde el panel | High |
| HU-2.3 | Importación masiva de productos vía CSV | High |
| HU-2.4 | Gestión de categorías | Medium |
| HU-2.5 | Gestión de banners rotativos | Medium |
| HU-2.6 | Gestión de marcas/proveedores | Low |
| HU-2.7 | Icon buttons y toggle inline en CategoryTable | Low |

---

### HU-2.1: Autenticación de administradoras

- **Como:** administradora de HGourmet
- **Quiero:** iniciar sesión con mi email mediante un enlace mágico (Magic Link) en un panel protegido
- **Para poder:** acceder de forma segura a las funciones de gestión del catálogo sin necesidad de recordar contraseñas

**Criterios de aceptación:**

1. La página de login muestra un campo de email con validación básica (formato de email válido).
2. Al enviar el email, el sistema muestra un mensaje de confirmación: "Revisa tu correo electrónico. Te enviamos un enlace para iniciar sesión."
3. Al hacer clic en el Magic Link recibido por email, la administradora es autenticada y redirigida al dashboard `/admin`.
4. Las rutas `/admin/*` están protegidas: un usuario no autenticado es redirigido a `/login`.
5. La sesión se mantiene mediante cookies seguras server-side (`@supabase/ssr`).
6. Existe un botón de "Cerrar sesión" visible en el panel que invalida la sesión y redirige a `/login`.

**BDD:**

> **Dado que** soy una administradora con una cuenta provisionada en Supabase Auth,
> **Cuando** ingreso mi email en la página de login y presiono "Enviar enlace",
> **Entonces** el sistema envía un Magic Link a mi correo y muestra un mensaje de confirmación.

> **Dado que** recibí un Magic Link válido en mi correo,
> **Cuando** hago clic en el enlace,
> **Entonces** el sistema me autentica, crea una sesión server-side y me redirige al dashboard `/admin`.

> **Dado que** soy una administradora autenticada,
> **Cuando** hago clic en "Cerrar sesión",
> **Entonces** el sistema invalida la sesión y me redirige a la página de login.

> **Dado que** soy un usuario no autenticado (escenario de error),
> **Cuando** intento acceder a cualquier ruta `/admin/*` directamente por URL,
> **Entonces** el sistema me redirige a `/login` sin exponer contenido del panel.

> **Dado que** ingreso un email que no está registrado en el sistema (escenario de error),
> **Cuando** envío el formulario de login,
> **Entonces** el sistema muestra el mismo mensaje de confirmación genérico (sin revelar si el email existe o no), pero no envía ningún enlace.

---

### HU-2.2: CRUD de productos desde el panel

- **Como:** administradora de HGourmet
- **Quiero:** crear, ver, editar y ocultar productos desde el panel de administración
- **Para poder:** mantener el catálogo actualizado con información precisa de precios, disponibilidad e imágenes

**Criterios de aceptación:**

1. La lista de productos muestra nombre, categoría, precio, disponibilidad, flags (featured/seasonal) y una miniatura de imagen.
2. La lista soporta paginación y búsqueda por nombre.
3. El formulario de creación/edición incluye: nombre, descripción, precio, categoría (select), imagen (upload a Supabase Storage), SKU, y toggles para is_available, is_featured, is_seasonal, is_visible.
4. El slug se genera automáticamente a partir del nombre al crear un producto.
5. Ocultar un producto (is_visible = false) lo retira del catálogo público sin eliminarlo de la base de datos.
6. La eliminación definitiva requiere una confirmación explícita (modal de confirmación).
7. Validaciones: precio > 0, nombre obligatorio, categoría obligatoria.
8. Al guardar, la imagen se sube a Supabase Storage bucket `product-images` y la URL se almacena en `image_url`.

**BDD:**

> **Dado que** soy una administradora autenticada en el panel,
> **Cuando** completo el formulario de nuevo producto con datos válidos (nombre, precio, categoría, imagen) y presiono "Guardar",
> **Entonces** el producto se crea en la base de datos, la imagen se sube a Supabase Storage, y el producto aparece en la lista del panel y en el catálogo público.

> **Dado que** soy una administradora viendo la lista de productos,
> **Cuando** hago clic en "Editar" de un producto existente, modifico el precio y presiono "Guardar",
> **Entonces** el precio se actualiza en la base de datos y el cambio se refleja inmediatamente en la lista del panel.

> **Dado que** soy una administradora y quiero retirar un producto del catálogo sin eliminarlo (escenario de error/edge case),
> **Cuando** desactivo el toggle "Visible" de un producto,
> **Entonces** el producto deja de mostrarse en el storefront público pero sigue visible en la lista del panel con un indicador de "Oculto".

> **Dado que** intento crear un producto con precio ≤ 0 o sin nombre (escenario de error),
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra mensajes de validación específicos y no crea el registro.

---

### HU-2.3: Importación masiva de productos vía CSV

- **Como:** administradora de HGourmet
- **Quiero:** cargar un archivo CSV con múltiples productos para agregarlos al catálogo de forma masiva
- **Para poder:** migrar el inventario completo (~300-1000 productos) sin ingresarlos uno por uno

**Criterios de aceptación:**

1. El panel ofrece una sección de "Importar CSV" con instrucciones claras y un archivo CSV de ejemplo descargable.
2. El sistema acepta archivos CSV con columnas: nombre, descripción, precio, categoría (nombre o slug), SKU, is_available, is_featured, is_seasonal.
3. Antes de importar, se muestra una previsualización con el conteo de filas válidas vs. filas con errores.
4. Las filas con errores de validación se reportan con número de fila y motivo (precio inválido, categoría inexistente, nombre vacío).
5. Solo las filas válidas se insertan; las filas con errores no bloquean la importación parcial.
6. El sistema muestra un resumen post-importación: N productos creados, M errores.
7. La importación es idempotente respecto al SKU: si un SKU ya existe, la fila se marca como "duplicado" y se omite (no se sobrescribe).

**BDD:**

> **Dado que** soy una administradora autenticada y tengo un archivo CSV con 50 productos válidos,
> **Cuando** subo el archivo y confirmo la importación,
> **Entonces** el sistema crea los 50 productos en la base de datos y muestra un resumen "50 creados, 0 errores".

> **Dado que** subo un CSV con 30 filas válidas y 5 filas con errores (precio negativo, categoría inexistente),
> **Cuando** confirmo la importación,
> **Entonces** el sistema crea los 30 productos válidos, omite las 5 filas con errores, y muestra un detalle de cada error con número de fila y motivo.

> **Dado que** subo un CSV donde 3 filas tienen un SKU que ya existe en la base de datos (escenario de error),
> **Cuando** confirmo la importación,
> **Entonces** el sistema omite las filas duplicadas, importa las restantes, y reporta "3 duplicados omitidos" en el resumen.

---

### HU-2.4: Gestión de categorías

- **Como:** administradora de HGourmet
- **Quiero:** crear, editar, reordenar y ocultar categorías de productos desde el panel
- **Para poder:** organizar el catálogo según las necesidades del negocio sin intervención técnica

**Criterios de aceptación:**

1. La lista de categorías muestra nombre, slug, orden de visualización y estado (activa/inactiva).
2. El formulario de creación/edición incluye: nombre, descripción (opcional), y toggle is_active.
3. El slug se genera automáticamente a partir del nombre.
4. Se puede reordenar categorías mediante drag & drop o controles de subir/bajar.
5. Ocultar una categoría (is_active = false) la retira de la navegación pública pero no elimina sus productos.
6. No se puede eliminar una categoría que tenga productos asociados (FK RESTRICT).

**BDD:**

> **Dado que** soy una administradora autenticada,
> **Cuando** creo una nueva categoría con nombre "Especias" y presiono "Guardar",
> **Entonces** la categoría se crea con slug "especias", display_order asignado automáticamente, y aparece en la lista del panel y en la navegación del storefront.

> **Dado que** soy una administradora y quiero reordenar las categorías,
> **Cuando** cambio el orden de "Moldes" de posición 4 a posición 2,
> **Entonces** las posiciones de las categorías intermedias se ajustan automáticamente y el orden se refleja en la navegación pública.

> **Dado que** intento eliminar la categoría "Chocolate" que tiene 15 productos asociados (escenario de error),
> **Cuando** confirmo la eliminación,
> **Entonces** el sistema bloquea la operación y muestra "No se puede eliminar: 15 productos asociados. Mueva o elimine los productos primero."

---

### HU-2.5: Gestión de banners rotativos

- **Como:** administradora de HGourmet
- **Quiero:** crear, editar, reordenar y activar/desactivar banners promocionales desde el panel
- **Para poder:** mantener la página principal actualizada con promociones y novedades sin soporte técnico

**Criterios de aceptación:**

1. La lista de banners muestra título, imagen (miniatura), link destino, orden y estado (activo/inactivo).
2. El formulario de creación/edición incluye: título, subtítulo (opcional), imagen (upload a bucket `banner-images`), link URL (opcional), y toggle is_active.
3. Se puede reordenar los banners mediante controles de subir/bajar.
4. Las imágenes se suben a Supabase Storage bucket `banner-images`.
5. Solo los banners con is_active = true se muestran en el carrusel de la página principal.

**BDD:**

> **Dado que** soy una administradora autenticada,
> **Cuando** creo un nuevo banner con título "Promoción Navidad", imagen y link a la categoría de temporada, y presiono "Guardar",
> **Entonces** el banner se crea, la imagen se sube a Supabase Storage, y el banner aparece en el carrusel de la página principal.

> **Dado que** quiero desactivar un banner porque la promoción terminó,
> **Cuando** desactivo el toggle "Activo" del banner,
> **Entonces** el banner deja de mostrarse en el carrusel público pero permanece en la lista del panel para reactivación futura.

> **Dado que** intento crear un banner sin subir una imagen (escenario de error),
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra un mensaje de validación "La imagen es obligatoria" y no crea el banner.

---

### HU-2.6: Gestión de marcas/proveedores

- **Como:** administradora de HGourmet
- **Quiero:** gestionar la lista de marcas y proveedores que se muestran en la sección "Nuestras Marcas" del sitio
- **Para poder:** destacar las marcas con las que trabaja la tienda y actualizar la lista cuando se agreguen nuevos proveedores

**Criterios de aceptación:**

1. La lista de marcas muestra nombre, logo (miniatura), sitio web, orden y estado (activa/inactiva).
2. El formulario de creación/edición incluye: nombre, logo (upload a bucket `brand-logos`), website URL (opcional), y toggle is_active.
3. Se puede reordenar marcas mediante controles de subir/bajar.
4. Las imágenes de logo se suben a Supabase Storage bucket `brand-logos`.
5. Solo las marcas con is_active = true se muestran en la sección pública.

**BDD:**

> **Dado que** soy una administradora autenticada,
> **Cuando** creo una nueva marca con nombre "Wilton", logo y website, y presiono "Guardar",
> **Entonces** la marca se crea, el logo se sube a Supabase Storage, y la marca aparece en la sección "Nuestras Marcas" del storefront.

> **Dado que** quiero dejar de mostrar una marca temporalmente,
> **Cuando** desactivo el toggle "Activa" de la marca,
> **Entonces** la marca deja de mostrarse en el storefront pero permanece en la lista del panel.

> **Dado que** intento crear una marca sin nombre (escenario de error),
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra un mensaje de validación "El nombre es obligatorio" y no crea el registro.
