# 🧁 Product Requirements Document (PRD)
## Proyecto: HGourmet – Tienda Virtual
**Versión:** 1.0  
**Fecha:** 2026-02-14  
**Duración estimada MVP:** 3 semanas  
**Responsable:** Equipo de transición digital HGourmet  
**Redactado por:** PRD Architect  

---

## 1. Problema

HGourmet, un pequeño negocio de repostería y productos gourmet con punto de venta físico en Mérida, enfrenta altos costos operativos —principalmente renta— que amenazan su continuidad.  
El objetivo es **trasladar la experiencia de la tienda física a un entorno digital**, manteniendo su clientela y reduciendo la dependencia del espacio físico.

### Problemas identificados
- Renta mensual no sostenible frente al nivel de ingresos (35,000–50,000 MXN/mes).  
- Ausencia de presencia digital formal (solo atención por WhatsApp).  
- Catálogo físico y visual desorganizado, sin sincronización con inventario.  
- Falta de branding digital (colores, identidad visual, fotografía profesional).  

---

## 2. Objetivos del Proyecto

| Objetivo | Tipo | Indicador de Éxito |
|-----------|------|-------------------|
| Reducir costos operativos en 30% | Financiero | Disminución de gastos fijos tras cierre o reducción de local |
| Mantener volumen de ventas mensual | Comercial | ≥ 35,000 MXN promedio mensual a través del canal virtual |
| Preservar presencia de marca en Mérida | Branding | ≥ 80% de clientes actuales interactúan vía web o redes |
| Validar viabilidad del canal digital | Estratégico | ≥ 50 pedidos confirmados por WhatsApp desde la web en primer mes |

---

## 3. Usuarios y Personas Clave

| Persona | Perfil | Necesidades | Frustraciones |
|----------|---------|--------------|----------------|
| **Dueñas (Administradoras)** | Operan catálogo y atención. Sin formación técnica. | Subir productos fácilmente, actualizar precios e inventario. | Sistemas complicados o lentos. |
| **Clientes locales (reposteros, estudiantes, amas de casa)** | Compran insumos gourmet y utensilios. | Ver productos y precios, contactar rápido por WhatsApp. | No saber si hay stock, falta de fotos o descripciones. |
| **Clientes recurrentes (≈500 en WhatsApp)** | Compras frecuentes, pedidos repetitivos. | Consultar catálogo y disponibilidad desde celular. | Necesidad de confirmar todo por mensaje. |

---

## 4. Alcance del MVP (Fase 1)

### 🟢 Funcionalidades Incluidas

**Frontend (Cliente):**
- Página principal con banner rotativo e imagen cálida.
- Menú principal con categorías: Chocolates, Harinas, Sprinkles, Moldes, Materia Prima, Accesorios.
- Fichas de producto (imagen, nombre, descripción, precio, disponibilidad).
- Sección “Lo más vendido” y “Productos de temporada”.
- Página de contacto (WhatsApp, Facebook, Instagram, horarios, mapa).
- Enlace directo a WhatsApp para pedidos (“Pide por WhatsApp”).
- Boletín informativo (registro por email).

**Backend (Administración):**
- Carga y edición de productos vía panel simple o CSV.
- Control manual de inventario (alta/baja/ocultar).
- Sección para agregar/ocultar recetas y tips.
- Actualización de banners e imágenes.

**Comunicación:**
- Enlace fijo de WhatsApp en pantalla.
- Integración con Facebook e Instagram (enlaces, sin feed dinámico).
- Correo de contacto automatizado.

---

### 🔴 Funcionalidades Fuera del Alcance (Fase 1)
- Pagos en línea o carrito con checkout.  
- Generación de guías de envío.  
- Integración automática con POS.  
- Recomendaciones o personalización por usuario.  

---

## 5. Requerimientos Detallados

### Funcionales
| ID | Requerimiento | Prioridad |
|----|----------------|------------|
| F1 | Mostrar catálogo con filtros por categoría y búsqueda | Alta |
| F2 | Integrar enlace fijo de WhatsApp visible en todo el sitio | Alta |
| F3 | Subir productos mediante panel con campos (nombre, descripción, precio, imagen) | Alta |
| F4 | Posibilidad de ocultar productos sin stock | Alta |
| F5 | Cargar banner rotativo con imágenes editables | Media |
| F6 | Registro al boletín informativo vía email | Media |
| F7 | Visualización de redes sociales con enlaces | Media |
| F8 | Panel de recetas y tips (alta/ocultar/editar) | Baja |
| F9 | Sección “Marcas HGourmet” con logos de proveedores | Baja |

### No Funcionales
| ID | Requerimiento | Métrica |
|----|----------------|----------|
| NF1 | Sitio responsivo para móvil y escritorio | ≥ 95% puntuación en Lighthouse (mobile) |
| NF2 | Tiempo de carga inicial | < 2.5 s |
| NF3 | Facilidad de mantenimiento | Capacitación ≤ 2 h para uso del panel |
| NF4 | Seguridad básica | HTTPS, protección de formularios, sin datos sensibles |
| NF5 | Hosting ligero y de bajo costo | ≤ 200 MXN/mes |

---

## 6. Diseño y Experiencia de Usuario

**Estilo visual:** “Gourmet moderno y familiar”.  

**Propuesta cromática (a validar con clienta):**
1. **Cálidos pastel:** beige, rosa palo, dorado.  
2. **Chocolate y crema:** marrones suaves con dorado.  
3. **Minimal gourmet:** blanco, negro y acentos rosé.

**Tipografía:** Sans-serif redondeada (Poppins, Lato o Nunito).  
**Moodboard:** imágenes cálidas, utensilios, repostería artesanal.  

**UX flow:**  
Inicio → Categoría → Producto → “Pide por WhatsApp” → Conversación → Pago contra entrega.

---

## 7. Arquitectura Técnica (Vibe Coding Stack)

**Inspirado en:** *Tech Stack for Vibe Coding Modern Applications – Kdnuggets*  

**Stack propuesto:**
- **Frontend:** Next.js + TailwindCSS  
- **Backend:** Supabase (auth + base de datos + almacenamiento imágenes)  
- **Hosting:** Vercel  
- **CMS liviano:** Direct upload o panel Supabase Studio  
- **Integraciones:** WhatsApp API (link), EmailJS (boletín), Google Analytics

**Razonamiento:**  
Desarrollo “Vibe Coding-first” que favorece despliegue rápido, personalización sin vendor lock-in y bajo costo de mantenimiento.

---

## 8. Elementos para Validación de Prioridades con las Dueñas

Antes de definir cronograma o sprints, se recomienda validar con las dueñas los siguientes elementos:

**Requerimientos funcionales a priorizar (Sección 5):**
- Revisar la tabla F1–F9 y confirmar o ajustar prioridades (Alta/Media/Baja).
- Validar qué categorías de producto son imprescindibles para el lanzamiento inicial.

**Alcance del MVP (Sección 4):**
- Confirmar qué funcionalidades “Incluidas” son críticas vs. deseables.
- Validar qué funcionalidades “Fuera de alcance” podrían postergarse o adelantarse.

**Objetivos y KPIs (Secciones 2 y 9):**
- Alinear metas de negocio (ventas, pedidos, usuarios) con expectativas realistas.
- Definir qué indicadores son no negociables para considerar el MVP exitoso.

**Propuesta visual (Sección 6):**
- Validar opciones cromáticas y tono de marca antes de iniciar diseño.

---

## 9. Métricas de Éxito (KPIs)

| Categoría | Indicador | Meta |
|------------|------------|------|
| Uso del sitio | Usuarios únicos | ≥ 500 en el primer mes |
| Conversión | Pedidos vía WhatsApp desde web | ≥ 50 |
| Contenido | Productos publicados | ≥ 300 activos |
| Tiempo de carga | Lighthouse Performance | ≥ 90/100 |
| Satisfacción | Feedback positivo en WhatsApp o redes | ≥ 80% menciones positivas |

---

## 10. Roadmap de Evolución

| Fase | Descripción | Horizonte |
|------|--------------|------------|
| **MVP (actual)** | Catálogo + WhatsApp | 0–1 mes |
| **Fase 2** | Pagos en línea (Stripe o MercadoPago), carrito y control básico de pedidos | 2–3 meses |
| **Fase 3** | Seguimiento de pedidos, notificaciones, fidelización y cursos/eventos | 6 meses |
| **Fase 4** | Integración automática con POS y panel de analítica | 12 meses |

---

## 11. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|----------|-------------|
| Falta de tiempo de las dueñas para actualizar inventario | Alta | Capacitación y plantilla de actualización rápida (CSV) |
| Escasa calidad fotográfica inicial | Media | Plantilla de fotos + guía de luz y fondo proporcionada |
| Retraso en diseño o branding | Media | Priorizar estructura y cargar logo provisional |
| Baja adopción digital por clientas locales | Media | Campaña en redes y en tienda física: “Visita nuestra tienda virtual” |
| Falta de integración futura con POS | Baja | Diseñar base de datos con identificador SKU único |

---

## 12. Recomendaciones Estratégicas

1. **No invertir aún en pasarelas de pago**; enfocar recursos en catálogo visual, UX y comunicación.  
2. **Capacitación express (2 h)** para actualización de productos e inventario.  
3. **Activar WhatsApp Business** a mediano plazo (permite catálogo e informes).  
4. **Recolectar emails** desde el día uno para boletines y promociones.  
5. **Usar feedback** de clientas recurrentes para priorizar funcionalidades en Fase 2.  

---

## 13. Éxito Esperado

El MVP de HGourmet debe convertirse en un **canal de rescate operativo y de continuidad comercial**, capaz de:
- Mantener el flujo de pedidos semanales.  
- Reducir la dependencia del local físico.  
- Posicionar la marca como tienda gourmet de confianza en Mérida.  
- Servir como base escalable para un e-commerce completo en 2026.