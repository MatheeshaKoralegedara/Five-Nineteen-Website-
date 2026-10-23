"use client";
import { useActionState, useEffect, useRef } from "react";
import { deletePackage, reorderPackages, savePackage, type PackageState } from "@/app/admin/actions";

type Pkg = {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string;
  highlighted: boolean;
  published: boolean;
};

const field = "w-full rounded-lg border bg-white px-3 py-2";

/** Edit form for one package, or an empty "add" form when no package is given. */
export function PackageEditor({ pkg, order }: { pkg?: Pkg; order?: number[] }) {
  const [state, action, pending] = useActionState<PackageState, FormData>(savePackage, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the add form once the new package is saved
  useEffect(() => {
    if (state?.ok && !pkg) formRef.current?.reset();
  }, [state, pkg]);

  const move = (dir: -1 | 1) => {
    if (!pkg || !order) return;
    const i = order.indexOf(pkg.id);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    reorderPackages(next);
  };

  const index = pkg && order ? order.indexOf(pkg.id) : -1;

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-lg border bg-white p-5">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Name *</span>
          <input name="name" required defaultValue={pkg?.name} placeholder="e.g. Graduation Essentials" className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Price</span>
          <input name="price" defaultValue={pkg?.price} placeholder="e.g. LKR 25,000 or From LKR 40,000" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Short description</span>
        <input name="description" defaultValue={pkg?.description} placeholder="One line about who it's for" className={field} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">What&apos;s included (one per line)</span>
        <textarea
          name="features"
          rows={5}
          defaultValue={pkg?.features}
          placeholder={"2 hours of coverage\n50 edited photos\nOnline gallery"}
          className={field}
        />
      </label>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={pkg?.published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="highlighted" defaultChecked={pkg?.highlighted} />
          Highlight as &ldquo;Most popular&rdquo;
        </label>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {state && (
            <span className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</span>
          )}
          {pkg && order && (
            <>
              <button type="button" onClick={() => move(-1)} disabled={index <= 0} className="rounded-lg border px-2.5 py-2 text-sm disabled:opacity-30" aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(1)} disabled={index === order.length - 1} className="rounded-lg border px-2.5 py-2 text-sm disabled:opacity-30" aria-label="Move down">↓</button>
              <button
                type="button"
                onClick={() => confirm(`Delete "${pkg.name}"? This cannot be undone.`) && deletePackage(pkg.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </>
          )}
          <button disabled={pending} className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
            {pending ? "Saving…" : pkg ? "Save" : "Add package"}
          </button>
        </div>
      </div>
    </form>
  );
}
