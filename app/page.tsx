import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsBar } from "@/components/StatsBar";
import { ReportCard } from "@/components/ReportCard";
import { CONTACT_EMAIL } from "@/lib/constants";

// Always render fresh stats (avoid static caching of counts).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Public views never include REMOVED content.
  const visible = { status: { not: "REMOVED" as const } };

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
    <div className="space-y-20">
      {/* ---------------------------------------------------------------- */}
      {/* Association — IA au féminin                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Association citoyenne
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          IA au féminin
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Pour une intelligence artificielle juste et inclusive. Nous donnons la
          parole à celles et ceux que les algorithmes rendent invisibles — en
          particulier les femmes et les minorités — et nous agissons pour des
          systèmes plus équitables.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="#algosignal"
            className="rounded-lg bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark"
          >
            Signaler un biais
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:border-brand hover:text-brand"
          >
            Nous contacter
          </a>
        </div>
      </section>

      {/* Mission — three pillars */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            title: "Documenter",
            body: "Recueillir les témoignages de discriminations produites par des systèmes d'IA, de façon anonyme et sécurisée.",
          },
          {
            title: "Sensibiliser",
            body: "Rendre visibles des biais souvent invisibles, et informer le public comme les décideurs.",
          },
          {
            title: "Agir",
            body: "S'appuyer sur ces signalements pour plaider en faveur d'une IA plus juste et responsable.",
          },
        ].map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <h3 className="font-semibold text-brand">{pillar.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{pillar.body}</p>
          </div>
        ))}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* AlgoSignal — the reporting platform                              */}
      {/* ---------------------------------------------------------------- */}
      <section id="algosignal" className="scroll-mt-20 space-y-8">
        <div className="rounded-2xl bg-brand-light p-8 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Notre plateforme de signalement
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            AlgoSignal
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Une IA vous a traité·e injustement — pour un emploi, un crédit, un
            soin, un logement&nbsp;? Partagez votre expérience de manière{" "}
            <strong>anonyme</strong>. Chaque signalement aide à rendre ces
            discriminations visibles.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
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
        </div>

        <StatsBar
          totalReports={totalReports}
          systemsIdentified={distinctSystems.length}
          domainsCovered={distinctDomains.length}
        />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Derniers signalements
            </h3>
            <Link href="/reports" className="text-sm text-brand hover:underline">
              Voir tout →
            </Link>
          </div>

          {latest.length === 0 ? (
            <p className="mt-4 text-gray-500">
              Aucun signalement pour le moment. Soyez la première personne à en
              publier un.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {latest.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
