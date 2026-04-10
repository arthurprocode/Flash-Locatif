import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DocumentsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declaration = await db.declaration.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      taxYear: true,
      status: true,
      paidAt: true,
      planType: true,
    },
  });

  if (!declaration || declaration.userId !== session.user.id) notFound();
  if (!declaration.paidAt) redirect(`/declaration/${id}/step-5`);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Success banner */}
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-green-800">Paiement confirmé</p>
          <p className="text-sm text-green-700">
            Vos documents pour la déclaration {declaration.taxYear} sont prêts.
          </p>
        </div>
      </div>

      {/* Document downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formulaire 2044 pré-rempli</CardTitle>
          <CardDescription>
            Votre déclaration de revenus fonciers {declaration.taxYear} pré-remplie avec vos données.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href={`/api/declaration/${id}/generate-pdf?type=form`}>
            <Button className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger le formulaire 2044 (PDF)
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Guide pas à pas</CardTitle>
          <CardDescription>
            Comment reporter vos résultats sur impots.gouv.fr, étape par étape.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href={`/api/declaration/${id}/generate-pdf?type=guide`}>
            <Button variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50 gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger le guide (PDF)
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Déclarer sur impots.gouv.fr</CardTitle>
          <CardDescription>
            Une fois vos PDF téléchargés, rendez-vous sur le site des impôts pour saisir vos revenus fonciers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="https://www.impots.gouv.fr/particulier/declarer-mes-revenus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Aller sur impots.gouv.fr
            </Button>
          </a>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border bg-gray-50 px-4 py-4 text-sm text-gray-500">
        <p className="font-medium text-gray-700">Rappel important</p>
        <p className="mt-1">
          Flash Locatif est un outil d&apos;aide à la déclaration. Vérifiez toujours vos documents avant de les reporter sur impots.gouv.fr. En cas de doute, consultez un expert-comptable.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
          ← Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
