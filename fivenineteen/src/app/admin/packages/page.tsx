import { asc } from "drizzle-orm";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { PackageEditor } from "@/components/admin/PackageEditor";

export const instant = false;

export default async function PackagesPage() {
  const list = await db.select().from(packages).orderBy(asc(packages.sortOrder), asc(packages.id));
  const order = list.map((p) => p.id);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Packages</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Published packages show on the Packages page in this order.
      </p>

      <div className="mt-6 space-y-4">
        {list.length === 0 && <p className="text-neutral-500">No packages yet. Add your first one below.</p>}
        {list.map((p) => (
          <PackageEditor key={p.id} pkg={p} order={order} />
        ))}
      </div>

      <h2 className="mt-12 mb-4 text-xl font-semibold">Add a package</h2>
      <PackageEditor />
    </main>
  );
}
