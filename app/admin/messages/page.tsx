import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages — Modération",
};

export default async function AdminMessagesPage() {
  if (!isAdmin()) redirect("/admin/login");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Messages reçus ({messages.length})
        </h1>
        <Link href="/admin" className="text-sm text-brand hover:underline">
          ← Modération
        </Link>
      </div>

      {messages.length === 0 ? (
        <p className="text-gray-500">Aucun message pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">{m.name}</span>
                <a
                  href={`mailto:${m.email}`}
                  className="text-brand hover:underline"
                >
                  {m.email}
                </a>
                <span className="ml-auto text-xs text-gray-400">
                  {formatDate(m.createdAt)}
                </span>
              </div>
              {m.subject && (
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {m.subject}
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
