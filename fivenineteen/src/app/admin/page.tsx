import { requireAdmin } from "@/lib/auth";

export default async function AdminHome() {
  const session = await requireAdmin();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p>Logged in as {session.user.email}</p>
    </main>
  );
}