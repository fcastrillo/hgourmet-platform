while true; do
  clear
  date
  echo "── Imágenes ──────────────────────────"
  echo "  Archivos: $(ls product_images | wc -l | tr -d ' ')"
  du -sh product_images
  echo "── CSV ────────────────────────────────"
  du -sh inventario_actualizado.csv 2>/dev/null || echo "  Aún no existe"
  echo "  Total filas:     $(tail -n +2 inventario_actualizado.csv 2>/dev/null | wc -l | tr -d ' ')"
  echo "  Con desc. IA:    $(awk -F',' 'NR>1 && $1 != $2 {count++} END {print count+0}' inventario_actualizado.csv 2>/dev/null)"
  echo "  Sin desc. (=nombre): $(awk -F',' 'NR>1 && $1 == $2 {count++} END {print count+0}' inventario_actualizado.csv 2>/dev/null)"
  sleep 300
done
