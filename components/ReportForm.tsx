"use client";

import { useState } from "react";
import Link from "next/link";
import { BiasType, Domain } from "@prisma/client";
import { BiasTagSelector } from "./BiasTagSelector";
import { DeletionLinkNotice } from "./DeletionLinkNotice";
import { DOMAINS, DOMAIN_LABELS } from "@/lib/constants";
import { createReportSchema } from "@/lib/validations";
import { zodErrorToFieldMap } from "@/lib/utils";

type FieldErrors = Record<string, string>;

type SubmissionResult = { id: string; deletionToken: string };

// Full submission form with client-side Zod validation. The same schema runs
// again server-side, so validation can never be bypassed.
export function ReportForm({ formToken }: { formToken: string }) {
  const [domain, setDomain] = useState<Domain | "">("");
  const [systemName, setSystemName] = useState("");
  const [biasTypes, setBiasTypes] = useState<BiasType[]>([]);
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — stays empty for humans

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const candidate = {
      domain,
      systemName,
      biasTypes,
      description,
      evidenceUrl,
      consent,
    };

    // Client-side validation first.
    const parsed = createReportSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors(zodErrorToFieldMap(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website, formToken }),
      });

      if (res.status === 201) {
        const data = (await res.json()) as SubmissionResult;
        setResult(data);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.fields) setErrors(data.fields as FieldErrors);
      setFormError(
        data.error ?? "Une erreur est survenue. Veuillez réessayer.",
      );
    } catch {
      setFormError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setSubmitting(false);
    }
  }

  // Once submitted, show the one-time deletion link instead of the form.
  if (result) {
    return <DeletionLinkNotice reportId={result.id} token={result.deletionToken} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      {/* Honeypot — hidden from humans, bots tend to fill it. Keep it empty. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Domain */}
      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
          Domaine concerné
        </label>
        <select
          id="domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value as Domain)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        >
          <option value="">Sélectionnez un domaine…</option>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {DOMAIN_LABELS[d]}
            </option>
          ))}
        </select>
        {errors.domain && <FieldError message={errors.domain} />}
      </div>

      {/* System name */}
      <div>
        <label htmlFor="systemName" className="block text-sm font-medium text-gray-700">
          Nom du système ou de l'outil IA
        </label>
        <input
          id="systemName"
          type="text"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          placeholder="ex. Outil de tri de CV, scoring de crédit…"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {errors.systemName && <FieldError message={errors.systemName} />}
      </div>

      {/* Bias types */}
      <div>
        <span className="block text-sm font-medium text-gray-700">
          Type(s) de biais constaté(s)
        </span>
        <div className="mt-2">
          <BiasTagSelector value={biasTypes} onChange={setBiasTypes} disabled={submitting} />
        </div>
        {errors.biasTypes && <FieldError message={errors.biasTypes} />}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description de la situation
        </label>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le résultat produit par l'IA et en quoi vous l'estimez biaisé ou discriminatoire."
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {errors.description && <FieldError message={errors.description} />}
      </div>

      {/* Evidence */}
      <div>
        <label htmlFor="evidenceUrl" className="block text-sm font-medium text-gray-700">
          Preuve (lien ou description) <span className="text-gray-400">— facultatif</span>
        </label>
        <input
          id="evidenceUrl"
          type="text"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          placeholder="Lien vers une capture, un article, un document…"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {errors.evidenceUrl && <FieldError message={errors.evidenceUrl} />}
      </div>

      {/* Anonymity notice */}
      <p className="rounded-lg bg-brand-light px-4 py-3 text-sm text-gray-700">
        Tous les signalements sont <strong>anonymes</strong> : nous ne collectons
        ni votre nom, ni votre e-mail, ni votre adresse IP. Après envoi, un{" "}
        <strong>lien de suppression</strong> vous sera fourni pour effacer votre
        témoignage à tout moment.
      </p>

      {/* Consent (RGPD legal basis — mandatory, not pre-checked) */}
      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          Je consens au traitement des informations de ce signalement,
          conformément à la{" "}
          <Link href="/confidentialite" className="text-brand underline" target="_blank">
            politique de confidentialité
          </Link>
          . Je comprends que cette description sera publiée publiquement.
        </label>
      </div>
      {errors.consent && <FieldError message={errors.consent} />}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Envoi en cours…" : "Envoyer le signalement"}
      </button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}
