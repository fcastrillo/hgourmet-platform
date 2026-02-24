# CATEGORY_MAPPING_V1

> Fuente de verdad para curación de categorías del inventario real hacia el catálogo cliente.

## Categorías Curadas (target)

1. Utensilios
2. Decoración
3. Bases
4. Desechables
5. Chocolates
6. Insumos
7. Moldes

## Reglas de Resolución

Para minimizar mapeo manual, se aplican en este orden:

1. **Base por `departamento`**: asignar una categoría curada inicial con la tabla V1.
2. **Refinamiento por contexto del mismo departamento**: ajustar casos recurrentes observados dentro del departamento (sin saltar aún a excepciones finas).
3. **Override final**: aplicar regla explícita de excepción (por `departamento+categoria` o por `categoria`) para corregir casos ambiguos.
4. **Si no hay match**: enviar a cola de revisión manual (`UNMAPPED`).

> Nota operativa: en V1, `Refrigeracion -> Insumos` queda como regla base aprobada para esta iteración.

## Mapeo Base por Departamento (V1)

| Departamento CSV | Categoría Curada |
|:--|:--|
| Herramientas | Utensilios |
| Cortadores | Utensilios |
| Accesorios | Utensilios |
| Refrigeracion | Insumos |
| Decoracion | Decoración |
| Colorantes | Decoración |
| Velas | Decoración |
| Pastel | Bases |
| Capacillos | Desechables |
| Bolsas | Desechables |
| Desechables | Desechables |
| Caja | Desechables |
| Moldes | Moldes |
| Insumos | Insumos |
| Extractos | Insumos |
| INIX | Insumos |
| Comida | Insumos |
| HGOURMET | Insumos (por defecto, ajustar por tipo de producto cuando aplique) |

## Overrides por Categoría (V1)

Estos overrides se aplican en el paso final para corregir ambigüedades conocidas sobre el mapeo base por departamento.

| Categoria CSV (normalizada) | Categoría Curada |
|:--|:--|
| chispas | Chocolates |
| chocolate | Chocolates |
| cocoa | Chocolates |
| coberturas | Chocolates |
| granillos | Chocolates |
| semiamargo | Chocolates |
| amargo | Chocolates |
| leche | Chocolates |
| blanco | Chocolates |
| sin azucar | Chocolates |
| tapetes de silicon | Utensilios |
| plumones | Utensilios |
| raspas | Utensilios |
| espatulas | Utensilios |

## Overrides por Departamento + Categoría (V1)

Estos overrides tienen prioridad sobre el mapeo base por departamento y se usan cuando la misma `categoria` puede significar algo distinto según su `departamento`.

| Departamento CSV (normalizado) | Categoria CSV (normalizada) | Categoría Curada |
|:--|:--|:--|
| refrigeracion | lacteos | Insumos |
| insumos | lacteos | Insumos |
| hgourmet | chocolate | Chocolates |

## Prioridad de Resolución en Base de Datos

La tabla `category_mapping_rules` codifica la prioridad explícitamente:

| `priority` | Tipo de regla | `departamento_raw` | `categoria_raw` |
|:--:|:--|:--|:--|
| 10 | Base por departamento | valor específico | `'*'` |
| 20 | Override por categoría | `'*'` | valor específico |
| 30 | Override exacto dept+cat | valor específico | valor específico |

Resolución: se selecciona la regla con mayor `priority` que haga match con el par del CSV (usando `'*'` como comodín). Si ninguna regla aplica → `UNMAPPED`.

## Nota de Operación

- Este V1 documenta el enfoque acordado con las dueñas y el criterio aprobado para acelerar la importación inicial.
- Durante HU-2.3, cada fila `UNMAPPED` se captura en `product_import_issues` (código `UNMAPPED_CATEGORY`) para crear **V2** del mapeo sin bloquear importación parcial.
- Si las dueñas cambian criterios, se incrementa `mapping_version` a `v2` y se reprocesa desde staging sin re-subir el CSV original.
