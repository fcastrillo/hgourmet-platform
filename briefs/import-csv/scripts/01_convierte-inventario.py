import unicodedata
from pathlib import Path

import pandas as pd


def normalize_column_name(name: str) -> str:
    """Normalize CSV headers to compare safely regardless of accents/BOM."""
    name = name.strip().lower().replace("*", "").strip()
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    return " ".join(name.split())


def safe_read_csv(path: str) -> pd.DataFrame:
    """Try common encodings used in exports and return a DataFrame."""
    for enc in ("utf-8-sig", "latin1"):
        try:
            return pd.read_csv(path, encoding=enc)
        except UnicodeDecodeError:
            continue
    return pd.read_csv(path)


def parse_price(series: pd.Series) -> pd.Series:
    cleaned = (
        series.astype(str)
        .str.replace(r"[\$,]", "", regex=True)
        .str.strip()
        .replace({"": "0", "nan": "0", "None": "0"})
    )
    return pd.to_numeric(cleaned, errors="coerce").fillna(0).round(2)


def choose_price_column(df: pd.DataFrame, normalized_map: dict[str, str]) -> str:
    """Pick the most reliable price source from known candidate columns."""
    candidates: list[str] = []
    if "precio1" in normalized_map:
        candidates.append(normalized_map["precio1"])

    # Some exports include malformed headers like "(s/n) precio con impuestos"
    for norm_key, raw_col in normalized_map.items():
        if "precio con impuestos" in norm_key and raw_col not in candidates:
            candidates.append(raw_col)

    if not candidates:
        raise KeyError("No se encontró una columna de precio en el archivo fuente.")

    best_col = candidates[0]
    best_non_zero = -1
    for col in candidates:
        parsed = parse_price(df[col])
        non_zero = int((parsed > 0).sum())
        if non_zero > best_non_zero:
            best_non_zero = non_zero
            best_col = col
    return best_col


def convertir_inventario(archivo_origen: str, archivo_destino: str):
    df_origen = safe_read_csv(archivo_origen)
    df_origen.columns = df_origen.columns.str.strip()

    normalized_map = {normalize_column_name(col): col for col in df_origen.columns}

    required_keys = {
        "descripcion": ["descripcion", "descripcion *"],
        "departamento": ["departamento"],
        "categoria": ["categoria"],
        "clave1": ["clave1", "clave1 *"],
        "clave2": ["clave2"],
        "inventariable": ["(s/n) inventariable", "inventariable"],
    }

    resolved = {}
    for key, candidates in required_keys.items():
        match = next((normalized_map[c] for c in candidates if c in normalized_map), None)
        if not match:
            raise KeyError(f"No se encontró columna requerida para '{key}'.")
        resolved[key] = match

    sat_col = normalized_map.get("codigo sat")
    if not sat_col:
        sat_col = "Unnamed: 15" if "Unnamed: 15" in df_origen.columns else df_origen.columns[-1]

    price_col = choose_price_column(df_origen, normalized_map)

    df_final = pd.DataFrame()
    df_final["nombre"] = df_origen[resolved["descripcion"]].astype(str).str.strip()
    df_final["descripcion"] = df_final["nombre"]
    df_final["precio"] = parse_price(df_origen[price_col])
    df_final["departamento"] = df_origen[resolved["departamento"]].astype(str).str.strip()
    df_final["categoria"] = df_origen[resolved["categoria"]].astype(str).str.strip()
    df_final["clave1"] = df_origen[resolved["clave1"]].astype(str).str.strip()
    df_final["clave2"] = df_origen[resolved["clave2"]].astype(str).str.strip()
    df_final["codigo_sat"] = df_origen[sat_col].fillna("").astype(str).str.strip()
    df_final["disponible"] = (
        df_origen[resolved["inventariable"]].fillna("").astype(str).str.upper().str.strip() == "SI"
    )
    df_final["destacado"] = False
    df_final["temporada"] = False

    ordered_cols = [
        "nombre",
        "descripcion",
        "precio",
        "departamento",
        "categoria",
        "clave1",
        "clave2",
        "codigo_sat",
        "disponible",
        "destacado",
        "temporada",
    ]
    df_final = df_final[ordered_cols]

    df_final.to_csv(archivo_destino, index=False, encoding="utf-8")
    non_zero_prices = int((df_final["precio"] > 0).sum())
    print(
        f"Conversion completada. Filas: {len(df_final)}. "
        f"Precios > 0: {non_zero_prices}. "
        f"Columna de precio usada: {price_col}. "
        f"Archivo: {archivo_destino}"
    )


if __name__ == "__main__":
    script_dir = Path(__file__).resolve().parent
    base_dir = script_dir.parent
    archivo_origen = base_dir / "source" / "inventory" / "Inventario_Productos.csv"
    archivo_destino = base_dir / "output" / "current" / "productos_listos_para_importar.csv"
    convertir_inventario(str(archivo_origen), str(archivo_destino))