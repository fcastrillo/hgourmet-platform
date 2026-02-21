# FEAT-1: Catálogo Digital de Productos

## Benefit Hypothesis

- **Para**: Clientes locales de HGourmet (reposteros, estudiantes, amas de casa) y clientes recurrentes (~500 en WhatsApp)
- **Que**: Buscan consultar productos disponibles con precios, fotos y descripciones claras sin visitar la tienda física ni preguntar por WhatsApp
- **Esta Feature**: Provee un catálogo digital navegable por categorías con fichas de producto completas (imagen, nombre, descripción, precio, disponibilidad), búsqueda por texto y secciones destacadas
- **Esperamos**: Que los clientes puedan explorar el catálogo de forma autónoma, reduciendo consultas repetitivas por WhatsApp y eliminando la necesidad de visitar la tienda solo para ver productos
- **Sabremos que hemos tenido éxito cuando**: Alcancemos ≥500 usuarios únicos mensuales en el catálogo y ≥300 productos publicados activos en el primer mes

## User Stories

| ID | Title | Priority | Status |
|:---|:------|:---------|:-------|
| HU-1.1 | Navegación por categorías de productos | High | [ ] Pending |
| HU-1.2 | Ficha de detalle de producto | High | [ ] Pending |
| HU-1.3 | Búsqueda y filtrado de productos | Medium | [ ] Pending |
| HU-1.4 | Sección "Lo más vendido" y "Productos de temporada" | Medium | [ ] Pending |

## Acceptance Criteria (Feature Level)

- [ ] El catálogo muestra todas las categorías activas con productos visibles y disponibles
- [ ] Cada producto tiene ficha con imagen, nombre, descripción, precio y estado de disponibilidad
- [ ] El usuario puede navegar entre categorías sin recargar la página completa
- [ ] La búsqueda por texto retorna resultados relevantes en menos de 500ms
- [ ] Las secciones "Lo más vendido" y "Productos de temporada" se muestran dinámicamente según flags en la base de datos
- [ ] El catálogo es completamente responsivo (mobile-first) y obtiene ≥90 en Lighthouse Performance
- [ ] Los productos ocultos (`is_visible = false`) no aparecen en ninguna vista pública

## Technical Notes

- **Data model impact:** Usa las tablas `categories` y `products` definidas en TECH_SPEC.md. No requiere tablas nuevas.
- **Security considerations:** RLS anon: SELECT en `categories` (todas), SELECT en `products` filtrado por `is_visible = true`. No escritura pública.
- **Dependencies:** Requiere que la base de datos Supabase esté inicializada con las tablas `categories` y `products` y sus políticas RLS.

## Out of Scope

- Carrito de compras o checkout (pedidos se gestionan vía WhatsApp — ver FEAT-3)
- Recomendaciones personalizadas por usuario
- Paginación infinita (se usará paginación estándar si el volumen lo requiere)
- Filtros avanzados por rango de precio (se evaluará en iteraciones futuras)
