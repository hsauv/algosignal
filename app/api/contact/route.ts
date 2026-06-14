import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createContactSchema } from "@/lib/validations";
import { zodErrorToFieldMap } from "@/lib/utils";
import { detectSpam } from "@/lib/form-token";

// ---------------------------------------------------------------------------
// POST /api/contact — store a contact message (no email infra; read in /admin).
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

  // Anti-spam (honeypot + signed time-trap).
  if (detectSpam(body)) {
    return NextResponse.json(
      { error: "Envoi refusé. Rechargez la page et réessayez dans quelques instants." },
      { status: 400 },
    );
  }

  const parsed = createContactSchema.safeParse(body);
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

  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject?.trim() || null,
        message: data.message,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to store contact message:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du message." },
      { status: 500 },
    );
  }
}
