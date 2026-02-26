while true; do
  clear
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
  OUTPUT_DIR="${BASE_DIR}/output/current"
  IMAGES_DIR="${OUTPUT_DIR}/product_images"
  CSV_FILE="${OUTPUT_DIR}/inventario_actualizado.csv"
  date
  echo "── Imágenes ──────────────────────────"
  echo "  Archivos: $(ls "${IMAGES_DIR}" 2>/dev/null | wc -l | tr -d ' ')"
  du -sh "${IMAGES_DIR}" 2>/dev/null || echo "  Aún no existe ${IMAGES_DIR}"
  echo "── CSV ────────────────────────────────"
  du -sh "${CSV_FILE}" 2>/dev/null || echo "  Aún no existe ${CSV_FILE}"
  echo "  Total filas:     $(tail -n +2 "${CSV_FILE}" 2>/dev/null | wc -l | tr -d ' ')"
  echo "  Con desc. IA:    $(awk -F',' 'NR>1 && $1 != $2 {count++} END {print count+0}' "${CSV_FILE}" 2>/dev/null)"
  echo "  Sin desc. (=nombre): $(awk -F',' 'NR>1 && $1 == $2 {count++} END {print count+0}' "${CSV_FILE}" 2>/dev/null)"
  sleep 300
done
