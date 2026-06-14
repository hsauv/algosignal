import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { verifyDeletionToken } from "@/lib/report-token";

// ---------------------------------------------------------------------------
// GET /api/reports/[id] — single report with comments.
// REMOVED content is treated as not found for the public.
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!report || report.status === "REMOVED") {
      return NextResponse.json(
        { error: "Signalement introuvable." },
        { status: 404 },
      );
    }

    // Never expose the deletion token hash to clients.
    const { deletionTokenHash, ...safe } = report;
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Failed to fetch report:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le signalement." },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/reports/[id] — erase a report (RGPD right to erasure).
// Authorised either by the moderator (admin cookie) or by presenting the
// one-time deletion token issued at submission (?token=… or JSON body).
// This is a hard delete; comments cascade.
// ---------------------------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    select: { id: true, deletionTokenHash: true },
  });

  if (!report) {
    return NextResponse.json(
      { error: "Signalement introuvable." },
      { status: 404 },
    );
  }

  let authorised = isAdmin();

  if (!authorised) {
    const tokenFromQuery = new URL(req.url).searchParams.get("token");
    const body = await req.json().catch(() => null);
    const token = tokenFromQuery ?? (body && typeof body.token === "string" ? body.token : null);

    authorised = Boolean(
      token && report.deletionTokenHash && verifyDeletionToken(token, report.deletionTokenHash),
    );
  }

  if (!authorised) {
    return NextResponse.json(
      { error: "Lien de suppression invalide ou expiré." },
      { status: 403 },
    );
  }

  try {
    await prisma.report.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete report:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le signalement." },
      { status: 500 },
    );
  }
}
