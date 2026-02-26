"""
Borra imágenes de product_images/ para los productos a partir de DESDE_FILA.
Útil para limpiar imágenes descargadas con una fuente incorrecta y re-procesarlas.

Uso:
    python scripts/04_borra-imagenes-desde.py          # modo simulacro (no borra nada)
    python scripts/04_borra-imagenes-desde.py --borrar # borra de verdad
"""
import os
import sys
import pandas as pd

SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
CSV_INPUT = os.path.join(BASE_DIR, "output", "current", "productos_listos_para_importar.csv")
FOLDER = os.path.join(BASE_DIR, "output", "current", "product_images")

DESDE_FILA  = 300   # índice 0-based: borra imágenes de este índice en adelante
SIMULACRO   = "--borrar" not in sys.argv

df    = pd.read_csv(CSV_INPUT)
subset = df.iloc[DESDE_FILA:]

borradas  = 0
no_existe = 0

print(f"{'[SIMULACRO]' if SIMULACRO else '[BORRADO REAL]'} "
      f"Revisando {len(subset)} productos desde fila {DESDE_FILA}...\n")

for _, row in subset.iterrows():
    sku      = str(row['clave1'])
    archivo  = os.path.join(FOLDER, f"{sku}.jpg")

    if os.path.exists(archivo):
        if not SIMULACRO:
            os.remove(archivo)
        print(f"  {'[BORRAR]' if SIMULACRO else '[OK]'} {sku}.jpg")
        borradas += 1
    else:
        no_existe += 1

print(f"\nResumen:")
print(f"  {'Se borrarían' if SIMULACRO else 'Borradas'}:  {borradas} imágenes")
print(f"  No existían: {no_existe} imágenes")
if SIMULACRO:
    print(f"\nCorre con --borrar para ejecutar el borrado real:")
    print(f"  python scripts/04_borra-imagenes-desde.py --borrar")
