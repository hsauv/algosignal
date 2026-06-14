import Link from "next/link";
import {
  COMPRENDRE_INTRO,
  BIAS_CAUSES,
  BIAS_FACTS,
  BIAS_DOMAINS,
  BIAS_ACTIONS,
  BIAS_RESOURCES,
} from "@/lib/content";

export const metadata = {
  title: "Comprendre les biais algorithmiques — IA au féminin",
  description:
    "Ce qu'il faut savoir sur les biais algorithmiques : ce que c'est, comment ils apparaissent, où on les rencontre, et que faire.",
};

export default function ComprendrePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="py-8 text-center sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Comprendre
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          Les biais algorithmiques, expliqués simplement
        </h1>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-brand" />
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          {COMPRENDRE_INTRO}
        </p>
      </section>

      {/* Comment ça arrive */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900">Comment ça arrive&nbsp;?</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BIAS_CAUSES.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-2xl">
                {c.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Le saviez-vous (highlight) */}
      <section className="rounded-3xl bg-brand-light p-8 sm:p-12">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Le saviez-vous&nbsp;?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {BIAS_FACTS.map((f) => (
            <div key={f.label} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                {f.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Où les rencontre-t-on */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900">
          Où les rencontre-t-on&nbsp;?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BIAS_DOMAINS.map((d) => (
            <div
              key={d.label}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5"
            >
              <span className="font-semibold text-brand">{d.label}</span>
              <span className="text-sm text-gray-600">{d.example}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Que faire */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900">Que faire&nbsp;?</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {BIAS_ACTIONS.map((a, i) => (
            <div
              key={a.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{a.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/report"
            className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            Signaler un biais
          </Link>
          <Link
            href="/#ateliers"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
          >
            Participer à un atelier
          </Link>
        </div>
      </section>

      {/* Pour aller plus loin */}
      <section className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">Pour aller plus loin</h2>
        <ul className="mt-4 space-y-2">
          {BIAS_RESOURCES.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                {r.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
