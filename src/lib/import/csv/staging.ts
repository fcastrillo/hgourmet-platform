"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { RowIssue } from "./types";

/**
 * Creates an import_batches record and stores all raw rows + issues.
 * Returns the batchId for traceability.
 */
export async function persistStagingBatch(
  supabase: SupabaseClient,
  {
    filename,
    fileHash,
    mappingVersion,
    totalRows,
    rawRows,
    issues,
    rowsCreated,
    rowsUpdated,
    rowsSkipped,
    rowsErrored,
  }: {
    filename: string;
    fileHash: string;
    mappingVersion: string;
    totalRows: number;
    rawRows: Array<{ sourceRow: number; payload: Record<string, unknown> }>;
    issues: RowIssue[];
    rowsCreated: number;
    rowsUpdated: number;
    rowsSkipped: number;
    rowsErrored: number;
  },
): Promise<string> {
  const { data: batch, error: batchError } = await supabase
    .from("import_batches")
    .insert({
      source_filename: filename,
      source_file_hash: fileHash,
      mapping_version: mappingVersion,
      status: "completed",
      total_rows: totalRows,
      rows_created: rowsCreated,
      rows_updated: rowsUpdated,
      rows_skipped: rowsSkipped,
      rows_errored: rowsErrored,
      processed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (batchError || !batch) {
    throw new Error(`Error al crear registro de batch: ${batchError?.message}`);
  }

  const batchId = batch.id as string;

  // Store raw rows (chunked to avoid hitting Supabase payload limits)
  if (rawRows.length > 0) {
    const CHUNK = 200;
    for (let i = 0; i < rawRows.length; i += CHUNK) {
      const chunk = rawRows.slice(i, i + CHUNK).map((r) => ({
        batch_id: batchId,
        source_row_number: r.sourceRow,
        payload: r.payload,
      }));
      await supabase.from("product_import_raw").insert(chunk);
    }
  }

  // Store issues
  if (issues.length > 0) {
    const issueRows = issues.map((iss) => ({
      batch_id: batchId,
      source_row_number: iss.sourceRow,
      issue_code: iss.code,
      issue_detail: iss.detail,
    }));
    await supabase.from("product_import_issues").insert(issueRows);
  }

  return batchId;
}

/**
 * Loads the active mapping rules for a given version from the DB.
 */
export async function loadMappingRules(
  supabase: SupabaseClient,
  version = "v1",
) {
  const { data, error } = await supabase
    .from("category_mapping_rules")
    .select("departamento_raw, categoria_raw, curated_category, priority")
    .eq("mapping_version", version)
    .eq("is_active", true)
    .order("priority", { ascending: false });

  if (error) throw new Error(`Error cargando reglas de mapeo: ${error.message}`);
  return (data ?? []) as Array<{
    departamento_raw: string;
    categoria_raw: string;
    curated_category: string;
    priority: number;
  }>;
}
