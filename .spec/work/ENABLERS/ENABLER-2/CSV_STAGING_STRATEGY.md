# CSV_STAGING_STRATEGY

## Decisión

Sí se conservan todas las columnas del CSV, pero en **staging**, no en la tabla de dominio `products`.

Esto permite:

- Reimportar sin pedir de nuevo el archivo original
- Reprocesar con nueva versión de mapeo
- Auditar errores de filas específicas

## Separación de Capas

### 1) Capa Raw / Staging

Objetivo: persistir el archivo y su contenido original.

- `import_batches`
- `product_import_raw`
- `product_import_issues`
- `category_mapping_rules` (versionado)

### 2) Capa Curated / Dominio

Objetivo: operación de storefront y admin.

- `categories`
- `products`

## Contrato de Campos (V1)

| Campo CSV | Guardar en staging | Pasar a dominio `products` | Notas |
|:--|:--:|:--:|:--|
| `clave1 *` | Sí | Sí (`sku`) | Clave de idempotencia |
| `clave2` | Sí | Sí (`barcode`) | Opcional |
| `descripción *` | Sí | Sí (`name`) | Requerido |
| `departamento` | Sí | No directo | Se usa para mapping |
| `categoria` | Sí | No directo | Se usa para mapping |
| `(s/n) inventariable` | Sí | No | Trazabilidad |
| `unidad` | Sí | No (V1) | V2 puede incluirlo |
| `costo` | Sí | No (V1) | Mayormente vacío |
| `precio1` | Sí | No (V1) | Mayormente vacío |
| `(s/n) precio con impuestos` | Sí | Sí (`price`) | Fuente real de precio |
| `(s/n) imp IVA (8%)` | Sí | No | Sin uso en MVP |
| `(s/n) imp IVA (16%)` | Sí | No | Sin uso en MVP |
| `(s/n) granel` | Sí | No | Sin uso en MVP |
| `existencia` | Sí | No (V1) | Mayormente vacío |
| `columna SAT sin nombre` | Sí | Sí (`sat_code`) | Trazabilidad fiscal |

## Flujo de Importación

1. Subir archivo y crear `import_batch`
2. Persistir filas crudas en `product_import_raw`
3. Parsear y validar (precio, sku, campos requeridos)
4. Resolver categoría curada usando `category_mapping_rules`
5. Upsert en `products` por `sku`
6. Registrar issues por fila en `product_import_issues`
7. Publicar resumen: creados, actualizados, omitidos, errores

## Criterios BDD de Estrategia

- **Dado que** existe un batch histórico en staging,  
  **Cuando** se actualiza `mapping_version`,  
  **Entonces** el sistema puede reprocesar sin re-subir CSV.

- **Dado que** el CSV trae columnas no utilizadas por storefront,  
  **Cuando** se ejecuta la importación,  
  **Entonces** esas columnas se conservan en staging y no se agregan a `products` por defecto.

