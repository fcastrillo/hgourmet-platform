# HU-2.3: Importación masiva de productos vía CSV

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** High

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** cargar un archivo CSV con múltiples productos para agregarlos al catálogo de forma masiva
- **Para poder:** migrar el inventario completo (~300-1000 productos) sin ingresarlos uno por uno

---

## Acceptance Criteria

1. El panel ofrece una sección de "Importar CSV" con instrucciones claras y un archivo CSV de ejemplo descargable.
2. El sistema acepta archivos CSV con columnas: nombre, descripción, precio, categoría (nombre o slug), SKU, is_available, is_featured, is_seasonal.
3. Antes de importar, se muestra una previsualización con el conteo de filas válidas vs. filas con errores.
4. Las filas con errores de validación se reportan con número de fila y motivo (precio inválido, categoría inexistente, nombre vacío).
5. Solo las filas válidas se insertan; las filas con errores no bloquean la importación parcial.
6. El sistema muestra un resumen post-importación: N productos creados, M errores.
7. La importación es idempotente respecto al SKU: si un SKU ya existe, la fila se marca como "duplicado" y se omite (no se sobrescribe).

---

## BDD Scenarios

### Escenario 1: Importación exitosa completa

> **Dado que** soy una administradora autenticada y tengo un archivo CSV con 50 productos válidos,
> **Cuando** subo el archivo y confirmo la importación,
> **Entonces** el sistema crea los 50 productos en la base de datos y muestra un resumen "50 creados, 0 errores".

### Escenario 2: Importación parcial con errores

> **Dado que** subo un CSV con 30 filas válidas y 5 filas con errores (precio negativo, categoría inexistente),
> **Cuando** confirmo la importación,
> **Entonces** el sistema crea los 30 productos válidos, omite las 5 filas con errores, y muestra un detalle de cada error con número de fila y motivo.

### Escenario 3: SKU duplicado (error)

> **Dado que** subo un CSV donde 3 filas tienen un SKU que ya existe en la base de datos,
> **Cuando** confirmo la importación,
> **Entonces** el sistema omite las filas duplicadas, importa las restantes, y reporta "3 duplicados omitidos" en el resumen.

---

## Technical Notes

- **ADR-003:** CSV Import for Bulk Product Upload
- **Components:** CSV import page `[CC]`, CSV parser (client-side), Import action `[SA]`
- **Parsing:** Client-side CSV parsing con previsualización antes de enviar al server
- **Batch insert:** Server Action que recibe las filas validadas y ejecuta batch insert
- **Slug generation:** Automática desde el nombre para cada fila importada
- **Template:** Archivo CSV de ejemplo disponible para descarga
