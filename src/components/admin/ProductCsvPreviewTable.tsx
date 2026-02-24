"use client";

import type { RowIssue } from "@/lib/import/csv/types";

interface PreviewRow {
  sourceRow: number;
  name: string;
  price: number;
  departamento: string;
  categoria: string;
  sku: string | null;
}

interface ProductCsvPreviewTableProps {
  validRows: PreviewRow[];
  issues: RowIssue[];
}

const ISSUE_LABELS: Record<string, string> = {
  INVALID_PRICE: "Precio inválido",
  MISSING_FIELD: "Campo obligatorio vacío",
  UNMAPPED_CATEGORY: "Categoría no mapeada",
  DUPLICATE_SKU: "SKU duplicado",
};

export function ProductCsvPreviewTable({
  validRows,
  issues,
}: ProductCsvPreviewTableProps) {
  return (
    <div className="space-y-6">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          <svg className="h-4 w-4" width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {validRows.length} filas válidas
        </span>
        {issues.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            <svg className="h-4 w-4" width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {issues.length} {issues.length === 1 ? "error" : "errores"}
          </span>
        )}
      </div>

      {/* Valid rows table */}
      {validRows.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Filas válidas para importar</h3>
          <div className="overflow-x-auto rounded-lg border border-secondary">
            <table className="min-w-full divide-y divide-secondary text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">#</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Nombre</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Precio</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Departamento</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Categoría CSV</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">SKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary bg-white">
                {validRows.map((row) => (
                  <tr key={row.sourceRow}>
                    <td className="px-3 py-2 text-muted">{row.sourceRow}</td>
                    <td className="px-3 py-2 font-medium text-text">{row.name}</td>
                    <td className="px-3 py-2 text-text">
                      ${row.price.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-muted">{row.departamento}</td>
                    <td className="px-3 py-2 text-muted">{row.categoria}</td>
                    <td className="px-3 py-2 text-muted">{row.sku ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issues table */}
      {issues.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-red-700">Errores detectados (serán omitidos)</h3>
          <div className="overflow-x-auto rounded-lg border border-red-200">
            <table className="min-w-full divide-y divide-red-100 text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-red-700">Fila</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-red-700">Tipo</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-red-700">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 bg-white">
                {issues.map((issue, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 text-muted">{issue.sourceRow}</td>
                    <td className="px-3 py-2">
                      <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                        {ISSUE_LABELS[issue.code] ?? issue.code}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted">{issue.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
