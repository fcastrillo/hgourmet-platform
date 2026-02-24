# ENABLER-2: Schema Evolution + Curación de Categorías

## Contexto

El inventario real contiene 3,382 productos con estructura de origen `departamento` (18) + `categoria` (135).  
La navegación de cliente se estandariza en 7 categorías curadas:

- Utensilios
- Decoración
- Bases
- Desechables
- Chocolates
- Insumos
- Moldes

Este enabler define la arquitectura de datos para soportar:

1. Curación de categorías orientada al cliente
2. Reimportación de CSV sin pérdida de trazabilidad
3. Reprocesamiento de mapeos cuando cambien decisiones de negocio

## Objetivo del Enabler

- **Para**: dueñas y administradoras de HGourmet
- **Que**: necesitan ajustar el mapeo de categorías sin rehacer manualmente todo el catálogo
- **Este enabler**: separa datos raw de importación y datos curados de operación
- **Esperamos**: reducir retrabajo y riesgo en importaciones recurrentes
- **Sabremos que hemos tenido éxito cuando**: podamos reprocesar un batch histórico con una nueva versión de mapeo sin re-subir el archivo original

## Decisiones de Diseño

1. **`products` queda limpio (dominio operativo)**  
   Solo guarda datos de catálogo que el storefront/admin usan día a día.

2. **Se conserva el CSV completo en staging**  
   La retención de columnas originales no vive en `products`, vive en tablas de importación.

3. **Mapeo versionado**  
   El mapeo `departamento + categoria -> categoria_curada` tendrá versión para permitir cambios sin romper historial.

## Cambios de Modelo de Datos (Nivel Alto)

### Dominio (operativo)

- `categories`: agregar `image_url text` (HU-1.5)
- `products`: agregar `barcode text`, `sat_code text` (insumos reales de inventario)

### Staging (importación)

- `import_batches`  
  Metadatos de cada importación (archivo, fecha, hash, estado, versión de mapeo).

- `product_import_raw`  
  Filas crudas del CSV por batch (incluye payload completo para auditoría/reproceso).

- `category_mapping_rules`  
  Reglas de mapeo versionadas (`departamento_raw`, `categoria_raw`, `curated_category`).

- `product_import_issues`  
  Errores por fila para importación parcial y trazabilidad.

> SQL detallado queda para el objetivo de implementación correspondiente, no en este documento.

## Dependencias

- HU-2.3 (Importación masiva CSV)
- HU-1.5 (Imagen en categorías)
- Actualización de `docs/TECH_SPEC.md` (ADR-003 y data model)

## Artefactos Relacionados

- `./CATEGORY_MAPPING_V1.md`
- `./CSV_STAGING_STRATEGY.md`
- `../../FEAT-2/HU-2.3/README.md` (cuando se ejecute HU-2.3, referenciar estas reglas)

## Criterios de Aceptación (Enabler)

1. El proyecto distingue explícitamente entre modelo de dominio y modelo de staging.
2. Existe un mapeo V1 completo para las 7 categorías curadas.
3. Está documentado qué columnas del CSV se conservan en staging y cuáles pasan a dominio.
4. Está definida la estrategia de versionado de mapeo para reprocesos.

### BDD

- **Dado que** las categorías curadas pueden cambiar con feedback del negocio,  
  **Cuando** se defina una nueva versión de mapeo,  
  **Entonces** el sistema debe poder reprocesar batches históricos sin re-subir CSV.

- **Dado que** el CSV trae columnas que no son útiles en storefront,  
  **Cuando** importemos productos,  
  **Entonces** esas columnas deben conservarse en staging y no contaminar `products`.

