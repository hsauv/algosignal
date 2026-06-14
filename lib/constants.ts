import { BiasType, Domain, ReportStatus } from "@prisma/client";

// ---------------------------------------------------------------------------
// French display labels for every enum value.
// Code/keys stay in English; only the user-facing strings are translated.
// ---------------------------------------------------------------------------

export const DOMAIN_LABELS: Record<Domain, string> = {
  HEALTHCARE: "Santé",
  EMPLOYMENT: "Emploi",
  CREDIT: "Crédit",
  JUSTICE: "Justice",
  EDUCATION: "Éducation",
  HOUSING: "Logement",
  OTHER: "Autre",
};

export const BIAS_TYPE_LABELS: Record<BiasType, string> = {
  GENDER: "Genre",
  ETHNICITY: "Origine ethnique",
  AGE: "Âge",
  DISABILITY: "Handicap",
  LANGUAGE: "Langue",
  GEOGRAPHY: "Géographie",
  OTHER: "Autre",
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  PUBLISHED: "Non vérifié",
  VERIFIED: "Vérifié",
  REMOVED: "Retiré",
};

// Tailwind class sets used by DomainBadge — one colour per domain.
export const DOMAIN_COLORS: Record<Domain, string> = {
  HEALTHCARE: "bg-rose-100 text-rose-700",
  EMPLOYMENT: "bg-blue-100 text-blue-700",
  CREDIT: "bg-amber-100 text-amber-700",
  JUSTICE: "bg-purple-100 text-purple-700",
  EDUCATION: "bg-emerald-100 text-emerald-700",
  HOUSING: "bg-cyan-100 text-cyan-700",
  OTHER: "bg-gray-100 text-gray-700",
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  PUBLISHED: "bg-gray-100 text-gray-700",
  VERIFIED: "bg-green-100 text-green-800",
  REMOVED: "bg-red-100 text-red-800",
};

// Convenience arrays for iterating in selectors / filters.
export const DOMAINS = Object.keys(DOMAIN_LABELS) as Domain[];
export const BIAS_TYPES = Object.keys(BIAS_TYPE_LABELS) as BiasType[];
export const STATUSES = Object.keys(STATUS_LABELS) as ReportStatus[];

// Statuses visible to the public (REMOVED content is never shown).
export const PUBLIC_STATUSES: ReportStatus[] = ["PUBLISHED", "VERIFIED"];

export const PAGE_SIZE = 10;

// Contact address used for the notice-and-takedown / RGPD requests.
// TODO: set to your real contact address before launch.
export const CONTACT_EMAIL = "contact@algosignal.exemple.fr";
