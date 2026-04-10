import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { SubscriptionSection } from "@/components/account/subscription-section";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      createdAt: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
    },
  });

  if (!user) redirect("/login");

  const memberSince = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gérez vos informations, votre sécurité et votre abonnement
      </p>

      <div className="mt-8 space-y-6">
        {/* ── Informations personnelles ─────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations personnelles</CardTitle>
            <CardDescription>
              L&apos;adresse e-mail associée à votre compte Flash Locatif
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-gray-500">
                Adresse e-mail
              </span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-gray-500">
                Membre depuis
              </span>
              <span className="text-gray-700">{memberSince}</span>
            </div>
          </CardContent>
        </Card>

        {/* ── Changer le mot de passe ───────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changer le mot de passe</CardTitle>
            <CardDescription>
              Choisissez un nouveau mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>

        {/* ── Abonnement ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Abonnement</CardTitle>
            <CardDescription>
              Votre formule Flash Locatif et vos options de facturation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionSection
              subscriptionStatus={user.subscriptionStatus}
              hasStripeCustomer={!!user.stripeCustomerId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
