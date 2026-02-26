# ENABLER-3: Hardening del importador CSV (confiabilidad + trazabilidad)

## Objetivo del Enabler

- **Para**: Administradoras de HGourmet y equipo técnico
- **Que**: requieren importaciones masivas confiables (3k+ filas) con trazabilidad real de errores
- **Este enabler**: robustece el pipeline de `upsert` por lotes para evitar fallos silenciosos y garantizar trazabilidad por fila
- **Esperamos**: eliminar pérdidas silenciosas de filas y asegurar reporte confiable de resultados
- **Sabremos que hemos tenido éxito cuando**: una carga de ~3,382 filas reporte métricas consistentes (`created + updated + skipped + errored = total`) y no detenga progreso por fallos de lote no trazados

## Contexto

Durante la prueba con inventario real (3,382 filas), el importador logró categorizar correctamente una parte sustancial (1,900 creados), pero el resultado evidenció riesgo de:

1. **Fallo silencioso por lote**: si falla una inserción de batch, el bloque no suma a `created` y no siempre queda error detallado por fila.
2. **Métricas potencialmente engañosas**: el resumen puede no reflejar exactamente todas las filas no procesadas.
3. **Posibles colisiones de slug dentro de un mismo lote**: la estrategia actual consulta unicidad fuera del contexto completo del chunk.
4. **Throughput mejorable (secundario)**: updates fila por fila y tamaño de chunk fijo.

## Alcance Técnico

### 1) Robustez de upsert

- Si falla `insert(inserts)` de un chunk, aplicar **fallback a inserción fila individual** para capturar causa por fila.
- Persistir issue técnico por fila fallida (código + detalle) para trazabilidad en `product_import_issues`.
- Garantizar que el proceso no “pierda” filas sin explicación en el reporte final.

### 2) Integridad de métricas

- Ajustar resumen para que siempre cumpla:
  - `created + updated + skipped + errored = totalRows`
- Diferenciar claramente:
  - error de validación
  - error de DB (conflicto slug/constraint)
  - error de staging no fatal

### 3) Estrategia de slug robusta

- Evitar colisiones intra-lote:
  - cache local de slugs generados en ejecución
  - sufijo incremental estable por nombre base
- Mantener compatibilidad con `slug` único en DB.

### 4) Performance (secundario, no bloqueante)

- Hacer configurable el `CHUNK` (por env o constante centralizada).
- Evaluar estrategia para reducir roundtrips en updates (p. ej. RPC SQL o merge por staging).
- Mantener límites seguros para no exceder timeout/request payload.

## Entregables Esperados

1. Refactor de `src/lib/import/csv/upsert.ts` con fallback por fila y recolección de errores.
2. Ajustes en `src/app/(admin)/admin/productos/actions.ts` para resumen consistente.
3. Tests de integración adicionales en `hu-2.3-scenarios.test.tsx` para:
   - fallo parcial de batch
   - colisión de slug en lote
   - consistencia de métricas.
4. Nota de operación en docs (`CHANGELOG` al cerrar + actualización de estrategia técnica si aplica).

## Decisiones de Diseño (acordadas)

1. **Política de ejecución**: `best-effort`.
   - Si falla un `insert` por lote, se degrada a inserción fila individual.
   - El proceso continúa para evitar que una sola fila bloquee todo el archivo.
2. **Trazabilidad por fila**:
   - Toda fila debe terminar como `created`, `updated`, `skipped` o `errored`.
   - No se aceptan filas “sin rastro” al cierre del import.
3. **Semántica de resumen**:
   - `skipped` = filas omitidas por regla funcional (ej. `DUPLICATE_SKU`).
   - `errored` = fallas técnicas o de validación (ej. error DB insert/update, parsing inválido).
   - Invariante obligatorio: `created + updated + skipped + errored = totalRows`.

## Criterios de Aceptación

1. En importación de >3,000 filas, no existen filas “desaparecidas” sin issue asociado.
2. El resumen final cuadra matemáticamente con el total de filas.
3. Los errores de DB se visualizan con detalle utilizable para reproceso.
4. El import no se aborta globalmente por fallos puntuales de DB; concluye en modo `best-effort` con trazabilidad por fila.

## BDD (Enabler)

- **Dado que** un chunk de 50 filas puede contener una fila inválida a nivel DB,  
  **Cuando** falle el insert en bloque,  
  **Entonces** el sistema debe degradar a inserción por fila y registrar los errores específicos sin perder las filas válidas.

- **Dado que** la importación procesa miles de filas,  
  **Cuando** finaliza la ejecución,  
  **Entonces** el resumen debe reflejar exactamente el destino de cada fila (creada, actualizada, omitida o con error).

- **Dado que** pueden existir nombres repetidos dentro del mismo lote,  
  **Cuando** se generen slugs para nuevos productos,  
  **Entonces** no deben producirse colisiones que aborten silenciosamente el batch.

- **Dado que** existe una fila con error de DB dentro de un archivo grande,  
  **Cuando** se procesa la importación,  
  **Entonces** el sistema debe continuar con el resto de filas y registrar el detalle técnico de la fila fallida.
