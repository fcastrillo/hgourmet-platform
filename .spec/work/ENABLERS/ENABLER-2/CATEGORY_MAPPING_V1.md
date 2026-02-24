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

1. **Override por `categoria` exacta** (si existe regla explícita)
2. **Fallback por `departamento`**
3. **Si no hay match**: enviar a cola de revisión manual (`UNMAPPED`)

## Mapeo Base por Departamento (V1)

| Departamento CSV | Categoría Curada |
|:--|:--|
| Herramientas | Utensilios |
| Cortadores | Utensilios |
| Accesorios | Utensilios |
| Refrigeracion | Utensilios |
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

Estos overrides corrigen ambigüedades conocidas y prevalecen sobre el fallback por departamento.

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

## Nota de Operación

- Este V1 documenta el enfoque acordado con las dueñas y el criterio de “probablemente” aprobado para acelerar.
- Durante HU-2.3, cada fila `UNMAPPED` se captura en reporte de issues para crear **V2** del mapeo sin bloquear importación parcial.
- Si las dueñas cambian criterios, se incrementa `mapping_version` y se reprocesa desde staging.

