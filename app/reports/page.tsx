import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ReportCard } from "@/components/ReportCard";
import { Filters } from "@/components/Filters";
import { listReportsQuerySchema } from "@/lib/validations";
import { PAGE_SIZE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type SearchParams = {
  domain?: string;
  biasType?: string;
  status?: string;
  page?: string;
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Validate/normalize the query string. On invalid input fall back to defaults.
  const parsed = listReportsQuerySchema.safeParse(searchParams);
  const { domain, biasType, status, page } = parsed.success
    ? parsed.data
    : { domain: undefined, biasType: undefined, status: undefined, page: 1 };

  // Public listing never exposes REMOVED content; a status filter is honoured
  // only for public statuses.
  const statusFilter =
    status && status !== "REMOVED"
      ? { status }
      : { status: { not: "REMOVED" as const } };

  const where: Prisma.ReportWhereInput = {
    ...(domain && { domain }),
    ...statusFilter,
    ...(biasType && { biasTypes: { has: biasType } }),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.report.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Build a query string preserving filters for pagination links.
  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (domain) sp.set("domain", domain);
    if (biasType) sp.set("biasType", biasType);
    if (status) sp.set("status", status);
    sp.set("page", String(p));
    return `/reports?${sp.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Signalements</h1>
        <p className="mt-1 text-gray-600">{total} signalement(s) au total.</p>
      </div>

      <Filters />

      {reports.length === 0 ? (
        <p className="text-gray-500">
          Aucun signalement ne correspond à ces filtres.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:border-brand hover:text-brand"
            >
              ← Précédent
            </Link>
          )}
          <span className="px-3 py-2 text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageHref(page + 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:border-brand hover:text-brand"
            >
              Suivant →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
