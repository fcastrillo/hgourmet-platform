"use client";

import { useState, useRef, useTransition } from "react";
import { parseCsvText } from "@/lib/import/csv/parseCsv";
import { ProductCsvPreviewTable } from "./ProductCsvPreviewTable";
import { importProductsCsv } from "@/app/(admin)/admin/productos/actions";
import type { ImportSummary, RowIssue } from "@/lib/import/csv/types";

type Step = "idle" | "preview" | "importing" | "done" | "error";

interface PreviewRow {
  sourceRow: number;
  name: string;
  price: number;
  departamento: string;
  categoria: string;
  sku: string | null;
}

export function ProductCsvImportPanel() {
  const [step, setStep] = useState<Step>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [previewIssues, setPreviewIssues] = useState<RowIssue[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setServerError("Solo se aceptan archivos .csv");
      return;
    }
    setServerError(null);
    setSelectedFile(file);
    parseAndPreview(file);
  }

  function parseAndPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { validRows, issues } = parseCsvText(text);

      const rows: PreviewRow[] = validRows.map(({ sourceRow, data }) => ({
        sourceRow,
        name: data.name,
        price: data.price,
        departamento: data.departamento,
        categoria: data.categoria,
        sku: data.sku,
      }));

      setPreviewRows(rows);
      setPreviewIssues(issues);
      setStep("preview");
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleConfirm() {
    if (!selectedFile) return;
    setStep("importing");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("csv_file", selectedFile);

      const result = await importProductsCsv(formData);

      if (result.success) {
        setSummary(result.summary);
        setStep("done");
      } else {
        setServerError(result.error);
        setStep("error");
      }
    });
  }

  function handleReset() {
    setStep("idle");
    setSelectedFile(null);
    setPreviewRows([]);
    setPreviewIssues([]);
    setSummary(null);
    setServerError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Header + template download */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text">Importar productos vía CSV</h2>
          <p className="mt-1 text-sm text-muted">
            Sube un archivo CSV para agregar o actualizar productos en masa.
          </p>
        </div>
        <a
          href="/templates/product-import-template.csv"
          download
          className="inline-flex items-center gap-2 rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
        >
          <svg className="h-4 w-4 shrink-0" width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Descargar template
        </a>
      </div>

      {/* Upload zone (idle or after reset) */}
      {step === "idle" && (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-secondary bg-secondary/10 px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
          <svg className="h-10 w-10 text-muted" width={40} height={40} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-text">Haz clic para seleccionar un archivo CSV</p>
            <p className="mt-1 text-xs text-muted">o arrástralo aquí · Máx. 10 MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={handleFileChange}
            aria-label="Seleccionar archivo CSV"
          />
        </label>
      )}

      {/* Server error */}
      {serverError && step !== "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {serverError}
        </div>
      )}

      {/* Preview */}
      {step === "preview" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 rounded-lg border border-secondary bg-secondary/20 px-4 py-3 text-sm text-text">
            <svg className="h-4 w-4 shrink-0 text-muted" width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="font-medium">{selectedFile?.name}</span>
          </div>

          <ProductCsvPreviewTable validRows={previewRows} issues={previewIssues} />

          <div className="flex flex-wrap gap-3">
            {previewRows.length > 0 && (
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <svg className="h-4 w-4 shrink-0" width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Confirmar importación ({previewRows.length} productos)
              </button>
            )}
            <button
              onClick={handleReset}
              className="rounded-lg border border-secondary px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Importing state */}
      {step === "importing" && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <svg className="h-10 w-10 animate-spin text-primary" width={40} height={40} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-text">Importando productos…</p>
          <p className="text-xs text-muted">Esto puede tardar algunos segundos según el tamaño del archivo.</p>
        </div>
      )}

      {/* Done state — summary */}
      {step === "done" && summary && (
        <div className="space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 shrink-0 text-green-600" width={24} height={24} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-base font-semibold text-green-800">Importación completada</h3>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="Total filas" value={summary.totalRows} />
              <SummaryCard label="Creados" value={summary.created} color="green" />
              <SummaryCard label="Actualizados" value={summary.updated} color="blue" />
              <SummaryCard label="Omitidos" value={summary.skipped + summary.errored} color="red" />
            </dl>
          </div>

          {summary.issues.length > 0 && (
            <ProductCsvPreviewTable validRows={[]} issues={summary.issues} />
          )}

          <button
            onClick={handleReset}
            className="rounded-lg border border-secondary px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Importar otro archivo
          </button>
        </div>
      )}

      {/* Error state */}
      {step === "error" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4">
            <p className="text-sm font-semibold text-red-800">Error en la importación</p>
            <p className="mt-1 text-sm text-red-700">{serverError}</p>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg border border-secondary px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "gray",
}: {
  label: string;
  value: number;
  color?: "green" | "blue" | "red" | "gray";
}) {
  const colorClasses = {
    green: "text-green-700",
    blue: "text-blue-700",
    red: "text-red-700",
    gray: "text-text",
  };

  return (
    <div className="rounded-lg bg-white p-3 text-center shadow-sm">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-1 text-2xl font-bold ${colorClasses[color]}`}>{value}</dd>
    </div>
  );
}
