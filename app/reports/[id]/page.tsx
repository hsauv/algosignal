import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { issueFormToken } from "@/lib/form-token";
import { DomainBadge } from "@/components/DomainBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { UpvoteButton } from "@/components/UpvoteButton";
import { CommentSection } from "@/components/CommentSection";
import { BIAS_TYPE_LABELS, CONTACT_EMAIL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // REMOVED reports are not publicly viewable.
  if (!report || report.status === "REMOVED") notFound();

  // Has this browser already upvoted? (votes cookie is httpOnly → read here.)
  const votedReports = (cookies().get("algosignal_votes")?.value ?? "").split(",");
  const hasVoted = votedReports.includes(report.id);

  // Detect whether evidence is a clickable URL or a free-text description.
  const isLink = report.evidenceUrl
    ? /^https?:\/\//i.test(report.evidenceUrl)
    : false;

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/reports" className="text-sm text-brand hover:underline">
        ← Retour aux signalements
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <DomainBadge domain={report.domain} />
          <StatusBadge status={report.status} />
          <span className="ml-auto text-sm text-gray-400">
            {formatDate(report.createdAt)}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          {report.systemName}
        </h1>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {report.biasTypes.map((b) => (
          <span
            key={b}
            className="rounded bg-gray-100 px-2.5 py-1 text-sm text-gray-700"
          >
            {BIAS_TYPE_LABELS[b]}
          </span>
        ))}
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Description
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-gray-800">
          {report.description}
        </p>
      </section>

      {report.evidenceUrl && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Preuve
          </h2>
          {isLink ? (
            <a
              href={report.evidenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block break-all text-brand hover:underline"
            >
              {report.evidenceUrl}
            </a>
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-gray-800">
              {report.evidenceUrl}
            </p>
          )}
        </section>
      )}

      <div className="mt-8">
        <UpvoteButton
          reportId={report.id}
          initialUpvotes={report.upvotes}
          initialVoted={hasVoted}
        />
      </div>

      <CommentSection
        reportId={report.id}
        initialComments={report.comments}
        canModerate={isAdmin()}
        formToken={issueFormToken()}
      />

      {/* Notice-and-takedown (LCEN): visible way to report illicit content. */}
      <footer className="mt-10 border-t border-gray-200 pt-4 text-sm text-gray-500">
        Ce contenu vous semble diffamatoire ou illicite ?{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            `Signalement de contenu — ${report.id}`,
          )}&body=${encodeURIComponent(
            `Je signale le contenu suivant : /reports/${report.id}\n\nMotif :`,
          )}`}
          className="text-brand underline"
        >
          Signaler ce contenu
        </a>
        .
      </footer>
    </article>
  );
}
