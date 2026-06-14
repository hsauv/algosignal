import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

// ---------------------------------------------------------------------------
// DELETE /api/admin/comments/[id] — remove a comment (moderator only).
// Comments are an unmoderated, anonymous vector; this gives the host a takedown
// tool for defamatory / illicit comments (LCEN).
// ---------------------------------------------------------------------------
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdmin()) {
    return NextResponse.json(
      { error: "Action réservée aux modérateurs." },
      { status: 403 },
    );
  }

  try {
    await prisma.comment.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Commentaire introuvable." },
        { status: 404 },
      );
    }
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le commentaire." },
      { status: 500 },
    );
  }
}
