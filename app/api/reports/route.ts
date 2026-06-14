import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  createReportSchema,
  listReportsQuerySchema,
} from "@/lib/validations";
import { zodErrorToFieldMap } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/constants";
import { generateDeletionToken } from "@/lib/report-token";
import { detectSpam } from "@/lib/form-token";

// ---------------------------------------------------------------------------
// POST /api/reports — create an anonymous report.
// Published immediately (host model). Requires explicit consent and returns a
// one-time deletion token the author must keep to erase their testimony.
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide : corps JSON illisible." },
      { status: 400 },
    );
  }

  // Anti-spam (honeypot + signed time-trap) before any real validation.
  if (detectSpam(body)) {
    return NextResponse.json(
      { error: "Envoi refusé. Rechargez la page et réessayez dans quelques instants." },
      { status: 400 },
    );
  }

  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Le formulaire contient des erreurs.",
        fields: zodErrorToFieldMap(parsed.error),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const { token, hash } = generateDeletionToken();

  try {
    // Always anonymous (no accounts). Published on creation; consent recorded.
    const report = await prisma.report.create({
      data: {
        domain: data.domain,
        systemName: data.systemName,
        biasTypes: data.biasTypes,
        description: data.description,
        evidenceUrl: data.evidenceUrl?.trim() || null,
        anonymous: true,
        consentedAt: new Date(),
        deletionTokenHash: hash,
      },
      select: { id: true },
    });

    // The deletion token is returned ONCE and never stored in clear text.
    return NextResponse.json(
      { id: report.id, deletionToken: token },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement du signalement." },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/reports — paginated list with filters.
// Query params: domain, biasType, status, page
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = listReportsQuerySchema.safeParse({
    domain: searchParams.get("domain") ?? undefined,
    biasType: searchParams.get("biasType") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres de filtre invalides." },
      { status: 422 },
    );
  }

  const { domain, biasType, status, page } = parsed.data;

  // Public listing never exposes REMOVED content. A status filter is honoured
  // only for public statuses.
  const statusFilter =
    status && status !== "REMOVED" ? { status } : { status: { not: "REMOVED" as const } };

  const where: Prisma.ReportWhereInput = {
    ...(domain && { domain }),
    ...statusFilter,
    ...(biasType && { biasTypes: { has: biasType } }),
  };

  try {
    const [items, total] = await prisma.$transaction([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { _count: { select: { comments: true } } },
      }),
      prisma.report.count({ where }),
    ]);

    // Never expose the deletion token hash to clients.
    const safeItems = items.map(({ deletionTokenHash, ...rest }) => rest);

    return NextResponse.json({
      items: safeItems,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (error) {
    console.error("Failed to list reports:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les signalements." },
      { status: 500 },
    );
  }
}
