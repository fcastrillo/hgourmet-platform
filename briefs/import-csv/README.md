# Utileria de conversion CSV (offline)

Esta carpeta contiene utileria de apoyo para preparar la importacion masiva de productos.
No forma parte del runtime de la app web.

## Archivos

- `convierte-inventario.py`: transforma `briefs/Inventario_Productos.csv` al formato de importacion.
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
