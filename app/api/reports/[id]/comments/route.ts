import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validations";
import { zodErrorToFieldMap } from "@/lib/utils";
import { detectSpam } from "@/lib/form-token";

// ---------------------------------------------------------------------------
// POST /api/reports/[id]/comments — add a comment to a report.
// Commenting is allowed anonymously (userId stays null when logged out).
// ---------------------------------------------------------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Le commentaire est invalide.",
        fields: zodErrorToFieldMap(parsed.error),
      },
      { status: 422 },
    );
  }

  try {
    // Comments are anonymous in the single-moderator model.
    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        reportId: params.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    // P2003 = foreign key constraint failed (report does not exist).
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Signalement introuvable." },
        { status: 404 },
      );
    }
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le commentaire." },
      { status: 500 },
    );
  }
}
