import { z } from "zod";

// Format a date with the French locale (e.g. "13 juin 2026").
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// Truncate a description for card previews without cutting mid-word.
export function excerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).trimEnd() + "…";
}

// Turn a ZodError into a flat { field: message } map for the client form.
export function zodErrorToFieldMap(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.errors) {
    const key = issue.path.join(".") || "_form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
