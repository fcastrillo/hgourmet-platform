# Utileria de importacion CSV (offline)

Esta carpeta contiene scripts y salidas de apoyo para cargas masivas de productos.
No forma parte del runtime de la app web.

## Estructura

- `source/`
  - `inventory/Inventario_Productos.csv` (fuente principal)
  - `mapping/*` (referencia visual de mapeo)
- `scripts/`
  - `00_avance.sh` (monitor de progreso cada 5 minutos)
  - `01_convierte-inventario.py`
  - `02_agrega-imagenes.py`
  - `03_sube-imagenes-supabase.py`
  - `04_borra-imagenes-desde.py` (mantenimiento/reprocesos)
- `output/current/`
  - `productos_listos_para_importar.csv`
  - `inventario_actualizado.csv`
  - `imagenes_map.csv`
  - `product_images/` (temporal durante corrida)
- `output/reports/`
  - `log_carga.txt`

## Orden secuencial de ejecucion

1. `scripts/01_convierte-inventario.py`
   - Convierte inventario fuente al formato de importacion.
2. `scripts/02_agrega-imagenes.py`
   - Genera/actualiza descripciones y descarga imagenes locales.
   - Persiste `inventario_actualizado.csv` y `imagenes_map.csv`.
3. Carga `output/current/inventario_actualizado.csv` desde el admin de la app.
4. `scripts/03_sube-imagenes-supabase.py --subir`
   - Sube imagenes al bucket `product-images` y actualiza `products.image_url` por SKU.
5. (Opcional) `scripts/04_borra-imagenes-desde.py --borrar`
   - Para limpiar imagenes y reprocesar desde una fila.

## Uso rapido

Desde la raiz del repo:

```bash
cd briefs
python3 -m venv .venv
.venv/bin/python -m pip install pandas requests selenium webdriver-manager ollama

# Paso 1
.venv/bin/python import-csv/scripts/01_convierte-inventario.py

# Paso 2
.venv/bin/python import-csv/scripts/02_agrega-imagenes.py

# Monitoreo opcional
bash import-csv/scripts/00_avance.sh

# Paso 4
.venv/bin/python import-csv/scripts/03_sube-imagenes-supabase.py --subir
```

## Variables de entorno requeridas

Para `scripts/03_sube-imagenes-supabase.py` se requiere en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (clave con permisos de escritura en Storage y update en DB)

La `NEXT_PUBLIC_SUPABASE_ANON_KEY` no es suficiente para este paso operativo.

## Nota operativa

- `product_images/` puede eliminarse al finalizar y validar bucket + DB.
- `imagenes_map.csv` se conserva como trazabilidad historica del pipeline Python.
- `output/reports/admin-import/log_carga.txt` es evidencia del import realizado en la UI web
  (no es salida de ejecucion de estos scripts).
