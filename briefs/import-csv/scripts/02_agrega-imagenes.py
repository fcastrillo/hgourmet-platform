import pandas as pd
import time
import random
import requests
import os
import base64
import ollama
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# ─── Configuración de Ollama ─────────────────────────────────────────────────
OLLAMA_MODEL = 'llama3.2'   # requiere: ollama pull llama3.2

# ─── Rutas ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
CURRENT_OUTPUT_DIR = os.path.join(BASE_DIR, "output", "current")
FOLDER = os.path.join(CURRENT_OUTPUT_DIR, "product_images")
CSV_INPUT = os.path.join(CURRENT_OUTPUT_DIR, "productos_listos_para_importar.csv")
CSV_OUTPUT = os.path.join(CURRENT_OUTPUT_DIR, "inventario_actualizado.csv")
# Mapeo SKU → imagen local → URL de Supabase (se llena después de subir)
CSV_IMAGENES = os.path.join(CURRENT_OUTPUT_DIR, "imagenes_map.csv")
os.makedirs(FOLDER, exist_ok=True)

# ─── Parámetros del batch ────────────────────────────────────────────────────
INICIO = 0      # índice 0-based — ajustar para reanudar si hay corrida parcial
LIMITE = None   # None = todos los productos restantes
FORZAR_DESC = False  # True = regenera descripciones aunque ya existan en CSV previo

# ─── Navegador ─────────────────────────────────────────────────────────────
options = webdriver.ChromeOptions()
options.add_argument('--lang=es-MX,es')
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_experimental_option('excludeSwitches', ['enable-automation'])
options.add_experimental_option('useAutomationExtension', False)
# options.add_argument('--headless=new')  # descomenta para correr sin ventana
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
driver.set_window_size(1280, 900)

# ─── Fuentes de imagen (orden de preferencia) ────────────────────────────────
# Bing raramente muestra CAPTCHA. Google queda como último recurso.
FUENTES = [
    {
        "nombre": "Bing",
        "url":    lambda q: f"https://www.bing.com/images/search?q={q}&form=HDRSC2",
        "selectores": ["img.mimg", "a.iusc img", ".iuscp img"],
    },
    {
        "nombre": "Google",
        "url":    lambda q: f"https://www.google.com/search?q={q}&tbm=isch",
        "selectores": ["img.Q4LuWd", "img.YQ4gaf", "div[data-ri] img", "g-img img"],
    },
]

def _pausa_humana(min_s=2.0, max_s=5.0):
    time.sleep(random.uniform(min_s, max_s))

def _buscar_imagen_en_fuente(fuente):
    """Intenta los selectores de una fuente y retorna el primer elemento encontrado."""
    for selector in fuente["selectores"]:
        try:
            elementos = driver.find_elements(By.CSS_SELECTOR, selector)
            visibles = [e for e in elementos if e.is_displayed() and e.get_attribute("src")]
            if visibles:
                return visibles[0]
        except Exception:
            continue
    return None

def _guardar_imagen(img_url, ruta):
    """Escribe la imagen (base64 o URL) en disco. Retorna True si tuvo éxito."""
    try:
        if img_url.startswith('data:image'):
            _, encoded = img_url.split(",", 1)
            with open(ruta, "wb") as f:
                f.write(base64.b64decode(encoded))
            return True
        else:
            resp = requests.get(img_url, timeout=10)
            if resp.status_code == 200:
                with open(ruta, "wb") as f:
                    f.write(resp.content)
                return True
    except Exception:
        pass
    return False

def descargar_imagen(sku, nombre, clave2):
    nombre_archivo = f"{sku}.jpg"
    ruta_guardado  = os.path.join(FOLDER, nombre_archivo)

    if os.path.exists(ruta_guardado):
        print(f"  [SKIP img] {sku} ya existe")
        return nombre_archivo

    # Incluir siempre clave1 — sea SKU alfanumérico o EAN, ambos ayudan a Bing
    query = f'{sku} "{nombre}" repostería pastelería'

    for fuente in FUENTES:
        try:
            # Limpiar DOM entre búsquedas para evitar que Bing reutilice
            # elementos de la página anterior (navegación SPA)
            driver.get("about:blank")
            time.sleep(0.5)
            driver.get(fuente["url"](query))
            _pausa_humana(1.5, 3.0)

            wait_selector = ", ".join(fuente["selectores"])
            WebDriverWait(driver, 8).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, wait_selector))
            )

            img_element = _buscar_imagen_en_fuente(fuente)
            if img_element is None:
                print(f"  [WARN img] Sin resultados en {fuente['nombre']} para {sku}")
                continue

            img_url = img_element.get_attribute("src")
            if img_url and _guardar_imagen(img_url, ruta_guardado):
                print(f"  [OK img]  {sku} → {nombre_archivo} ({fuente['nombre']})")
                return nombre_archivo

        except Exception as e:
            print(f"  [WARN img] {fuente['nombre']} falló para {sku}: {type(e).__name__}")
            continue

    print(f"  [ERROR img] Sin imagen en ninguna fuente para SKU {sku}")
    return "error_no_encontrado.jpg"

def generar_descripcion_local(nombre_producto, categoria, descripcion_original=""):
    """Genera descripción usando Ollama (llama3.2) corriendo localmente.
    Sin límites de cuota ni dependencia de internet. Fallback a descripción original."""
    prompt = (
        f"Escribe una descripción comercial muy breve (máximo 20 palabras) "
        f"para este producto de repostería: {nombre_producto}. "
        f"Categoría: {categoria}. "
        f"No uses introducciones como 'Aquí tienes' o 'Este producto'."
    )
    try:
        response = ollama.chat(model=OLLAMA_MODEL, messages=[
            {'role': 'user', 'content': prompt}
        ])
        descripcion = response['message']['content'].strip()
        print(f"  [OK desc] {len(descripcion)} chars")
        return descripcion
    except Exception as e:
        print(f"  [ERROR desc] {type(e).__name__}: {e}")
        return descripcion_original

def procesar_producto(row):
    """Descarga imagen localmente y genera descripción con Ollama."""
    sku       = str(row['clave1'])
    nombre    = str(row['nombre'])
    categoria = str(row.get('categoria', ''))

    print(f"\n── Procesando SKU {sku}: {nombre}")

    imagen_archivo = descargar_imagen(sku, nombre, row['clave2'])
    # Registrar mapeo SKU → imagen local → URL Supabase (columna vacía hasta subir)
    necesita_header = not os.path.exists(CSV_IMAGENES) or os.path.getsize(CSV_IMAGENES) == 0
    imagen_path = os.path.join(FOLDER, imagen_archivo) if imagen_archivo != "error_no_encontrado.jpg" else ""
    with open(CSV_IMAGENES, 'a', newline='') as mf:
        import csv as csv_mod
        writer = csv_mod.writer(mf, quoting=csv_mod.QUOTE_ALL)
        if necesita_header:
            writer.writerow(['sku', 'nombre', 'imagen_local', 'supabase_url'])
        writer.writerow([sku, nombre, imagen_path, ''])

    desc_actual = str(row.get('descripcion', ''))
    # Regenerar si: no tiene descripción, es igual al nombre (valor por defecto del CSV),
    # o si FORZAR_DESC está activo
    necesita_desc = FORZAR_DESC or not desc_actual or desc_actual == nombre
    if necesita_desc:
        descripcion = generar_descripcion_local(nombre, categoria, descripcion_original=desc_actual)
    else:
        print(f"  [SKIP desc] Ya tiene descripción")
        descripcion = desc_actual

    _pausa_humana(1.5, 3.0)

    return descripcion

# ─── Columnas esperadas por el importador (CsvRawRow en types.ts) ────────────
CSV_COLUMNS = [
    'nombre', 'descripcion', 'precio', 'departamento', 'categoria',
    'clave1', 'clave2', 'codigo_sat', 'disponible', 'destacado', 'temporada',
]

# ─── Ejecución ───────────────────────────────────────────────────────────────
df = pd.read_csv(CSV_INPUT)

# Si ya existe un CSV de salida previo, recuperamos las descripciones ya generadas
if os.path.exists(CSV_OUTPUT):
    df_prev = pd.read_csv(CSV_OUTPUT)
    if 'descripcion' in df_prev.columns:
        df['descripcion'] = df_prev['descripcion']
    print(f"[INFO] CSV previo cargado: se preservan descripciones anteriores.\n")

fin    = (INICIO + LIMITE) if LIMITE is not None else None
subset = df.iloc[INICIO:fin].copy()

total  = len(subset)
print(f"Iniciando procesamiento de {total} productos")
print(f"Filas CSV {INICIO + 1}–{INICIO + total} (índice pandas {INICIO}–{INICIO + total - 1})")
print(f"Carpeta de imágenes: {FOLDER}\n")

GUARDAR_CADA = 10   # persiste el CSV cada N productos para no perder progreso

for i, (idx, row) in enumerate(subset.iterrows(), start=1):
    descripcion = procesar_producto(row)
    df.at[idx, 'descripcion'] = descripcion

    if i % GUARDAR_CADA == 0 or i == total:
        df[CSV_COLUMNS].to_csv(CSV_OUTPUT, index=False)
        print(f"  [SAVE] Progreso guardado ({i}/{total} productos)")

driver.quit()
print(f"\nProceso completado.")
print(f"  CSV listo para importar: {CSV_OUTPUT}")
print(f"  Imágenes en:             {FOLDER}")
print(f"  Próximo paso:            subir imágenes a Supabase Storage y actualizar products.image_url por SKU.")
