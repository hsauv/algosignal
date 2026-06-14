import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// PATCH /api/reports/[id]/upvote — increment the upvote counter once per browser.
//
// Dedup is done with an httpOnly cookie listing the report ids this browser has
// already upvoted. This keeps data minimisation intact (no IP stored) at the
// cost of being clearable — good enough since votes are a soft signal, not auth.
// ---------------------------------------------------------------------------

const VOTES_COOKIE = "algosignal_votes";
const MAX_TRACKED = 300; // cap cookie size

function parseVotes(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const voted = parseVotes(req.cookies.get(VOTES_COOKIE)?.value);

  // Already voted from this browser: return the current count without changing it.
  if (voted.includes(params.id)) {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: { id: true, upvotes: true },
    });
    if (!report) {
      return NextResponse.json(
        { error: "Signalement introuvable." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ...report, alreadyVoted: true });
  }

  try {
    const report = await prisma.report.update({
      where: { id: params.id },
      data: { upvotes: { increment: 1 } },
      select: { id: true, upvotes: true },
    });

    const next = [...voted, params.id].slice(-MAX_TRACKED).join(",");
    const res = NextResponse.json(report);
    res.cookies.set(VOTES_COOKIE, next, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return res;
  } catch (error) {
    // P2025 = record to update not found.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Signalement introuvable." },
        { status: 404 },
      );
    }
    console.error("Failed to upvote report:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre vote." },
      { status: 500 },
    );
  }
}
