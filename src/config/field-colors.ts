import type { FieldSlug } from "@/types/field"

/**
 * Maps field slugs to distinct HSL colors for visual differentiation
 * (e.g., left border of paper tiles).
 */
export const FIELD_COLORS: Record<FieldSlug, string> = {
  "computer-science": "hsl(210, 70%, 50%)",
  medicine: "hsl(0, 65%, 50%)",
  chemistry: "hsl(280, 55%, 55%)",
  biology: "hsl(140, 55%, 40%)",
  "materials-science": "hsl(200, 40%, 55%)",
  physics: "hsl(45, 80%, 50%)",
  geology: "hsl(30, 50%, 45%)",
  psychology: "hsl(320, 50%, 55%)",
  art: "hsl(350, 65%, 55%)",
  history: "hsl(25, 60%, 45%)",
  geography: "hsl(170, 50%, 45%)",
  sociology: "hsl(260, 45%, 55%)",
  business: "hsl(215, 55%, 45%)",
  "political-science": "hsl(0, 45%, 40%)",
  economics: "hsl(160, 50%, 40%)",
  philosophy: "hsl(50, 60%, 50%)",
  mathematics: "hsl(230, 60%, 55%)",
  engineering: "hsl(15, 65%, 50%)",
  "environmental-science": "hsl(120, 45%, 40%)",
  "agricultural-and-food-sciences": "hsl(80, 50%, 40%)",
  education: "hsl(190, 55%, 45%)",
  law: "hsl(240, 35%, 45%)",
  linguistics: "hsl(300, 40%, 50%)",
}

export function getFieldColor(slug: string): string {
  return FIELD_COLORS[slug as FieldSlug] ?? "hsl(220, 15%, 50%)"
}
