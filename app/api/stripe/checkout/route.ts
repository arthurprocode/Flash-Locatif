import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

const PRICE_IDS: Record<string, string> = {
  solo: process.env.STRIPE_PRICE_ID_SOLO ?? "",
  multi: process.env.STRIPE_PRICE_ID_MULTI ?? "",
  pro: process.env.STRIPE_PRICE_ID_PRO ?? "",
};

const bodySchema = z.object({
  declarationId: z.string(),
  plan: z.enum(["solo", "multi", "pro"]),
});

export async function POST(request: Request) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body: unknown = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { declarationId, plan } = parsed.data;

    // Verify ownership
    const declaration = await db.declaration.findUnique({
      where: { id: declarationId },
      select: { userId: true, status: true, paidAt: true },
    });
    if (!declaration || declaration.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Non trouvé" }, { status: 404 });
    }
    if (declaration.paidAt) {
      return NextResponse.json({ success: false, error: "Déjà payé" }, { status: 409 });
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json(
        { success: false, error: "Plan invalide ou non configuré." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        declarationId,
        userId: session.user.id,
        plan,
      },
      success_url: `${baseUrl}/declaration/${declarationId}/documents?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/declaration/${declarationId}/step-5?canceled=true`,
      customer_email: session.user.email ?? undefined,
    });

    return NextResponse.json({ success: true, data: { url: checkoutSession.url } });
  } catch (error) {
    console.error("[POST /api/stripe/checkout]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
