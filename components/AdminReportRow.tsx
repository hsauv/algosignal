"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiasType, Domain, ReportStatus } from "@prisma/client";
import { DomainBadge } from "./DomainBadge";
import { StatusBadge } from "./StatusBadge";
import { BIAS_TYPE_LABELS } from "@/lib/constants";
import { excerpt, formatDate } from "@/lib/utils";

export type AdminReport = {
  id: string;
  domain: Domain;
  systemName: string;
  biasTypes: BiasType[];
  description: string;
  status: ReportStatus;
  createdAt: string | Date;
};

// A single row in the moderation queue with verify / reject actions.
export function AdminReportRow({ report }: { report: AdminReport }) {
  const router = useRouter();
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [pending, setPending] = useState<ReportStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setReportStatus(next: ReportStatus) {
    setPending(next);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Action impossible.");
      }
      setStatus(next);
      router.refresh(); // re-fetch the server-rendered queue
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <DomainBadge domain={report.domain} />
        <StatusBadge status={status} />
        <span className="ml-auto text-xs text-gray-400">
          {formatDate(report.createdAt)}
        </span>
      </div>

      <h3 className="mt-3 font-semibold text-gray-900">{report.systemName}</h3>
      <p className="mt-1 text-sm text-gray-600">{excerpt(report.description, 220)}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {report.biasTypes.map((b) => (
          <span key={b} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {BIAS_TYPE_LABELS[b]}
          </span>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setReportStatus("VERIFIED")}
          disabled={pending !== null || status === "VERIFIED"}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {pending === "VERIFIED" ? "…" : "Vérifier"}
        </button>
        <button
          type="button"
          onClick={() => setReportStatus("REMOVED")}
          disabled={pending !== null || status === "REMOVED"}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {pending === "REMOVED" ? "…" : "Retirer"}
        </button>
      </div>
    </div>
  );
}
