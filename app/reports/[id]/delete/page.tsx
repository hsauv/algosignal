"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

// Confirmation page reached via the one-time deletion link. Performs the
// erasure after an explicit click (so link-prefetchers can't trigger it).
export default function DeleteReportPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const token = search.get("token") ?? "";

  const [state, setState] = useState<"idle" | "pending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    setState("pending");
    setError(null);
    try {
      const res = await fetch(
        `/api/reports/${params.id}?token=${encodeURIComponent(token)}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setState("done");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Suppression impossible.");
      setState("error");
    } catch {
      setError("Impossible de contacter le serveur.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900">Signalement supprimé</h1>
        <p className="mt-2 text-gray-600">
          Votre témoignage et ses commentaires ont été définitivement effacés.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">
        Supprimer ce signalement ?
      </h1>
      <p className="mt-2 text-gray-600">
        Cette action est <strong>définitive</strong>. Le signalement et tous ses
        commentaires seront effacés et ne pourront pas être récupérés.
      </p>

      {!token && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Lien de suppression incomplet (jeton manquant).
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={confirmDelete}
          disabled={!token || state === "pending"}
          className="rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {state === "pending" ? "Suppression…" : "Supprimer définitivement"}
        </button>
        <Link
          href={`/reports/${params.id}`}
          className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:border-brand hover:text-brand"
        >
          Annuler
        </Link>
      </div>
    </div>
  );
}
