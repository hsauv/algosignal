import { z } from "zod";
import { BiasType, Domain, ReportStatus } from "@prisma/client";

// ---------------------------------------------------------------------------
// Shared Zod schemas — imported by both the client form and the API routes
// so validation rules stay identical end-to-end.
// French messages are used because they surface directly to the user.
// ---------------------------------------------------------------------------

const domainEnum = z.nativeEnum(Domain, {
  errorMap: () => ({ message: "Veuillez sélectionner un domaine valide." }),
});

const biasTypeEnum = z.nativeEnum(BiasType);

export const createReportSchema = z.object({
  domain: domainEnum,
  systemName: z
    .string({ required_error: "Le nom du système est obligatoire." })
    .trim()
    .min(2, "Le nom du système doit contenir au moins 2 caractères.")
    .max(120, "Le nom du système ne peut pas dépasser 120 caractères."),
  biasTypes: z
    .array(biasTypeEnum, {
      required_error: "Sélectionnez au moins un type de biais.",
    })
    .min(1, "Sélectionnez au moins un type de biais.")
    .max(7, "Trop de types de biais sélectionnés."),
  description: z
    .string({ required_error: "La description est obligatoire." })
    .trim()
    .min(30, "La description doit contenir au moins 30 caractères.")
    .max(5000, "La description ne peut pas dépasser 5000 caractères."),
  evidenceUrl: z
    .string()
    .trim()
    .max(2000, "La preuve ne peut pas dépasser 2000 caractères.")
    .optional()
    .or(z.literal("")),
  // RGPD legal basis: explicit, opt-in consent. Must be literally true.
  consent: z.literal(true, {
    errorMap: () => ({
      message:
        "Vous devez consentir au traitement de ces données pour envoyer le signalement.",
    }),
  }),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

// Query-string filters for GET /api/reports. Everything arrives as strings.
export const listReportsQuerySchema = z.object({
  domain: z.nativeEnum(Domain).optional(),
  biasType: z.nativeEnum(BiasType).optional(),
  status: z.nativeEnum(ReportStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;

// Moderator action on a report.
export const updateReportStatusSchema = z.object({
  status: z.nativeEnum(ReportStatus, {
    errorMap: () => ({ message: "Statut invalide." }),
  }),
});

export const createCommentSchema = z.object({
  content: z
    .string({ required_error: "Le commentaire ne peut pas être vide." })
    .trim()
    .min(2, "Le commentaire est trop court.")
    .max(2000, "Le commentaire ne peut pas dépasser 2000 caractères."),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// Contact form.
export const createContactSchema = z.object({
  name: z
    .string({ required_error: "Votre nom est requis." })
    .trim()
    .min(2, "Votre nom est requis.")
    .max(120, "Nom trop long."),
  email: z
    .string({ required_error: "Votre e-mail est requis." })
    .trim()
    .email("Adresse e-mail invalide.")
    .max(200, "E-mail trop long."),
  subject: z.string().trim().max(200, "Sujet trop long.").optional().or(z.literal("")),
  message: z
    .string({ required_error: "Votre message est requis." })
    .trim()
    .min(10, "Votre message est trop court (10 caractères minimum).")
    .max(5000, "Message trop long."),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
