"use client";

import { cn } from "@/lib/utils";

type Strength = "empty" | "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): Strength {
  if (!password) return "empty";

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const LABELS: Record<Strength, string> = {
  empty: "",
  weak: "Faible",
  medium: "Moyen",
  strong: "Fort",
};

const COLORS: Record<Strength, string> = {
  empty: "bg-gray-200",
  weak: "bg-error",
  medium: "bg-warning",
  strong: "bg-success",
};

const BARS: Record<Strength, number> = {
  empty: 0,
  weak: 1,
  medium: 2,
  strong: 3,
};

export function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  const filled = BARS[strength];

  if (strength === "empty") return null;

  return (
    <div className="mt-1 space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < filled ? COLORS[strength] : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          strength === "weak" && "text-error",
          strength === "medium" && "text-warning",
          strength === "strong" && "text-success"
        )}
      >
        Sécurité : {LABELS[strength]}
      </p>
    </div>
  );
}
