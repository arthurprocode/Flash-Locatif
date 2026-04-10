import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StepProgress } from "@/components/ui/step-progress";
import { StepFiveForm } from "@/components/declaration/step-five-form";

const STEP_LABELS = ["Biens", "Revenus", "Charges", "Simulation", "Paiement"];

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ canceled?: string }>;
}

export default async function StepFivePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { canceled } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declaration = await db.declaration.findUnique({
    where: { id },
    select: { id: true, userId: true, taxYear: true, status: true, paidAt: true },
  });

  if (!declaration || declaration.userId !== session.user.id) notFound();
  if (declaration.paidAt) redirect(`/declaration/${id}/documents`);

  return (
    <div className="space-y-6">
      <StepProgress current={5} total={5} labels={STEP_LABELS} />
      <div>
        <Link href={`/declaration/${id}/step-4`} className="text-sm text-gray-500 hover:text-brand-600">
          ← Retour à la simulation
        </Link>
      </div>

      {canceled === "true" && (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Le paiement a été annulé. Vous pouvez réessayer à tout moment.
        </div>
      )}

      <StepFiveForm declarationId={id} taxYear={declaration.taxYear} />
    </div>
  );
}
