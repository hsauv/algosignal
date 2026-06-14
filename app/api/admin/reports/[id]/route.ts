import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { updateReportStatusSchema } from "@/lib/validations";
import { zodErrorToFieldMap } from "@/lib/utils";

// ---------------------------------------------------------------------------
// PATCH /api/admin/reports/[id] — change a report's status.
// Restricted to the moderator (valid admin cookie required).
// ---------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdmin()) {
    return NextResponse.json(
      { error: "Action réservée aux modérateurs." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide : corps JSON illisible." },
      { status: 400 },
    );
  }

  const parsed = updateReportStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Statut invalide.",
        fields: zodErrorToFieldMap(parsed.error),
      },
      { status: 422 },
    );
  }

  try {
    const report = await prisma.report.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json(report);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Signalement introuvable." },
        { status: 404 },
      );
    }
    console.error("Failed to update report status:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le statut." },
      { status: 500 },
    );
  }
}
