import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { parseCsvText } from "@/lib/import/csv/parseCsv";
import {
  normalizePrice,
  normalizeCategoryKey,
  parseBooleanField,
  nullableString,
} from "@/lib/import/csv/normalizers";
import { resolveCategory } from "@/lib/import/csv/mapping";
import { validateRows } from "@/lib/import/csv/validators";
import { ProductCsvImportPanel } from "@/components/admin/ProductCsvImportPanel";
import { ProductCsvPreviewTable } from "@/components/admin/ProductCsvPreviewTable";
import type { MappingRule } from "@/lib/import/csv/mapping";
import type { RowIssue } from "@/lib/import/csv/types";

// ── Mock server imports used by ProductCsvImportPanel ────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/admin/productos/importar",
}));

const mockImportProductsCsv = vi.fn();
vi.mock("@/app/(admin)/admin/productos/actions", () => ({
  importProductsCsv: (...args: unknown[]) => mockImportProductsCsv(...args),
}));

// ── Shared mapping rules (mirrors migration seed V1 subset) ──────────────────
const V1_RULES: MappingRule[] = [
  { departamento_raw: "herramientas", categoria_raw: "*", curated_category: "Utensilios", priority: 10 },
  { departamento_raw: "moldes",       categoria_raw: "*", curated_category: "Moldes",     priority: 10 },
  { departamento_raw: "capacillos",   categoria_raw: "*", curated_category: "Desechables", priority: 10 },
  { departamento_raw: "hgourmet",     categoria_raw: "*", curated_category: "Insumos",    priority: 10 },
  { departamento_raw: "*",            categoria_raw: "chocolate",  curated_category: "Chocolates",  priority: 20 },
  { departamento_raw: "*",            categoria_raw: "chispas",    curated_category: "Chocolates",  priority: 20 },
  { departamento_raw: "hgourmet",     categoria_raw: "chocolate",  curated_category: "Chocolates",  priority: 30 },
];

// ── Helper to build a minimal valid CSV string ────────────────────────────────
function buildCsv(rows: string[]): string {
  const header = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada";
  return [header, ...rows].join("\n");
}

const VALID_ROW = '"Chocolate Amargo","Alta calidad","125.00","HGOURMET","chocolate","CHOC-001","","",true,false,false';

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZERS
// ─────────────────────────────────────────────────────────────────────────────
describe("Normalizers", () => {
  describe("normalizePrice", () => {
    it("parses MXN format $1,135.00 → 1135", () => {
      expect(normalizePrice("$1,135.00")).toBe(1135);
    });
    it("parses plain 89.50", () => {
      expect(normalizePrice("89.50")).toBe(89.5);
    });
    it("parses integer 100", () => {
      expect(normalizePrice("100")).toBe(100);
    });
    it("returns NaN for empty string", () => {
      expect(normalizePrice("")).toBeNaN();
    });
    it("returns NaN for non-numeric text", () => {
      expect(normalizePrice("precio")).toBeNaN();
    });
  });

  describe("normalizeCategoryKey", () => {
    it("lowercases and strips accents", () => {
      expect(normalizeCategoryKey("Decoración")).toBe("decoracion");
    });
    it("trims whitespace", () => {
      expect(normalizeCategoryKey("  Moldes  ")).toBe("moldes");
    });
    it("handles uppercase HGOURMET", () => {
      expect(normalizeCategoryKey("HGOURMET")).toBe("hgourmet");
    });
  });

  describe("parseBooleanField", () => {
    it("parses 'true' as true", () => expect(parseBooleanField("true")).toBe(true));
    it("parses '1' as true", () => expect(parseBooleanField("1")).toBe(true));
    it("parses 'si' as true", () => expect(parseBooleanField("si")).toBe(true));
    it("parses 'false' as false", () => expect(parseBooleanField("false")).toBe(false));
    it("parses '' as false", () => expect(parseBooleanField("")).toBe(false));
  });

  describe("nullableString", () => {
    it("returns null for empty string", () => expect(nullableString("")).toBeNull());
    it("returns null for whitespace", () => expect(nullableString("   ")).toBeNull());
    it("returns trimmed string for non-empty", () => expect(nullableString("  hola  ")).toBe("hola"));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CSV PARSER
// ─────────────────────────────────────────────────────────────────────────────
describe("parseCsvText", () => {
  it("retorna array vacío para CSV sin filas de datos", () => {
    const { validRows, issues } = parseCsvText("nombre,precio,departamento,categoria,clave1");
    expect(validRows).toHaveLength(0);
    expect(issues).toHaveLength(0);
  });

  it("parsea una fila válida correctamente", () => {
    const { validRows, issues } = parseCsvText(buildCsv([VALID_ROW]));
    expect(issues).toHaveLength(0);
    expect(validRows).toHaveLength(1);
    expect(validRows[0].data.name).toBe("Chocolate Amargo");
    expect(validRows[0].data.price).toBe(125);
    expect(validRows[0].data.sku).toBe("CHOC-001");
    expect(validRows[0].data.is_available).toBe(true);
  });

  it("normaliza precio con formato MXN $1,135.00", () => {
    const row = '"Producto","","$1,135.00","HGOURMET","chocolate","SKU-X","","",true,false,false';
    const { validRows } = parseCsvText(buildCsv([row]));
    expect(validRows[0].data.price).toBe(1135);
  });

  it("genera issue INVALID_PRICE para precio negativo", () => {
    const row = '"Prod","","-10.00","HGOURMET","chocolate","SKU-X","","",true,false,false';
    const { validRows, issues } = parseCsvText(buildCsv([row]));
    expect(validRows).toHaveLength(0);
    expect(issues[0].code).toBe("INVALID_PRICE");
  });

  it("genera issue INVALID_PRICE para precio cero", () => {
    const row = '"Prod","","0","HGOURMET","chocolate","SKU-X","","",true,false,false';
    const { issues } = parseCsvText(buildCsv([row]));
    expect(issues[0].code).toBe("INVALID_PRICE");
  });

  it("genera issue MISSING_FIELD cuando falta el nombre", () => {
    const row = '"","","125.00","HGOURMET","chocolate","SKU-X","","",true,false,false';
    const { issues } = parseCsvText(buildCsv([row]));
    expect(issues[0].code).toBe("MISSING_FIELD");
  });

  it("procesa filas con campos quoted que contienen comas", () => {
    const row = '"Producto, especial","Desc, larga","50.00","Moldes","moldes","M-001","","",true,false,false';
    const { validRows } = parseCsvText(buildCsv([row]));
    expect(validRows[0].data.name).toBe("Producto, especial");
    expect(validRows[0].data.description).toBe("Desc, larga");
  });

  it("importación parcial: 30 válidas + 5 erróneas solo cuenta válidas", () => {
    const valid = Array.from({ length: 30 }, (_, i) =>
      `"Prod ${i}","","${50 + i}.00","Moldes","moldes","SKU-${i}","","",true,false,false`,
    );
    const invalid = Array.from({ length: 5 }, (_, i) =>
      `"Err ${i}","","-5.00","Moldes","moldes","ERR-${i}","","",true,false,false`,
    );
    const { validRows, issues } = parseCsvText(buildCsv([...valid, ...invalid]));
    expect(validRows).toHaveLength(30);
    expect(issues).toHaveLength(5);
    expect(issues.every((i) => i.code === "INVALID_PRICE")).toBe(true);
  });

  it("asigna sourceRow correctamente (fila 1 = header, datos desde fila 2)", () => {
    const { validRows } = parseCsvText(buildCsv([VALID_ROW]));
    expect(validRows[0].sourceRow).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY MAPPING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
describe("resolveCategory", () => {
  it("resuelve departamento base (prioridad 10)", () => {
    const result = resolveCategory("moldes", "cualquier", V1_RULES);
    expect(result.matched).toBe(true);
    if (result.matched) expect(result.curatedCategory).toBe("Moldes");
  });

  it("override por categoría (prioridad 20) gana sobre departamento base", () => {
    const result = resolveCategory("hgourmet", "chispas", V1_RULES);
    expect(result.matched).toBe(true);
    if (result.matched) expect(result.curatedCategory).toBe("Chocolates");
  });

  it("override exacto dept+cat (prioridad 30) gana sobre categoría override", () => {
    const result = resolveCategory("hgourmet", "chocolate", V1_RULES);
    expect(result.matched).toBe(true);
    if (result.matched) expect(result.curatedCategory).toBe("Chocolates");
  });

  it("retorna matched=false para combinación sin regla", () => {
    const result = resolveCategory("unknown_dept", "unknown_cat", V1_RULES);
    expect(result.matched).toBe(false);
  });

  it("wildcard departamento '*' aplica a cualquier departamento", () => {
    const result = resolveCategory("capacillos", "chocolate", V1_RULES);
    expect(result.matched).toBe(true);
    if (result.matched) expect(result.curatedCategory).toBe("Chocolates");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATORS
// ─────────────────────────────────────────────────────────────────────────────
describe("validateRows", () => {
  const categoryIdsByName = new Map([
    ["Chocolates", "cat-choc"],
    ["Moldes", "cat-mold"],
    ["Desechables", "cat-des"],
    ["Insumos", "cat-ins"],
    ["Utensilios", "cat-ute"],
  ]);

  it("BDD escenario 1: 50 filas válidas → 50 validatedRows, 0 issues nuevos", () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({
      sourceRow: i + 2,
      data: {
        name: `Prod ${i}`,
        description: null,
        price: 10 + i,
        departamento: "moldes",
        categoria: "moldes",
        sku: `SKU-${i}`,
        barcode: null,
        sat_code: null,
        is_available: true,
        is_featured: false,
        is_seasonal: false,
      },
    }));

    const { validatedRows, issues } = validateRows({
      parsedRows: rows,
      parseIssues: [],
      rules: V1_RULES,
      existingSkus: new Set(),
      categoryIdsByName,
    });

    expect(validatedRows).toHaveLength(50);
    expect(issues).toHaveLength(0);
  });

  it("BDD escenario 3: SKU duplicado → issue DUPLICATE_SKU + fila omitida", () => {
    const rows = [
      {
        sourceRow: 2,
        data: {
          name: "Dup Prod",
          description: null,
          price: 50,
          departamento: "moldes",
          categoria: "moldes",
          sku: "EXISTING-SKU",
          barcode: null,
          sat_code: null,
          is_available: true,
          is_featured: false,
          is_seasonal: false,
        },
      },
    ];

    const { validatedRows, issues } = validateRows({
      parsedRows: rows,
      parseIssues: [],
      rules: V1_RULES,
      existingSkus: new Set(["EXISTING-SKU"]),
      categoryIdsByName,
    });

    expect(validatedRows).toHaveLength(0);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("DUPLICATE_SKU");
    expect(issues[0].sourceRow).toBe(2);
  });

  it("genera issue UNMAPPED_CATEGORY cuando no hay regla de mapeo", () => {
    const rows = [
      {
        sourceRow: 2,
        data: {
          name: "Prod X",
          description: null,
          price: 50,
          departamento: "dept_desconocido",
          categoria: "cat_desconocida",
          sku: "SKU-X",
          barcode: null,
          sat_code: null,
          is_available: true,
          is_featured: false,
          is_seasonal: false,
        },
      },
    ];

    const { validatedRows, issues } = validateRows({
      parsedRows: rows,
      parseIssues: [],
      rules: V1_RULES,
      existingSkus: new Set(),
      categoryIdsByName,
    });

    expect(validatedRows).toHaveLength(0);
    expect(issues[0].code).toBe("UNMAPPED_CATEGORY");
  });

  it("forwarda parseIssues al resultado final", () => {
    const parseIssues: RowIssue[] = [
      { sourceRow: 3, code: "INVALID_PRICE", detail: "Precio -5" },
    ];

    const { issues } = validateRows({
      parsedRows: [],
      parseIssues,
      rules: V1_RULES,
      existingSkus: new Set(),
      categoryIdsByName,
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("INVALID_PRICE");
  });

  it("resuelve category_id correctamente en fila válida", () => {
    const rows = [
      {
        sourceRow: 2,
        data: {
          name: "Molde Corazón",
          description: null,
          price: 75,
          departamento: "moldes",
          categoria: "moldes",
          sku: "MOLD-001",
          barcode: null,
          sat_code: null,
          is_available: true,
          is_featured: false,
          is_seasonal: false,
        },
      },
    ];

    const { validatedRows } = validateRows({
      parsedRows: rows,
      parseIssues: [],
      rules: V1_RULES,
      existingSkus: new Set(),
      categoryIdsByName,
    });

    expect(validatedRows[0].data.category_id).toBe("cat-mold");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ProductCsvPreviewTable component
// ─────────────────────────────────────────────────────────────────────────────
describe("ProductCsvPreviewTable", () => {
  it("muestra conteo de filas válidas", () => {
    render(
      <ProductCsvPreviewTable
        validRows={[
          { sourceRow: 2, name: "Prod A", price: 50, departamento: "moldes", categoria: "moldes", sku: "M-001" },
        ]}
        issues={[]}
      />,
    );
    expect(screen.getByText(/1 filas válidas/i)).toBeInTheDocument();
  });

  it("muestra badge de errores cuando hay issues", () => {
    render(
      <ProductCsvPreviewTable
        validRows={[]}
        issues={[{ sourceRow: 3, code: "INVALID_PRICE", detail: "Precio inválido" }]}
      />,
    );
    expect(screen.getByText(/1 error/i)).toBeInTheDocument();
  });

  it("muestra tabla de filas válidas", () => {
    render(
      <ProductCsvPreviewTable
        validRows={[
          { sourceRow: 2, name: "Chocolate Amargo", price: 125, departamento: "hgourmet", categoria: "chocolate", sku: "CHOC-001" },
        ]}
        issues={[]}
      />,
    );
    expect(screen.getByText("Chocolate Amargo")).toBeInTheDocument();
    expect(screen.getByText("$125.00")).toBeInTheDocument();
    expect(screen.getByText("CHOC-001")).toBeInTheDocument();
  });

  it("muestra tabla de errores con código y detalle", () => {
    render(
      <ProductCsvPreviewTable
        validRows={[]}
        issues={[{ sourceRow: 5, code: "DUPLICATE_SKU", detail: "SKU duplicado: CHOC-001" }]}
      />,
    );
    expect(screen.getByText("SKU duplicado")).toBeInTheDocument();
    expect(screen.getByText(/SKU duplicado: CHOC-001/)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ProductCsvImportPanel — UI behavior
// ─────────────────────────────────────────────────────────────────────────────
describe("ProductCsvImportPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra zona de upload en estado inicial", () => {
    render(<ProductCsvImportPanel />);
    expect(screen.getByText(/seleccionar un archivo csv/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /descargar template/i })).toBeInTheDocument();
  });

  it("muestra link de descarga de template con href correcto", () => {
    render(<ProductCsvImportPanel />);
    const link = screen.getByRole("link", { name: /descargar template/i }) as HTMLAnchorElement;
    expect(link.href).toContain("/templates/product-import-template.csv");
    expect(link.download).toBeDefined();
  });

  it("muestra error cuando se selecciona archivo no-CSV", async () => {
    render(<ProductCsvImportPanel />);

    const input = screen.getByLabelText(/seleccionar archivo csv/i);
    const file = new File(["data"], "datos.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // fireEvent bypasses jsdom's accept-filter so we can test the component's own validation
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/solo se aceptan archivos \.csv/i)).toBeInTheDocument();
    });
  });

  it("muestra preview con filas válidas al cargar CSV válido", async () => {
    const user = userEvent.setup();
    render(<ProductCsvImportPanel />);

    const csvContent = [
      "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada",
      '"Molde Redondo","Molde 20cm","89.50","Moldes","moldes","M-001","","",true,false,false',
    ].join("\n");

    const file = new File([csvContent], "productos.csv", { type: "text/csv" });
    const input = screen.getByLabelText(/seleccionar archivo csv/i);
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/1 filas válidas/i)).toBeInTheDocument();
    });
  });

  it("muestra botón de confirmar importación con conteo de filas válidas", async () => {
    const user = userEvent.setup();
    render(<ProductCsvImportPanel />);

    const csvContent = [
      "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada",
      '"Prod A","","50.00","Moldes","moldes","M-001","","",true,false,false',
    ].join("\n");

    const file = new File([csvContent], "prods.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /confirmar importación \(1 productos\)/i })).toBeInTheDocument();
    });
  });

  it("muestra botón Cancelar en estado preview", async () => {
    const user = userEvent.setup();
    render(<ProductCsvImportPanel />);

    const csv = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada\n" +
      '"Prod","","50.00","Moldes","moldes","M-001","","",true,false,false';
    const file = new File([csv], "p.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    });
  });

  it("BDD escenario 1: muestra resumen de éxito tras importar 50 productos", async () => {
    const user = userEvent.setup();

    mockImportProductsCsv.mockResolvedValueOnce({
      success: true,
      summary: {
        batchId: "batch-123",
        totalRows: 50,
        created: 50,
        updated: 0,
        skipped: 0,
        errored: 0,
        issues: [],
      },
    });

    render(<ProductCsvImportPanel />);

    const csv = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada\n" +
      '"Prod A","","50.00","Moldes","moldes","M-001","","",true,false,false';
    const file = new File([csv], "p.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /confirmar importación/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirmar importación/i }));

    await waitFor(() => {
      expect(screen.getByText(/importación completada/i)).toBeInTheDocument();
    });

    // "Creados" card shows 50 (may have multiple 50s on screen — total + created)
    expect(screen.getAllByText("50").length).toBeGreaterThanOrEqual(1);
  });

  it("BDD escenario 3: muestra resumen con 3 duplicados omitidos", async () => {
    const user = userEvent.setup();

    mockImportProductsCsv.mockResolvedValueOnce({
      success: true,
      summary: {
        batchId: "batch-456",
        totalRows: 10,
        created: 7,
        updated: 0,
        skipped: 3,
        errored: 0,
        issues: [
          { sourceRow: 3, code: "DUPLICATE_SKU", detail: "SKU duplicado: CHOC-001" },
          { sourceRow: 6, code: "DUPLICATE_SKU", detail: "SKU duplicado: CHOC-002" },
          { sourceRow: 9, code: "DUPLICATE_SKU", detail: "SKU duplicado: CHOC-003" },
        ],
      },
    });

    render(<ProductCsvImportPanel />);

    const csv = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada\n" +
      '"Prod A","","50.00","Moldes","moldes","M-001","","",true,false,false';
    const file = new File([csv], "p.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /confirmar importación/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirmar importación/i }));

    await waitFor(() => {
      expect(screen.getByText(/importación completada/i)).toBeInTheDocument();
    });

    // Issues table shown
    expect(screen.getByText(/3 errores/i)).toBeInTheDocument();
  });

  it("muestra error del servidor cuando importProductsCsv falla", async () => {
    const user = userEvent.setup();

    mockImportProductsCsv.mockResolvedValueOnce({
      success: false,
      error: "Error al importar productos a la base de datos.",
    });

    render(<ProductCsvImportPanel />);

    const csv = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada\n" +
      '"Prod A","","50.00","Moldes","moldes","M-001","","",true,false,false';
    const file = new File([csv], "p.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /confirmar importación/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirmar importación/i }));

    await waitFor(() => {
      expect(screen.getByText(/error en la importación/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/error al importar productos a la base de datos/i).length).toBeGreaterThanOrEqual(1);
  });

  it("permite reintentar tras error haciendo clic en 'Intentar de nuevo'", async () => {
    const user = userEvent.setup();

    mockImportProductsCsv.mockResolvedValueOnce({
      success: false,
      error: "Error de red",
    });

    render(<ProductCsvImportPanel />);

    const csv = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada\n" +
      '"Prod A","","50.00","Moldes","moldes","M-001","","",true,false,false';
    const file = new File([csv], "p.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /confirmar importación/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirmar importación/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /intentar de nuevo/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /intentar de nuevo/i }));

    expect(screen.getByText(/seleccionar un archivo csv/i)).toBeInTheDocument();
  });

  it("vuelve a estado idle al hacer clic en Cancelar", async () => {
    const user = userEvent.setup();
    render(<ProductCsvImportPanel />);

    const csv = "nombre,descripcion,precio,departamento,categoria,clave1,clave2,codigo_sat,disponible,destacado,temporada\n" +
      '"Prod A","","50.00","Moldes","moldes","M-001","","",true,false,false';
    const file = new File([csv], "p.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText(/seleccionar archivo csv/i), file);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(screen.getByText(/seleccionar un archivo csv/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ProductTable — botón Importar CSV
// ─────────────────────────────────────────────────────────────────────────────
describe("ProductTable — botón Importar CSV", () => {
  it("muestra link de Importar CSV apuntando a /admin/productos/importar", async () => {
    const { ProductTable } = await import("@/components/admin/ProductTable");

    render(
      <ProductTable
        products={[]}
        totalCount={0}
        currentPage={1}
        pageSize={10}
        currentSearch=""
      />,
    );

    const importLink = screen.getByRole("link", { name: /importar csv/i }) as HTMLAnchorElement;
    expect(importLink).toBeInTheDocument();
    expect(importLink.href).toContain("/admin/productos/importar");
  });
});
