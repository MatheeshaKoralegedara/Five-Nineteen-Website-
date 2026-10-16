"use client"
import { authClient } from "@/lib/auth-client";

export default function Login() {
    return (
        <main className="grid min-h-screen place-items-center">
            <button
                className="rounded-full border px-6 py-3 hover:bg-neutral-100"
                onClick={() =>
                    authClient.signIn.social({ provider: "google", callbackURL: "/admin" })

                }
                >Sign in with Google</button>
        </main>
    );
}