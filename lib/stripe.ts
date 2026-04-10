import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  solo: process.env.STRIPE_PRICE_ID_SOLO ?? "",
  multi: process.env.STRIPE_PRICE_ID_MULTI ?? "",
} as const;
