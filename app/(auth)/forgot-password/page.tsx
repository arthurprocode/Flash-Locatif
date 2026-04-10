"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(null);
    setServerError(null);

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });

      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        setServerError(json.error ?? "Une erreur est survenue.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Email envoyé</CardTitle>
          <CardDescription>
            Si un compte existe pour cette adresse, vous recevrez un email avec
            un lien de réinitialisation dans quelques minutes.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Retour à la connexion
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
        <CardDescription>
          Saisissez votre adresse e-mail pour recevoir un lien de
          réinitialisation.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {serverError && (
            <div
              role="alert"
              className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {serverError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p id="email-error" className="text-xs text-error">
                {emailError}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white"
            disabled={loading}
          >
            {loading ? "Envoi en cours…" : "Envoyer le lien"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            <Link
              href="/login"
              className="font-medium text-brand-600 hover:underline"
            >
              Retour à la connexion
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
