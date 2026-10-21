import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";

const isAdmin = (email?: string | null) =>
  !!email &&
  email.trim().toLowerCase() === (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isAdmin(user.email)) {
            throw new APIError("FORBIDDEN", { message: "This account is not allowed." });
          }
          return { data: user };
        },
      },
    },
  },
});

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized");
  }
  return session;
}