# Estrategia de Iteraciones para Lovable – HGourmet
# Versión gratuita (~5 generaciones/día)

## Principios de la estrategia

1. **Cada iteración es autocontenida** — produce algo navegable y visual
2. **De lo general a lo específico** — primero el esqueleto, luego el detalle
3. **Máximo 2-3 prompts por día** — dejar créditos para correcciones
4. **Siempre referenciar lo existente** — "Mantén todo lo que ya existe y agrega..."

---

## DÍA 1 — Fundación: Layout + Home Page

### Prompt 1.1 (Iteración principal del día)

```
Crea una aplicación web con React, React Router y TailwindCSS para "HGourmet", 
una tienda de repostería y productos gourmet en Mérida, México.

IDENTIDAD VISUAL:
- Paleta: beige (#F5F0EB), rosa palo (#E8C4C4), dorado (#C9A96E), 
  marrón chocolate (#5C3D2E), blanco (#FFFFFF)
- Tipografía: Poppins
- Estilo: gourmet moderno y familiar, bordes suaves, sombras sutiles

LAYOUT GLOBAL (presente en todas las páginas):
- Header: logo "HGourmet" a la izquierda, menú (Inicio, Catálogo, Recetas, Contacto), 
  barra de búsqueda. Responsivo con hamburger menu en móvil.
- Footer: logo + "Tu tienda gourmet en Mérida", enlaces principales, 
  íconos de redes (WhatsApp, Facebook, Instagram), campo de suscripción al boletín, 
  © 2026 HGourmet
- Botón flotante de WhatsApp verde fijo en esquina inferior derecha (todas las páginas)

PÁGINA DE INICIO (/):
- Hero banner con imagen placeholder de repostería y CTA "Explora nuestro catálogo"
- Sección "Categorías": 6 tarjetas con ícono e imagen — Chocolates, Harinas, 
  Sprinkles, Moldes, Materia Prima, Accesorios
- Sección "Lo más vendido": 4 tarjetas de producto (imagen, nombre, precio en MXN)
- Sección "Productos de temporada": 4 tarjetas con badge "Temporada"
- Sección "Nuestras marcas": 6 logos placeholder en fila
- Sección "¿Por qué elegirnos?": 3 cards (Productos selectos, Atención personalizada, 
  Envío en Mérida)

Productos dummy: "Chocolate Callebaut 70%" ($189), "Harina de Almendra 500g" ($145), 
"Sprinkles Arcoíris" ($65), "Molde Silicón Rosas" ($235), "Manteca de Cacao 1kg" ($320), 
"Set Boquillas Wilton x12" ($189), "Fondant Satin Ice 1kg" ($280), 
"Colorante en Gel Americolor" ($95)

Crea también las rutas /catalogo, /recetas y /contacto como páginas placeholder 
con solo el título "Próximamente" para que la navegación funcione.

Usa Lucide React para íconos. Diseño 100% responsivo mobile-first.
```

### Prompt 1.2 (Corrección/ajuste si es necesario)
Reserva 1-2 créditos para correcciones del tipo:
- "El menú hamburger en móvil no abre, corrígelo"
- "Cambia el color del header a marrón chocolate (#5C3D2E) con texto dorado (#C9A96E)"
- "El botón de WhatsApp no se ve, hazlo más grande con animación de pulso"

---

## DÍA 2 — Catálogo y Ficha de Producto

### Prompt 2.1

```
Mantén todo lo que ya existe. Reemplaza la página placeholder de Catálogo 
con la versión completa:

CATÁLOGO (/catalogo):
- Sidebar izquierdo con filtros: categoría (checkboxes para las 6 categorías), 
  rango de precio (slider), disponibilidad (toggle)
- Grid de 12 productos dummy con: imagen placeholder, nombre, precio en MXN, 
  badge de disponibilidad (verde "En stock" o gris "Agotado")
- Cada tarjeta es clickeable y navega a /catalogo/:id
- Paginación inferior
- En móvil: los filtros se colapsan en un drawer que se abre con botón "Filtrar"

FICHA DE PRODUCTO (/catalogo/:id):
- Imagen grande placeholder
- Nombre, descripción (2-3 líneas dummy), precio en MXN
- Indicador de disponibilidad
- Categoría como tag clickeable
- Botón verde grande: "Pedir por WhatsApp" que abre enlace 
  wa.me/521XXXXXXXXXX?text=Hola, me interesa [nombre] - $[precio]
- Sección "Productos relacionados": 4 tarjetas de producto
- Breadcrumb: Inicio > Catálogo > [Nombre producto]

Usa los mismos datos dummy y estilo visual que ya existe en el sitio.
```

### Prompt 2.2 (Corrección si necesario)
- "Las tarjetas de producto no navegan a la ficha, corrige el routing"
- "El sidebar de filtros no se colapsa en móvil, corrígelo"
- "Agrega más productos dummy, necesito al menos 12 distintos"

---

## DÍA 3 — Páginas secundarias públicas

### Prompt 3.1

```
Mantén todo lo que ya existe. Reemplaza las páginas placeholder restantes:

RECETAS Y TIPS (/recetas):
- Grid de 6 tarjetas de recetas con: imagen placeholder de repostería, 
  título, extracto de 1 línea, botón "Ver receta"
- Cada tarjeta navega a /recetas/:id

DETALLE DE RECETA (/recetas/:id):
- Imagen hero grande
- Título de la receta
- Lista de ingredientes
- Pasos numerados
- Tip destacado en card con fondo dorado
- Breadcrumb: Inicio > Recetas > [Nombre receta]

Recetas dummy: "Brownies de Chocolate Callebaut", "Cupcakes de Vainilla con Fondant", 
"Galletas Decoradas con Royal Icing", "Mousse de Chocolate Blanco", 
"Pastel de Zanahoria Gourmet", "Trufas de Matcha"

CONTACTO (/contacto):
- Dos columnas: izquierda info, derecha formulario
- Info: dirección "Calle 60 #123, Centro, Mérida, Yucatán", 
  teléfono, email hola@hgourmet.com, horario Lun-Sáb 9:00-18:00
- Mapa: rectángulo gris placeholder con ícono de ubicación
- Botones grandes: "WhatsApp", "Facebook", "Instagram"
- Formulario: nombre, email, mensaje, botón "Enviar mensaje"

Usa el mismo estilo visual del resto del sitio.
```

---

## DÍA 4 — Backoffice: Layout + Dashboard + Productos

### Prompt 4.1

```
Mantén todo el sitio público tal como está. Agrega un panel de administración 
(backoffice) accesible en /admin. NO agregues login ni autenticación.

LAYOUT DEL BACKOFFICE:
- Sidebar fijo izquierdo con fondo marrón chocolate (#5C3D2E), texto claro
- Menú: Dashboard, Productos, Categorías, Banners, Recetas, Suscriptores
- Al final del sidebar: enlace "Ver sitio →" que abre el sitio público
- Header superior con título de la sección actual
- Área de contenido con fondo gris claro (#F7F7F7) y cards blancas
- En móvil: sidebar colapsable con hamburger menu

DASHBOARD (/admin):
- 4 tarjetas de métricas: Total productos (324), Activos (298), 
  Suscriptores (45), Categorías (6)
- Tabla "Últimos productos agregados" con 5 filas (nombre, categoría, precio, 
  fecha, estado)
- Botones de acción rápida: "Agregar producto", "Actualizar banner", "Ver catálogo"

PRODUCTOS (/admin/productos):
- Tabla con columnas: miniatura, nombre, categoría, precio, stock (Sí/No), 
  estado (Visible/Oculto), acciones (editar/ocultar)
- Barra superior: botón "Agregar producto", campo de búsqueda, 
  filtro por categoría (select)
- 10 filas de datos dummy
- Botón "Importar CSV" (solo visual)

FORMULARIO (/admin/productos/nuevo y /admin/productos/:id/editar):
- Campos: nombre, descripción (textarea), precio, categoría (select), 
  imagen (zona de arrastrar), disponibilidad (toggle), visible (toggle)
- Botones: "Guardar" y "Cancelar" (Cancelar regresa a la lista)

Crea las rutas /admin/categorias, /admin/banners, /admin/recetas y 
/admin/suscriptores como páginas placeholder con título "Próximamente".
```

---

## DÍA 5 — Backoffice: Páginas restantes

### Prompt 5.1

```
Mantén todo lo que ya existe. Reemplaza las páginas placeholder del backoffice:

CATEGORÍAS (/admin/categorias):
- Lista/tabla de 6 categorías: Chocolates, Harinas, Sprinkles, Moldes, 
  Materia Prima, Accesorios
- Columnas: nombre, cantidad de productos, estado, acciones (editar/ocultar)
- Botón "Agregar categoría"

BANNERS (/admin/banners):
- Lista de 3 banners con: preview thumbnail, título, orden (1,2,3), 
  estado activo/inactivo (toggle), acciones (editar/eliminar)
- Botón "Agregar banner"

RECETAS (/admin/recetas):
- Tabla: miniatura, título, fecha publicación, estado visible/oculto, 
  acciones (editar/ocultar)
- 4 filas con los datos de recetas que ya existen en el sitio público
- Botón "Agregar receta"

SUSCRIPTORES (/admin/suscriptores):
- Tabla: email, fecha de registro
- 8 filas dummy con emails ficticios y fechas variadas
- Botón "Exportar CSV" (solo visual, no funcional)

Mantén el mismo estilo del backoffice: sidebar marrón, fondo gris claro, 
cards blancas, y todo responsivo.
```

---

## DÍA 6 — Carrito de compras + Registro de usuario (visual/dummy)

> **Nota:** Estas funcionalidades están fuera del alcance del MVP Fase 1 según el PRD.
> Se agregan como **prototipo visual** para validar la experiencia con la clienta.
> El carrito NO tiene checkout real — redirige a WhatsApp con el pedido completo.
> El registro NO tiene lógica real — solo muestra un mensaje de éxito.

### Prompt 6.1 (Header + Carrito drawer + Modal de registro)

```
Mantén todo lo que ya existe en el sitio público y el backoffice. 
Modifica SOLO el header del sitio público y agrega dos nuevos componentes.

MODIFICACIÓN AL HEADER:
- Mantén el logo, menú, barra de búsqueda y hamburger menu tal como están
- Agrega a la derecha del menú (antes del hamburger en móvil) dos íconos 
  usando Lucide React:
  1. Ícono de usuario (User) — al dar clic abre un modal de registro
  2. Ícono de carrito (ShoppingCart) — muestra un badge circular rosa palo 
     con el número de productos agregados (inicia en 0). Al dar clic abre 
     un drawer lateral derecho

MODAL DE REGISTRO (se abre al dar clic en ícono de usuario):
- Overlay oscuro semitransparente
- Card centrada blanca con bordes redondeados
- Título: "Crear cuenta"
- Campos del formulario: 
  - Nombre completo (input text)
  - Correo electrónico (input email)  
  - Contraseña (input password)
  - Confirmar contraseña (input password)
- Botón principal: "Registrarme" con fondo dorado (#C9A96E), texto blanco
- Al dar clic en "Registrarme": cierra el modal y muestra un toast/notificación 
  en la parte superior que diga "¡Registro exitoso! Bienvenido/a a HGourmet" 
  con fondo verde y que desaparezca después de 3 segundos
- Botón "X" para cerrar el modal
- Texto inferior: "¿Ya tienes cuenta? Inicia sesión" (sin funcionalidad, solo texto)

DRAWER DEL CARRITO (se abre al dar clic en ícono de carrito):
- Panel lateral derecho que se desliza desde el borde derecho con overlay oscuro
- Header del drawer: "Tu carrito" con botón X para cerrar
- Si el carrito está vacío: mostrar ícono grande de carrito vacío con texto 
  "Tu carrito está vacío" y botón "Explorar catálogo" que navega a /catalogo
- Si tiene productos: lista vertical con cada producto mostrando:
  - Imagen thumbnail pequeña
  - Nombre del producto
  - Precio unitario en MXN
  - Controles de cantidad: botón "−", número, botón "+"  
  - Botón de eliminar (ícono Trash2) en rojo
  - Subtotal por producto (precio × cantidad)
- Línea separadora
- Total general en texto grande y bold
- Dos botones:
  - "Enviar pedido por WhatsApp" (verde, principal): abre wa.me con mensaje 
    formateado así: "Hola HGourmet! Quiero hacer un pedido:%0A%0A
    - [cantidad]x [nombre] - $[subtotal]%0A
    - [cantidad]x [nombre] - $[subtotal]%0A%0A
    Total: $[total]%0A%0AGracias!"
  - "Seguir comprando" (borde dorado, secundario): cierra el drawer

Usa React state (useState) para manejar los productos del carrito. 
El estado del carrito debe ser global (Context API o estado elevado en App) 
para que persista al navegar entre páginas.
Mantén el mismo estilo visual del sitio: colores, tipografía, bordes suaves.
```

### Prompt 6.2 (Botones "Agregar al carrito" en tarjetas y ficha de producto)

```
Mantén todo lo que ya existe, incluyendo el carrito drawer y el modal de registro 
que acabamos de agregar.

Agrega botones de "Agregar al carrito" en los siguientes lugares:

TARJETAS DE PRODUCTO EN PÁGINA DE INICIO (/):
- En las secciones "Lo más vendido" y "Productos de temporada", agrega a cada 
  tarjeta de producto un botón pequeño con ícono de carrito (ShoppingCart) 
  en la esquina inferior derecha de la tarjeta
- Al dar clic: suma 1 unidad del producto al carrito, el badge del carrito 
  en el header se actualiza, y muestra un toast breve "Producto agregado al carrito" 
  con fondo dorado que desaparece en 2 segundos
- Si el producto ya está en el carrito, incrementa la cantidad en 1

TARJETAS DE PRODUCTO EN CATÁLOGO (/catalogo):
- Agrega el mismo botón de carrito a cada tarjeta del grid de productos
- Mismo comportamiento: suma 1 unidad, actualiza badge, muestra toast
- Los productos con badge "Agotado" NO deben tener el botón de agregar 
  (o tenerlo deshabilitado en gris)

FICHA DE PRODUCTO (/catalogo/:id):
- Debajo del precio y disponibilidad, agrega un selector de cantidad: 
  botón "−", campo numérico (inicia en 1), botón "+"
- Agrega un botón "Agregar al carrito" con fondo dorado (#C9A96E), texto blanco, 
  ícono de carrito, al lado del botón existente "Pedir por WhatsApp"
- Ambos botones deben quedar en fila (flex row) en escritorio, 
  y apilados (flex column) en móvil
- Al dar clic en "Agregar al carrito": agrega la cantidad seleccionada al carrito, 
  actualiza el badge, muestra toast de confirmación
- El botón de "Pedir por WhatsApp" se mantiene exactamente como está 
  (para pedidos directos de un solo producto)

No modifiques nada del backoffice ni de las páginas de Recetas y Contacto.
Usa los mismos colores y estilo del sitio.
```

### Prompt 6.3 (Corrección si necesario)
Reserva 1 crédito para correcciones del tipo:
- "El badge del carrito no se actualiza al agregar productos, corrígelo"
- "El drawer del carrito no se cierra al dar clic en el overlay, corrígelo"
- "El mensaje de WhatsApp no incluye los productos correctamente, revisa el formato del link wa.me"
- "El modal de registro no se cierra con la tecla Escape, agrégalo"

---

## Resumen de la estrategia

| Día | Foco | Créditos estimados |
|-----|------|--------------------|
| 1 | Layout global + Home | 1 principal + 1-2 ajustes |
| 2 | Catálogo + Ficha de producto | 1 principal + 1 ajuste |
| 3 | Recetas + Contacto | 1 principal + 1 ajuste |
| 4 | Backoffice layout + Dashboard + Productos | 1 principal + 1-2 ajustes |
| 5 | Backoffice páginas restantes | 1 principal + 1 ajuste |
| 6 | Carrito de compras + Registro de usuario (visual) | 2 principales + 1 ajuste |

**Total estimado: 7-13 generaciones** (7 principales + correcciones)

---

## Tips importantes para ahorrar créditos

1. **Nunca pidas "rehaz todo"** — siempre di "Mantén todo lo que ya existe y..."
2. **Sé específico en las correcciones** — en vez de "no me gusta el diseño", 
   di "cambia el color del header de blanco a marrón (#5C3D2E)"
3. **Agrupa correcciones** — si tienes 3 cosas que arreglar, ponlas en un solo prompt
4. **No pidas funcionalidad real** — todo es visual/dummy, no necesitas lógica de backend
5. **Revisa bien antes de pedir cambios** — a veces un refresh del preview resuelve bugs visuales
6. **Si algo sale muy mal, no gastes créditos arreglándolo** — espera al día siguiente 
   y reintenta con un prompt más claro
7. **El Día 6 tiene 2 prompts principales** porque el carrito requiere estado global (Context API) 
   que es mejor establecer primero (Prompt 6.1) antes de agregar los botones que lo alimentan 
   (Prompt 6.2). No intentes fusionarlos en uno solo.
8. **Si el carrito pierde estado al navegar**, pide: "Mueve el estado del carrito a un 
   CartContext en App.tsx para que persista entre páginas"
