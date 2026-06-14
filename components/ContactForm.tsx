"use client";

import { useState } from "react";
import Link from "next/link";
import { createContactSchema } from "@/lib/validations";
import { zodErrorToFieldMap } from "@/lib/utils";

type FieldErrors = Record<string, string>;

export function ContactForm({ formToken }: { formToken: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = createContactSchema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      setErrors(zodErrorToFieldMap(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website, formToken }),
      });
      if (res.status === 201) {
        setSent(true);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.fields) setErrors(data.fields as FieldErrors);
      setFormError(data.error ?? "Une erreur est survenue. Veuillez réessayer.");
    } catch {
      setFormError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-lg font-semibold text-green-800">Message envoyé ✅</h2>
        <p className="mt-1 text-sm text-green-700">
          Merci, nous vous répondrons dès que possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {formError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      {/* Honeypot */}
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

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Sujet <span className="text-gray-400">— facultatif</span>
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="ex. Organiser un atelier"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Vos coordonnées ne servent qu'à vous répondre. Voir notre{" "}
        <Link href="/confidentialite" className="text-brand underline">
          politique de confidentialité
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
