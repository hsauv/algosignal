import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsBar } from "@/components/StatsBar";
import { ReportCard } from "@/components/ReportCard";
import { CONTACT_EMAIL } from "@/lib/constants";

// Always render fresh stats (avoid static caching of counts).
export const dynamic = "force-dynamic";

const PILLARS = [
  {
    icon: "🎓",
    title: "Sensibiliser",
    body: "Des ateliers pour comprendre l'IA sans jargon, repérer les biais et reprendre le pouvoir sur ces outils.",
  },
  {
    icon: "🔎",
    title: "Documenter",
    body: "AlgoSignal recueille, de façon anonyme, les témoignages de discriminations produites par des systèmes d'IA.",
  },
  {
    icon: "⚖️",
    title: "Agir",
    body: "Nous nous appuyons sur ces signalements pour plaider en faveur d'une IA plus juste et responsable.",
  },
];

const AUDIENCES = [
  { icon: "🏫", label: "Écoles & jeunes" },
  { icon: "🤝", label: "Associations" },
  { icon: "🏢", label: "Entreprises & collectivités" },
  { icon: "🌍", label: "Grand public" },
];

export default async function HomePage() {
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
    <div className="space-y-24">
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-pink-600 px-6 py-16 text-center text-white shadow-lg sm:px-10 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-100">
          IA au féminin · association citoyenne
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
          Rendre visibles les discriminations que l'IA produit.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-rose-50">
          Nous <strong className="text-white">sensibilisons</strong> par des
          ateliers, nous <strong className="text-white">recueillons</strong> les
          signalements, et nous <strong className="text-white">agissons</strong>{" "}
          — pour une intelligence artificielle juste et inclusive, en
          particulier pour les femmes et les minorités.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#ateliers"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand shadow-sm transition hover:bg-rose-50"
          >
            Participer à un atelier
          </a>
          <a
            href="#algosignal"
            className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Signaler un biais
          </a>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* MISSION — 3 pillars                                              */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Notre démarche
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Comprendre, documenter, agir
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-2xl">
                {p.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* ATELIERS                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="ateliers" className="scroll-mt-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Nos ateliers
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Comprendre l'IA, sans jargon.
            </h2>
            <p className="mt-4 text-gray-600">
              L'intelligence artificielle est partout — mais elle reste opaque
              pour la plupart d'entre nous. Nos ateliers de{" "}
              <strong>vulgarisation</strong> et de{" "}
              <strong>sensibilisation</strong> expliquent simplement comment ces
              systèmes fonctionnent, comment ils peuvent discriminer, et comment
              s'en protéger.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Décrypter le fonctionnement de l'IA avec des exemples concrets",
                "Reconnaître les biais de genre, d'origine, d'âge ou de handicap",
                "Connaître ses droits et savoir réagir face à une décision automatisée",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-0.5 text-brand">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "Organiser un atelier IA au féminin",
                )}`}
                className="inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
              >
                Organiser un atelier
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {AUDIENCES.map((a) => (
              <div
                key={a.label}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="text-3xl">{a.icon}</div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* ALGOSIGNAL                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section id="algosignal" className="scroll-mt-20 space-y-8">
        <div className="rounded-3xl bg-brand-light p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
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
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              Faire un signalement
            </Link>
            <Link
              href="/reports"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
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

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT CTA band                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Envie d'agir avec nous&nbsp;?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Organiser un atelier, soutenir l'association, ou simplement en savoir
          plus — écrivez-nous.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          Nous contacter
        </a>
      </section>
    </div>
  );
}
