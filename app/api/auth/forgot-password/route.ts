import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getResendClient, FROM_EMAIL } from "@/lib/email";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Look up user — always return 200 to prevent email enumeration
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Invalidate old tokens for this user
    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Create new reset token (valid 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

    await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Réinitialisation de votre mot de passe — Flash Locatif",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe Flash Locatif.</p>
          <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>
          <a href="${resetUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: white; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Réinitialiser mon mot de passe
          </a>
          <p style="color: #6b7280; font-size: 13px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
