import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { AdminReportRow } from "@/components/AdminReportRow";
import { AdminLogout } from "@/components/AdminLogout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Modération — AlgoSignal",
};

export default async function AdminPage() {
  // Single-password guard: anyone without a valid admin cookie is sent to login.
  if (!isAdmin()) {
    redirect("/admin/login");
  }

  // Review queue = published-but-not-yet-reviewed reports (oldest first).
  const [queue, counts] = await Promise.all([
    prisma.report.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.report.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countFor = (status: string) =>
    counts.find((c) => c.status === status)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de modération
          </h1>
          <p className="mt-1 text-gray-600">
            {countFor("PUBLISHED")} à vérifier · {countFor("VERIFIED")} vérifié(s) ·{" "}
            {countFor("REMOVED")} retiré(s)
          </p>
        </div>
        <AdminLogout />
      </div>

      <p className="rounded-lg bg-brand-light px-4 py-3 text-sm text-gray-700">
        Modèle hébergeur : les signalements sont publiés dès leur dépôt. Vous
        pouvez les <strong>vérifier</strong> (label de confiance) ou les{" "}
        <strong>retirer</strong> s'ils sont manifestement illicites.
      </p>

      {queue.length === 0 ? (
        <p className="text-gray-500">
          Aucun signalement à vérifier. Tout est à jour. 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {queue.map((report) => (
            <AdminReportRow key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
