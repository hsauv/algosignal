"use client";

import { useState } from "react";
import { createCommentSchema } from "@/lib/validations";
import { formatDate } from "@/lib/utils";

export type CommentData = {
  id: string;
  content: string;
  createdAt: string | Date;
};

type CommentSectionProps = {
  reportId: string;
  initialComments: CommentData[];
  canModerate?: boolean;
  formToken: string;
};

// Comments list + anonymous-friendly submission form.
export function CommentSection({
  reportId,
  initialComments,
  canModerate = false,
  formToken,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot

  async function removeComment(id: string) {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setRemovingId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = createCommentSchema.safeParse({ content });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Commentaire invalide.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website, formToken }),
      });
      if (res.status !== 201) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }
      const created: CommentData = await res.json();
      setComments((prev) => [created, ...prev]);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900">
        Commentaires ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {/* Honeypot — keep empty. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="comment-website">Ne pas remplir</label>
          <input
            id="comment-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Ajouter un commentaire…"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Publier"}
        </button>
      </form>

      <ul className="mt-6 space-y-4">
        {comments.length === 0 && (
          <li className="text-sm text-gray-500">Aucun commentaire pour le moment.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Anonyme</span>
              <span>{formatDate(c.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
              {c.content}
            </p>
            {canModerate && (
              <button
                type="button"
                onClick={() => removeComment(c.id)}
                disabled={removingId === c.id}
                className="mt-2 text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                {removingId === c.id ? "Suppression…" : "Supprimer (modération)"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
