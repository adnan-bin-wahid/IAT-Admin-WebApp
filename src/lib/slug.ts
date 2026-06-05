/**
 * Converts a string into a lowercase kebab-case slug.
 * E.g., "Morning & Evening Duas" -> "morning-evening-duas"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
}
