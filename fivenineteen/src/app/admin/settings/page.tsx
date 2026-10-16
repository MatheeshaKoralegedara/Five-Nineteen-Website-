import { db } from "@/db";
import { settings } from "@/db/schema";
import { saveSetting } from "../actions";

export const instant = false;

const FIELDS = [
  { key: "about_text", label: "About text", type: "textarea" },
  { key: "contact_email", label: "Contact email", type: "email" },
  { key: "whatsapp", label: "WhatsApp number (e.g. 94771234567)", type: "text" },
  { key: "instagram", label: "Instagram username (without @)", type: "text" },
] as const;

export default async function SettingsPage() {
  const rows = await db.select().from(settings);
  const value = (key: string) => rows.find((r) => r.key === key)?.value ?? "";

  async function save(form: FormData) {
    "use server";
    for (const f of FIELDS) {
      await saveSetting(f.key, String(form.get(f.key) ?? ""));
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <form action={save} className="mt-6 space-y-5">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-sm font-medium">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                name={f.key}
                defaultValue={value(f.key)}
                rows={6}
                className="w-full rounded-lg border bg-white px-3 py-2"
              />
            ) : (
              <input
                name={f.key}
                type={f.type}
                defaultValue={value(f.key)}
                className="w-full rounded-lg border bg-white px-3 py-2"
              />
            )}
          </label>
        ))}
        <button className="rounded-lg bg-black px-4 py-2 text-white">Save settings</button>
      </form>
    </main>
  );
}