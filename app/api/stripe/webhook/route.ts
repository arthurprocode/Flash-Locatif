import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendDeclarationReadyEmail } from "@/lib/email";
import { runFullCalculation } from "@/lib/tax-calculator";
import type Stripe from "stripe";
import type { TaxInputData } from "@/lib/tax-calculator";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[Stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { declarationId, plan } = session.metadata ?? {};

      if (!declarationId) {
        console.error("[Stripe webhook] Missing declarationId in metadata");
        return NextResponse.json({ received: true });
      }

      const declaration = await db.declaration.update({
        where: { id: declarationId },
        data: {
          status: "PAID",
          paidAt: new Date(),
          stripeSessionId: session.id,
          planType: plan ?? null,
        },
        include: {
          user: { select: { email: true } },
          properties: {
            orderBy: { order: "asc" },
            include: { income: true, expenses: true },
          },
          previousDeficits: { orderBy: { year: "asc" } },
        },
      });

      // Build tax result for email summary
      const taxInput: TaxInputData = {
        taxYear: declaration.taxYear,
        properties: declaration.properties.map((p) => ({
          id: p.id,
          name: p.name,
          income: {
            grossRent: p.income?.grossRent ?? 0,
            rentChargesRecovered: p.income?.rentChargesRecovered ?? 0,
          },
          expenses: {
            mortgageInterest: p.expenses?.mortgageInterest ?? 0,
            propertyManagementFees: p.expenses?.propertyManagementFees ?? 0,
            landlordInsurance: p.expenses?.landlordInsurance ?? 0,
            propertyTax: p.expenses?.propertyTax ?? 0,
            maintenanceWorks: p.expenses?.maintenanceWorks ?? 0,
            condoFees: p.expenses?.condoFees ?? 0,
            accountingFees: p.expenses?.accountingFees ?? 0,
            otherDeductible: p.expenses?.otherDeductible ?? 0,
          },
        })),
        previousDeficits: declaration.previousDeficits.map((d) => ({
          year: d.year,
          interestPortion: d.interestPortion,
          otherPortion: d.otherPortion,
        })),
      };

      const result = runFullCalculation(taxInput);

      // Send declaration-ready email — non-blocking
      sendDeclarationReadyEmail({
        userEmail: declaration.user.email,
        taxYear: declaration.taxYear,
        declarationId: declaration.id,
        netFoncierFinal: result.reelResult.netFoncierFinal,
        isDeficit: result.reelResult.netFoncierFinal < 0,
        recommendedRegime: result.recommendation,
      }).catch((err) =>
        console.error("[webhook] sendDeclarationReadyEmail failed:", err)
      );
    }

    if (event.type === "payment_intent.payment_failed") {
      // Future: send failure email, update status
      console.warn("[Stripe webhook] payment_intent.payment_failed", event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe webhook] handler error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
