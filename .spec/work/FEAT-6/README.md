# FEAT-6: Evolución UX del Panel de Administración

## Benefit Hypothesis — FEAT-6: Evolución UX del Panel de Administración

- **Para**: Dueñas y administradoras de HGourmet (perfil no técnico)
- **Que**: buscan operar el catálogo y el contenido editorial más rápido, con menor dependencia de sintaxis técnica
- **Esta Feature**: completa el dashboard administrativo con métricas/actividad accionable y simplifica la edición de recetas en campos estructurados
- **Esperamos**: reducir fricción operativa, disminuir errores de edición y acelerar el tiempo de actualización de contenido en el panel
- **Sabremos que hemos tenido éxito cuando**: las administradoras puedan actualizar recetas y navegar acciones frecuentes sin asistencia, manteniendo una capacitación operativa <= 2 horas y con menor número de dudas/incidencias reportadas en operación diaria

---

## User Stories

### HU-6.1: Dashboard administrativo completo con estado operativo del negocio

- **Como**: administradora
- **Quiero**: ver KPIs clave, actividad reciente y accesos rápidos en el dashboard
- **Para poder**: entender el estado del negocio y ejecutar tareas frecuentes sin navegar múltiples pantallas

#### Acceptance Criteria (BDD)

1) Visibilidad de métricas clave
- **Dado que**: soy una administradora autenticada
- **Cuando**: ingreso a `/admin`
- **Entonces**: visualizo KPIs de productos, categorías, recetas y marcas/banners con valores consistentes con la base de datos.

2) Actividad reciente operativa
- **Dado que**: existen altas o ediciones recientes en catálogo/contenido
- **Cuando**: cargo el dashboard
- **Entonces**: se muestra un listado de actividad reciente con fecha y estado para facilitar seguimiento operativo.

3) Escenario de excepción (estado vacío/falla de datos)
- **Dado que**: no hay actividad reciente o falla una fuente de datos secundaria
- **Cuando**: renderiza el dashboard
- **Entonces**: el sistema muestra estado vacío o degradación controlada sin bloquear el acceso a acciones rápidas.

---

### HU-6.2: Edición de recetas en campos estructurados (ingredientes, preparación, tip)

- **Como**: administradora
- **Quiero**: editar recetas en campos independientes para ingredientes, preparación y tip HGourmet
- **Para poder**: publicar contenido consistente sin depender de escribir Markdown manual

#### Acceptance Criteria (BDD)

1) Captura estructurada sin Markdown obligatorio
- **Dado que**: estoy creando o editando una receta en el panel admin
- **Cuando**: completo los campos de ingredientes, preparación y tip
- **Entonces**: la receta se guarda correctamente sin requerir sintaxis Markdown.

2) Compatibilidad con contenido legacy
- **Dado que**: existe una receta previa con contenido unificado en `content`
- **Cuando**: abro la receta para editar
- **Entonces**: el sistema preserva la información y permite migrarla a campos estructurados sin pérdida de datos.

3) Escenario de excepción (validación por sección)
- **Dado que**: envío el formulario con datos incompletos en secciones obligatorias
- **Cuando**: intento guardar la receta
- **Entonces**: se muestran errores de validación por campo y no se persiste contenido inválido.

---

## Initial Story Sequencing

1. **HU-6.2** (quick win UX + reducción de errores editoriales)
2. **HU-6.1** (dashboard completo con KPIs y actividad)

## Notes

- Esta feature extiende FEAT-2 (Panel de Administración) y mantiene compatibilidad con HU-2.8 / HU-4.3.
- Al implementar HU-6.2, validar impacto en modelo `recipes` y en render público de `/recetas/[slug]`.
