"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DeletionLinkNoticeProps = {
  reportId: string;
  token: string;
};

// Success screen shown once after a report is created. Surfaces the one-time
// deletion link the author must keep to exercise their right to erasure.
export function DeletionLinkNotice({ reportId, token }: DeletionLinkNoticeProps) {
  const [deletionUrl, setDeletionUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Build an absolute URL on the client (origin only known in the browser).
    setDeletionUrl(
      `${window.location.origin}/reports/${reportId}/delete?token=${token}`,
    );
  }, [reportId, token]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(deletionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable; the field is selectable anyway */
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h2 className="text-lg font-semibold text-green-800">
          Signalement publié ✅
        </h2>
        <p className="mt-1 text-sm text-green-700">
          Merci. Votre témoignage est désormais visible publiquement (statut
          « non vérifié » tant qu'il n'a pas été revu).
        </p>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h3 className="font-semibold text-amber-900">
          ⚠️ Conservez votre lien de suppression
        </h3>
        <p className="mt-1 text-sm text-amber-800">
          Ce lien est le <strong>seul moyen</strong> de supprimer vous-même votre
          signalement (droit à l'effacement). Il ne sera affiché qu'une fois et
          n'est lié à aucun compte.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={deletionUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={copy}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/reports/${reportId}`}
          className="rounded-lg bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          Voir mon signalement
        </Link>
        <Link
          href="/reports"
          className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:border-brand hover:text-brand"
        >
          Tous les signalements
        </Link>
      </div>
    </div>
  );
}
