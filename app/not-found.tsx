import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        {/* Illustration */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <span className="text-4xl">🏠</span>
        </div>

        <h1 className="text-6xl font-extrabold text-blue-700">404</h1>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Page introuvable
        </h2>
        <p className="mt-3 text-gray-500 leading-relaxed">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Vérifiez l&apos;URL ou revenez à l&apos;accueil.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-800 transition"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Mon tableau de bord
          </Link>
        </div>
      </div>
    </main>
  );
}
