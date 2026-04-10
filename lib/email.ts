import { Resend } from "resend";
import { render } from "@react-email/render";
import { createElement } from "react";
import { WelcomeEmail } from "@/emails/welcome";
import { DeclarationReadyEmail } from "@/emails/declaration-ready";

// Lazy init — avoids throwing at module load time during builds
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY environment variable is not set");
  return new Resend(key);
}

export const FROM_EMAIL = "Flash Locatif <noreply@flashlocatif.fr>";

// ─── Welcome email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(userEmail: string): Promise<void> {
  const html = await render(createElement(WelcomeEmail, { userEmail }));

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: "Bienvenue sur Flash Locatif 🏠",
    html,
  });

  if (error) {
    console.error("[sendWelcomeEmail]", error);
  }
}

// ─── Declaration ready email ──────────────────────────────────────────────────

export interface DeclarationReadyPayload {
  userEmail: string;
  taxYear: number;
  declarationId: string;
  netFoncierFinal: number;
  isDeficit: boolean;
  recommendedRegime: "micro" | "reel";
}

export async function sendDeclarationReadyEmail(
  payload: DeclarationReadyPayload
): Promise<void> {
  const html = await render(createElement(DeclarationReadyEmail, payload));

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.userEmail,
    subject: `Vos documents Flash Locatif ${payload.taxYear} sont prêts ✅`,
    html,
  });

  if (error) {
    console.error("[sendDeclarationReadyEmail]", error);
  }
}

// Re-export raw client for one-off use (e.g. forgot-password)
export function getResendClient(): Resend {
  return getResend();
}
