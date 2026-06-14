import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, adminToken, verifyPassword } from "@/lib/admin-auth";

const loginSchema = z.object({
  password: z.string().min(1, "Mot de passe requis."),
});

// POST /api/admin/login — exchange the shared password for an admin cookie.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mot de passe requis." }, { status: 422 });
  }

  if (!verifyPassword(parsed.data.password)) {
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

// DELETE /api/admin/login — log out (clear the cookie).
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
