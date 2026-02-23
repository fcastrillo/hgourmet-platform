/**
 * Parses a recipe's Markdown content field into structured sections
 * following the Content Rendering Contract defined in HU-4.3.
 *
 * Expected markdown structure:
 *   ## Ingredientes
 *   - item
 *   ## Preparación
 *   1. step
 *   ## Tip HGourmet
 *   paragraph text
 *
 * Fallback: unrecognised content is returned as a plain text block.
 */

export type IngredientsSection = { type: "ingredientes"; items: string[] };
export type StepsSection = { type: "preparacion"; steps: string[] };
export type TipSection = { type: "tip"; text: string };
export type TextSection = { type: "text"; content: string };

export type RecipeSection =
  | IngredientsSection
  | StepsSection
  | TipSection
  | TextSection;

export function parseRecipeContent(markdown: string): RecipeSection[] {
  const sections: RecipeSection[] = [];
  const raw = markdown ?? "";

  // Split on level-2 headers (## ...) keeping header text
  const parts = raw.split(/^##[ \t]+/m).filter(Boolean);

  for (const part of parts) {
    const newlineIdx = part.indexOf("\n");
    const headerRaw =
      newlineIdx === -1 ? part.trim() : part.slice(0, newlineIdx).trim();
    const body =
      newlineIdx === -1 ? "" : part.slice(newlineIdx + 1).trim();
    const header = headerRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (header === "ingredientes") {
      const items = body
        .split("\n")
        .map((l) => l.replace(/^[-*]\s+/, "").trim())
        .filter(Boolean);
      if (items.length > 0) sections.push({ type: "ingredientes", items });
    } else if (header === "preparacion" || header === "preparacion:") {
      const steps = body
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s+/, "").replace(/^[-*]\s+/, "").trim())
        .filter(Boolean);
      if (steps.length > 0) sections.push({ type: "preparacion", steps });
    } else if (header.startsWith("tip")) {
      const text = body.trim();
      if (text) sections.push({ type: "tip", text });
    } else if (body) {
      sections.push({ type: "text", content: body });
    }
  }

  // Fallback: if nothing was parsed (no ##-structured content)
  if (sections.length === 0 && raw.trim()) {
    sections.push({ type: "text", content: raw.trim() });
  }

  return sections;
}

/**
 * Derives a short excerpt from recipe content for the card listing.
 * Strips markdown headers and list prefixes, returns first meaningful line.
 */
export function getRecipeExcerpt(content: string, maxLength = 120): string {
  const lines = (content ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const first = (lines[0] ?? "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .trim();

  return first.length > maxLength ? first.slice(0, maxLength) + "…" : first;
}
