"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-gray-600 sm:block" title={email}>
        {email.length > 30 ? `${email.slice(0, 30)}…` : email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm"
      >
        Déconnexion
      </Button>
    </div>
  );
}
