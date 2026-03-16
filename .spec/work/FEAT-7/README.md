# FEAT-7 — Analítica y Trazabilidad de Conversión

## Benefit Hypothesis — FEAT-7: Analítica y Trazabilidad de Conversión

- **Para**: dueñas de HGourmet y equipo comercial
- **Que**: buscan medir el rendimiento del storefront y rastrear la intención de compra por WhatsApp
- **Esta Feature**: provee instrumentación de analítica web, registro estructurado de interacciones y navegación por marca orientada a descubrimiento
- **Esperamos**: mejorar visibilidad del embudo digital y reducir fricción en la exploración del catálogo
- **Sabremos que hemos tenido éxito cuando**: se registren eventos clave de navegación/contacto en analítica y base de datos, y aumente la tasa de sesiones que pasan de marca a búsqueda de productos
- **Hypothesis:** Si entregamos analítica web + trazabilidad de interacciones de WhatsApp + navegación de marcas orientada a búsqueda, entonces HGourmet podrá medir mejor el embudo y convertir más sesiones en conversaciones comerciales, medido por mayor tasa de clics a WhatsApp y sesiones con búsqueda por marca.

## User Stories Breakdown

### HU-7.1 — Integrar Google Analytics para tracking del storefront

- **Como**: dueña de HGourmet
- **Quiero**: contar con métricas confiables del comportamiento de usuarios en el sitio
- **Para poder**: tomar decisiones de contenido, catálogo y campañas basadas en datos reales

**BDD**

1. **Dado que** un usuario navega por el storefront, **cuando** cambia de página, **entonces** se registra un `page_view` en GA4 con la ruta correcta.
2. **Dado que** un usuario hace clic en WhatsApp o usa la búsqueda, **cuando** ocurre la interacción, **entonces** se registra un evento con parámetros mínimos definidos.
3. **Dado que** el ambiente no tiene configuración de analítica, **cuando** renderiza el storefront, **entonces** la aplicación no falla y aplica degradación controlada.

### HU-7.2 — Registrar interacciones de WhatsApp en tabla de trazabilidad

- **Como**: administradora de HGourmet
- **Quiero**: tener un registro histórico de las interacciones que abren conversación por WhatsApp
- **Para poder**: medir intención de compra y priorizar seguimiento comercial

**BDD**

1. **Dado que** un usuario envía el formulario de contacto con datos válidos, **cuando** se procesa la acción, **entonces** se guarda un registro `contact_form` y luego se abre WhatsApp.
2. **Dado que** un usuario hace clic en un CTA de producto, **cuando** se ejecuta la acción, **entonces** se guarda un registro `product_interest` con referencia de producto y contexto.
3. **Dado que** falla la persistencia del registro, **cuando** el usuario intenta contactar, **entonces** el sistema mantiene un flujo recuperable sin bloquear la conversión.

### HU-7.3 — Navegación por marca con búsqueda automática en catálogo

- **Como**: cliente del storefront
- **Quiero**: que al seleccionar una marca me lleve directamente a los productos filtrados por esa marca
- **Para poder**: encontrar rápidamente productos relacionados sin pasos adicionales

**BDD**

1. **Dado que** una marca está visible en la sección de marcas, **cuando** hago clic en su enlace, **entonces** navego a `/categorias?q=<marca>` en la misma pestaña.
2. **Dado que** el nombre de la marca contiene espacios o caracteres especiales, **cuando** se genera el enlace, **entonces** la URL queda correctamente codificada.
3. **Dado que** la marca no tiene coincidencias, **cuando** se abre el catálogo filtrado, **entonces** se muestra estado vacío sin error de navegación.

### HU-7.4 — Mapa visible e interactivo en página de contacto (iframe)

- **Como**: cliente o visitante
- **Quiero**: visualizar la ubicación real de HGourmet en la página de contacto
- **Para poder**: ubicar el local rápidamente y decidir cómo llegar o contactar

**Implementación elegida**

- Opción 1: embed por `iframe` de Google Maps (sin API JS programática en esta iteración).

**BDD**

1. **Dado que** entro a `/contacto`, **cuando** la página termina de cargar, **entonces** veo un mapa real embebido con la ubicación de HGourmet.
2. **Dado que** estoy en móvil o desktop, **cuando** visualizo la sección de ubicación, **entonces** el mapa mantiene layout responsive sin desbordes.
3. **Dado que** el embed del mapa no carga, **cuando** renderiza la sección, **entonces** se muestra fallback informativo con enlace directo a Google Maps.

## Notas de Ejecución

- Alcance FEAT-7 orientado a incremento post-MVP.
- Priorizar trazabilidad de eventos y conversión sin aumentar complejidad innecesaria.
- Mantener coherencia con ADR-002 (flujo WhatsApp por deep link `wa.me`).
