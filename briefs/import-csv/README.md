# Utileria de conversion CSV (offline)

Esta carpeta contiene utileria de apoyo para preparar la importacion masiva de productos.
No forma parte del runtime de la app web.

## Estructura

- `source/inventory/Inventario_Productos.csv`: fuente principal para convertir.
- `source/inventory/Inventario_Productos.xlsx`: fuente original en Excel (referencia).
- `source/mapping/mapeo_01.jpeg` y `source/mapping/mapeo_02.jpeg`: referencia visual del mapeo de categorias.
- `convierte-inventario.py`: transforma la fuente al formato de importacion.
- `productos_listos_para_importar.csv`: salida convertida lista para cargar en admin.

## Archivos

- `convierte-inventario.py`: transforma `source/inventory/Inventario_Productos.csv` al formato de importacion.
- `productos_listos_para_importar.csv`: salida convertida lista para cargar en admin.

## Uso

Desde la raiz del repo:

```bash
cd briefs
python3 -m venv .venv
.venv/bin/python -m pip install pandas
.venv/bin/python import-csv/convierte-inventario.py
```

La salida se genera en:

`briefs/import-csv/productos_listos_para_importar.csv`

## Nota operativa

- Evitar notas temporales en `to-do.txt` para errores de pruebas.
- Para issues de tipado Supabase en updates encadenados, seguir ADR-005 (cast controlado) y validar con:

```bash
npx tsc --noEmit
npm run test
```
