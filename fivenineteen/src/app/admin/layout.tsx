import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <Link href="/admin" className="font-semibold">Admin</Link>
          <Link href="/admin" className="text-sm text-neutral-600 hover:text-black">Galleries</Link>
          <Link href="/admin/settings" className="text-sm text-neutral-600 hover:text-black">Settings</Link>
          <Link href="/" target="_blank" className="text-sm text-neutral-600 hover:text-black">View site ↗</Link>
          <div className="ml-auto"><SignOutButton /></div>
        </nav>
      </header>
      {children}
    </div>
  );
}