"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="text-sm text-neutral-600 hover:text-black"
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
      }}
    >
      Log out
    </button>
  );
}