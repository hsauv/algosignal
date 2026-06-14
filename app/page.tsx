import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsBar } from "@/components/StatsBar";
import { ReportCard } from "@/components/ReportCard";

// Always render fresh stats (avoid static caching of counts).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Public views never include REMOVED content.
  const visible = { status: { not: "REMOVED" as const } };

  // Pull global stats and the latest reports in parallel.
  const [totalReports, distinctSystems, distinctDomains, latest] =
    await Promise.all([
      prisma.report.count({ where: visible }),
      prisma.report.findMany({
        where: visible,
        distinct: ["systemName"],
        select: { systemName: true },
      }),
      prisma.report.findMany({
        where: visible,
        distinct: ["domain"],
        select: { domain: true },
      }),
      prisma.report.findMany({
        where: visible,
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Une IA vous a traité·e injustement&nbsp;? Vous n'êtes pas seul·e.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          De plus en plus de décisions sont prises par des algorithmes — pour un
          emploi, un crédit, un soin, un logement. Trop souvent, ils rendent
          invisibles ou désavantagent celles et ceux qui le sont déjà —
          en particulier les femmes et les minorités.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Votre expérience compte. Partagez-la, de façon{" "}
          <strong>anonyme</strong>, pour rendre ces discriminations visibles.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/report"
            className="rounded-lg bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark"
          >
            Faire un signalement
          </Link>
          <Link
            href="/reports"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:border-brand hover:text-brand"
          >
            Explorer les signalements
          </Link>
        </div>
      </section>

      {/* Stats */}
      <StatsBar
        totalReports={totalReports}
        systemsIdentified={distinctSystems.length}
        domainsCovered={distinctDomains.length}
      />

      {/* Latest reports */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Derniers signalements
          </h2>
          <Link href="/reports" className="text-sm text-brand hover:underline">
            Voir tout →
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="mt-4 text-gray-500">
            Aucun signalement pour le moment. Soyez le premier à en publier un.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {latest.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
