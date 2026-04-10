import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DeclarationStatus } from "@/lib/generated/prisma/client";

/* ── Helpers ─────────────────────────────────────────── */

function statusLabel(status: DeclarationStatus): string {
  switch (status) {
    case "DRAFT":
      return "En cours";
    case "COMPLETED":
      return "Complété";
    case "PAID":
      return "Payé";
  }
}

function statusVariant(status: DeclarationStatus): "default" | "secondary" | "outline" {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "COMPLETED":
      return "outline";
    case "PAID":
      return "default";
  }
}

function statusHref(id: string, status: DeclarationStatus): string {
  switch (status) {
    case "PAID":
      return `/declaration/${id}/documents`;
    case "COMPLETED":
      return `/declaration/${id}/step-4`;
    default:
      return `/declaration/${id}/step-1`;
  }
}

function statusCta(status: DeclarationStatus): string {
  switch (status) {
    case "PAID":
      return "Voir mes documents";
    case "COMPLETED":
      return "Voir la simulation";
    default:
      return "Continuer";
  }
}

/* ── New declaration server action ───────────────────── */
async function createDeclaration(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const taxYear = parseInt(formData.get("taxYear") as string, 10);

  const declaration = await db.declaration.create({
    data: {
      userId: session.user.id,
      taxYear: isNaN(taxYear) ? new Date().getFullYear() - 1 : taxYear,
    },
    select: { id: true },
  });

  redirect(`/declaration/${declaration.id}/step-1`);
}

/* ── Page ────────────────────────────────────────────── */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declarations = await db.declaration.findMany({
    where: { userId: session.user.id },
    orderBy: { taxYear: "desc" },
    select: {
      id: true,
      taxYear: true,
      status: true,
      paidAt: true,
      createdAt: true,
    },
  });

  const currentYear = new Date().getFullYear();
  const declarationYear = currentYear - 1; // declaring for previous tax year

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes déclarations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos déclarations de revenus fonciers
          </p>
        </div>

        {/* New declaration form */}
        <form action={createDeclaration}>
          <input type="hidden" name="taxYear" value={declarationYear} />
          <Button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            + Nouvelle déclaration {declarationYear}
          </Button>
        </form>
      </div>

      {/* Empty state */}
      {declarations.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white px-8 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <svg
              className="h-8 w-8 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            Aucune déclaration pour l&apos;instant
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Commencez votre déclaration de revenus fonciers {declarationYear}. Le
            processus prend moins de 10 minutes.
          </p>

          <form action={createDeclaration} className="mt-6">
            <input type="hidden" name="taxYear" value={declarationYear} />
            <Button
              type="submit"
              size="lg"
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              Commencer ma déclaration {declarationYear} →
            </Button>
          </form>

          <p className="mt-3 text-xs text-gray-400">
            Sans engagement — simulation gratuite
          </p>
        </div>
      ) : (
        /* Declarations list */
        <div className="mt-8 space-y-3">
          {declarations.map((declaration) => (
            <div
              key={declaration.id}
              className="flex items-center justify-between rounded-xl border border-border bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                {/* Year bubble */}
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                  {declaration.taxYear}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Revenus fonciers {declaration.taxYear}
                  </p>
                  <p className="text-xs text-gray-400">
                    Créée le{" "}
                    {new Date(declaration.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={statusVariant(declaration.status)}
                  className={cn(
                    declaration.status === "PAID" &&
                      "bg-green-100 text-green-800 border-green-200"
                  )}
                >
                  {statusLabel(declaration.status)}
                </Badge>

                <Link href={statusHref(declaration.id, declaration.status)}>
                  <Button variant="outline" size="sm" className="text-sm">
                    {statusCta(declaration.status)}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info banner */}
      <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-4">
        <p className="text-sm text-brand-700">
          <span className="font-semibold">Rappel fiscal :</span> La campagne de
          déclaration {declarationYear} ouvre en avril {currentYear} sur
          impots.gouv.fr. Préparez vos documents dès maintenant.
        </p>
      </div>
    </div>
  );
}
