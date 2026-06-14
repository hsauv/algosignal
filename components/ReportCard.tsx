import Link from "next/link";
import { BiasType, Domain, ReportStatus } from "@prisma/client";
import { DomainBadge } from "./DomainBadge";
import { StatusBadge } from "./StatusBadge";
import { BIAS_TYPE_LABELS } from "@/lib/constants";
import { excerpt, formatDate } from "@/lib/utils";

// Minimal shape this card needs — compatible with the API list payload.
export type ReportCardData = {
  id: string;
  domain: Domain;
  systemName: string;
  biasTypes: BiasType[];
  description: string;
  status: ReportStatus;
  upvotes: number;
  createdAt: string | Date;
};

export function ReportCard({ report }: { report: ReportCardData }) {
  return (
    <Link
      href={`/reports/${report.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-wrap items-center gap-2">
        <DomainBadge domain={report.domain} />
        <StatusBadge status={report.status} />
        <span className="ml-auto text-xs text-gray-400">
          {formatDate(report.createdAt)}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900">
        {report.systemName}
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        {excerpt(report.description)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {report.biasTypes.map((b) => (
          <span
            key={b}
            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {BIAS_TYPE_LABELS[b]}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-gray-500">
          ▲ {report.upvotes}
        </span>
      </div>
    </Link>
  );
}
