"""
Sube imágenes locales a Supabase Storage (bucket: product-images)
y actualiza products.image_url por SKU — sin SDK de Supabase (solo requests).

Uso:
    python scripts/03_sube-imagenes-supabase.py            # simulacro
    python scripts/03_sube-imagenes-supabase.py --subir    # sube y actualiza DB
"""
import os
import sys
import requests
import pandas as pd
from pathlib import Path

# ─── Leer .env.local manualmente (sin python-dotenv) ────────────────────────
def cargar_env(path: Path) -> dict:
    env = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ROOT = Path(__file__).resolve().parents[3]
env  = cargar_env(ROOT / ".env.local")

SUPABASE_URL      = env.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SERVICE_ROLE_KEY  = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
BUCKET            = "product-images"
SIMULACRO         = "--subir" not in sys.argv

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print("ERROR: Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local")
    sys.exit(1)

# Headers comunes para todas las llamadas
HEADERS_BASE = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "apikey": SERVICE_ROLE_KEY,
}

# ─── Rutas ───────────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
IMPORT_CSV_DIR = SCRIPT_DIR.parent
IMAGENES_MAP = IMPORT_CSV_DIR / "output" / "current" / "imagenes_map.csv"

# ─── Funciones de API ────────────────────────────────────────────────────────
def subir_imagen(storage_path: str, ruta_local: Path) -> str:
    """Sube imagen al bucket y retorna la URL pública."""
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"
    with open(ruta_local, "rb") as f:
        resp = requests.post(
            url,
            headers={**HEADERS_BASE, "Content-Type": "image/jpeg", "x-upsert": "true"},
            data=f,
        )
    if not resp.ok:
        raise Exception(f"HTTP {resp.status_code}: {resp.text}")
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"

def actualizar_image_url(sku: str, image_url: str) -> int:
    """Actualiza products.image_url donde sku = clave1. Retorna filas afectadas."""
    url  = f"{SUPABASE_URL}/rest/v1/products"
    resp = requests.patch(
        url,
        headers={
            **HEADERS_BASE,
            "Content-Type": "application/json",
            "Prefer": "return=representation,count=exact",
        },
        params={"sku": f"eq.{sku}"},
        json={"image_url": image_url},
    )
    resp.raise_for_status()
    filas = len(resp.json()) if resp.text else 0
    return filas

# ─── Cargar mapa ─────────────────────────────────────────────────────────────
df = pd.read_csv(IMAGENES_MAP, on_bad_lines='warn', engine='python', dtype=str)
df['supabase_url'] = df['supabase_url'].fillna('')
pendientes = df[
    df['imagen_local'].notna() &
    (df['imagen_local'].astype(str) != '') &
    (df['supabase_url'].isna() | (df['supabase_url'].astype(str).str.strip() == ''))
].copy()

print(f"{'[SIMULACRO]' if SIMULACRO else '[SUBIDA REAL]'}")
print(f"URL proyecto:    {SUPABASE_URL}")
print(f"Total en mapa:   {len(df)}")
print(f"Pendientes:      {len(pendientes)}")
print(f"Ya subidas:      {len(df) - len(pendientes)}\n")

GUARDAR_CADA = 50
subidas  = 0
errores  = 0

for i, (idx, row) in enumerate(pendientes.iterrows(), start=1):
    sku          = str(row['sku'])
    ruta_local   = Path(str(row['imagen_local']))
    storage_path = f"{sku}.jpg"

    if not ruta_local.exists():
        print(f"  [WARN] No existe localmente: {ruta_local.name}")
        errores += 1
        continue

    if SIMULACRO:
        print(f"  [SIM] {sku}.jpg → {BUCKET}/{storage_path}")
        subidas += 1
        continue

    try:
        image_url = subir_imagen(storage_path, ruta_local)
        filas = actualizar_image_url(sku, image_url)
        df.at[idx, 'supabase_url'] = image_url
        subidas += 1
        if filas == 0:
            print(f"  [OK-NOBDD] {sku} (imagen subida, SKU no encontrado en products)")
        else:
            print(f"  [OK] {sku} ({filas} fila actualizada en DB)")
    except Exception as e:
        print(f"  [ERROR] {sku}: {type(e).__name__}: {e}")
        errores += 1

    if i % GUARDAR_CADA == 0 or i == len(pendientes):
        df.to_csv(IMAGENES_MAP, index=False)
        print(f"  [SAVE] {i}/{len(pendientes)} — subidas: {subidas}, errores: {errores}")

if not SIMULACRO:
    df.to_csv(IMAGENES_MAP, index=False)

print(f"\nResumen final:")
print(f"  {'Se subirían' if SIMULACRO else 'Subidas'}:  {subidas}")
print(f"  Errores:    {errores}")
if SIMULACRO:
    print(f"\nCorre con --subir para ejecutar:")
    print(f"  python scripts/03_sube-imagenes-supabase.py --subir")
