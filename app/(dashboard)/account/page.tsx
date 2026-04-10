import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
      <p className="mt-1 text-sm text-gray-500">Gérez vos informations personnelles</p>

      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adresse e-mail</CardTitle>
            <CardDescription>
              L&apos;email associé à votre compte Flash Locatif
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mot de passe</CardTitle>
            <CardDescription>
              Pour changer votre mot de passe, utilisez le lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Envoyer un lien de réinitialisation →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
