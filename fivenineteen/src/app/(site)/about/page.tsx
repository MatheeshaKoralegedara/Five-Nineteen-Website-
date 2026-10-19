import Link from "next/link";
import { getSettings } from "@/db/queries";

export default async function About() {
  const s = await getSettings();
  const paragraphs = (s.about_text ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold">About</h1>
      {paragraphs.length ? (
        <div className="space-y-4 leading-relaxed text-neutral-700">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      ) : (
        <p className="text-neutral-500">Add your About text in Admin → Settings.</p>
      )}
      <Link
        href="/contact"
        className="mt-10 inline-block rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-neutral-800"
      >
        Get in touch
      </Link>
    </section>
  );
}