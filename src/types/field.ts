export interface FieldOfInterest {
  id: number
  name: string
  slug: string
  iconName: string
}

export const FIELD_SLUGS = [
  "computer-science", "medicine", "chemistry", "biology", "materials-science",
  "physics", "geology", "psychology", "art", "history", "geography",
  "sociology", "business", "political-science", "economics", "philosophy",
  "mathematics", "engineering", "environmental-science",
  "agricultural-and-food-sciences", "education", "law", "linguistics"
] as const

export type FieldSlug = typeof FIELD_SLUGS[number]
