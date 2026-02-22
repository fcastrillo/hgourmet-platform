---
name: Sprint Cosmético Storefront
overview: "Polish visual del storefront existente: hero con imagen de fondo, logo propio, navegacion reestructurada (Inicio/Catalogo/Recetas/Contacto + iconos), y showcase de categorias estilizado debajo del hero. Sin cambios de DB ni funcionalidad nueva — solo CSS/componentes."
todos:
  - id: chore-logo
    content: "Tarea 1: Integrar logo real en header y footer (~20 min)"
    status: pending
  - id: chore-hero
    content: "Tarea 2: Hero con imagen de fondo, overlay y copy aspiracional (~40 min)"
    status: pending
  - id: chore-nav
    content: "Tarea 3: Reestructurar navegacion del Header (4 links + iconos) (~45 min)"
    status: pending
  - id: chore-categories
    content: "Tarea 4: Seccion 'Nuestras Categorias' estilizada debajo del hero (~45 min)"
    status: pending
  - id: chore-polish
    content: "Tarea 5: Polish general — footer, spacing, transiciones, favicon (~30 min)"
    status: pending
isProject: false
---

# Sprint Cosmetico — Visual Polish del Storefront

## Contexto

FEAT-1 esta entregado y funcional. Antes de avanzar a FEAT-2 (Admin Panel), se aplica un sprint cosmetico tipo **chore** para elevar la presencia visual del storefront al nivel de referencia (Lovable). No genera funcionalidad nueva ni cambios de DB.

**Referencia visual:** Lovable tiene hero full-bleed con foto, monograma "H", nav limpio (Inicio, Catalogo, Recetas, Contacto + iconos), y seccion "Nuestras Categorias" estilizada.

**Tiempo estimado:** ~3-4 horas (5 tareas)

---

## Archivos principales a modificar

- [src/components/storefront/Header.tsx](src/components/storefront/Header.tsx) — reestructurar nav
- [src/components/storefront/MobileNav.tsx](src/components/storefront/MobileNav.tsx) — alinear con nuevo nav
- [src/components/storefront/HomepageHero.tsx](src/components/storefront/HomepageHero.tsx) — redisenar con imagen de fondo
- [src/app/(storefront)/page.tsx](src/app/(storefront)/page.tsx) — agregar seccion de categorias
- [src/app/(storefront)/layout.tsx](src/app/(storefront)/layout.tsx) — ajustar props del Header
- [src/app/globals.css](src/app/globals.css) — posibles tokens nuevos
- `public/images/` — hero placeholder + logo

---

## Tarea 1: Integracion del logo (~20 min)

**Objetivo:** Reemplazar el texto "HGourmet" en header/footer con el logo real.

**Cambios:**

- Colocar archivo logo en `public/images/logo.png` (o `.svg`) — proporcionado por el usuario
- Modificar `Header.tsx`: reemplazar `<Link className="font-heading text-2xl...">HGourmet</Link>` por `<Image src="/images/logo.png" alt="HGourmet" ... />`
- Dimensiones sugeridas: ~40px height en header, ~60px en footer
- Mantener fallback texto para accesibilidad (`alt="HGourmet"`)

---

## Tarea 2: Hero con imagen de fondo (~40 min)

**Objetivo:** Transformar el hero minimalista en un hero full-bleed con imagen de reposteria, overlay oscuro, y copy aspiracional.

**Cambios en** `HomepageHero.tsx`:

- Layout: `relative` con imagen de fondo via `next/image` (fill + object-cover + priority)
- Overlay: `absolute inset-0 bg-black/40` para legibilidad
- Copy actualizado: "Ingredientes premium para tus creaciones" (h1) + "Hagamos magia, hagamos reposteria" (subtitulo)
- Logo monograma centrado encima del titulo (opcional si el logo file tiene monograma)
- CTA: "Explora nuestro catalogo" con flecha

**Imagen placeholder:**

- Descargar imagen de Unsplash (reposteria/panaderia) y guardar en `public/images/hero-bg.jpg`
- Optimizar a ~1920x800px, WebP si posible
- Se reemplaza luego con foto real de la tienda

**Estructura JSX propuesta:**

```tsx
<section className="relative h-[500px] sm:h-[600px]">
  <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
    {/* Logo monograma opcional */}
    <h1 className="font-heading text-4xl font-bold sm:text-6xl">
      Ingredientes <span className="text-accent">premium</span> para tus creaciones
    </h1>
    <p className="mt-4 text-lg text-white/80">Hagamos magia, hagamos reposteria</p>
    <Link href="/categorias" className="mt-8 ...">Explora nuestro catalogo →</Link>
  </div>
</section>
```

---

## Tarea 3: Reestructurar navegacion del Header (~45 min)

**Objetivo:** Pasar de "Catalogo + categorias inline" a nav limpio estilo Lovable.

**Nav desktop** (4 links principales + iconos):

```
[Logo]    Inicio  Catalogo  Recetas  Contacto    [Busqueda] [Usuario]
```

- **Inicio** -> `/`
- **Catalogo** -> `/categorias`
- **Recetas** -> `/recetas` (pagina aun no existe, link preparado)
- **Contacto** -> `/contacto` (pagina aun no existe, link preparado)
- **Icono busqueda** -> navega a `/categorias` (donde esta el SearchBar)
- **Icono usuario** -> futuro login admin (placeholder, no funcional aun)

**Cambios:**

- `Header.tsx`: eliminar mapeo de categorias en nav desktop. Agregar 4 links fijos + 2 iconos SVG
- `MobileNav.tsx`: misma estructura (Inicio, Catalogo, Recetas, Contacto) + separador + categorias como sub-seccion
- `layout.tsx`: el Header ya no necesita recibir `categories` como prop (o las pasa solo para mobile sub-menu)

**Nota:** Las categorias se muestran en una seccion estilizada debajo del hero (Tarea 4), no en el header.

---

## Tarea 4: Seccion "Nuestras Categorias" estilizada (~45 min)

**Objetivo:** Debajo del hero, mostrar las categorias en cards visualmente atractivas (como en Lovable: "Nuestras Categorias").

**Ubicacion:** En `page.tsx`, entre el Hero y las secciones de productos (Lo mas vendido / Temporada).

**Diseno propuesto:**

- Titulo: "Nuestras **Categorias**" (palabra destacada en color accent/primary)
- Grid de cards con icono/emoji representativo, nombre, y conteo de productos
- Cards con hover suave, borde redondeado, sombra
- Link a `/categorias/[slug]` en cada card

**Componente nuevo:** `CategoryShowcase.tsx` [SC] — recibe categorias, renderiza grid decorativo. Distinto de `CategoryCard` existente (que es mas funcional/simple).

**Fetch:** Reutiliza las categorias que ya se obtienen en `layout.tsx` o hace un fetch independiente en `page.tsx` (preferible para desacoplar).

---

## Tarea 5: Polish general y consistencia (~30 min)

**Ajustes menores:**

- **Footer:** Integrar logo, revisar espaciado, agregar links a Recetas/Contacto
- **Spacing:** Revisar padding entre secciones del homepage (hero -> categorias -> featured -> seasonal)
- **Transiciones:** Asegurar hover effects consistentes en todo el storefront
- **Favicon:** Si el logo tiene monograma, generar favicon desde el
- **Color accent en titulos:** Usar patron "Nuestras **Categorias**" / "Lo mas **vendido**" para dar personalidad

---

## Impacto en tests existentes

- `homepage.test.tsx` — necesita actualizarse (cambia texto del hero y estructura)
- `storefront-layout.test.tsx` — puede necesitar ajustes si cambia la estructura del Header
- `hu-1.1-scenarios.test.tsx` — verificar que Header tests siguen pasando
- Los demas tests no deberian verse afectados

---

## Backlog: como registrarlo

Se recomienda registrarlo como **chore** en el BACKLOG, fuera de la jerarquia SAFe, ya que no genera funcionalidad nueva:

```markdown
### Chores (Technical / Visual)

- [ ] CHORE-1: Sprint cosmetico del storefront (Medium)
  > Hero con imagen, logo, nav reestructurado, seccion categorias. ~3-4 horas.
```

Alternativamente, las tareas 2 y 4 podrian absorberse en **HU-4.1** cuando se trabaje FEAT-4, pero eso dejaria el sitio sin pulir hasta entonces.

---

## Prerequisito del usuario

Antes de ejecutar, el usuario debe proporcionar:

- **Archivo de logo** (PNG/SVG, fondo transparente, idealmente version horizontal + monograma)
- **Aprobacion de la imagen placeholder** de Unsplash seleccionada

