import { getSettings } from "@/db/queries";

export default async function Contact() {
  const s = await getSettings();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-4 text-3xl font-semibold">Contact</h1>
      <p className="mb-8 text-neutral-600">
        Tell me about your date, location and what you have in mind. I usually reply within a day.
      </p>

      {/* Contact form goes here in Step 8 */}

      <ul className="space-y-2 text-neutral-700">
        {s.contact_email && (
          <li>Email: <a className="underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li>
        )}
        {s.whatsapp && (
          <li>WhatsApp: <a className="underline" href={`https://wa.me/${s.whatsapp}`}>+{s.whatsapp}</a></li>
        )}
        {s.instagram && (
          <li>Instagram: <a className="underline" href={`https://instagram.com/${s.instagram}`}>@{s.instagram}</a></li>
        )}
      </ul>
    </section>
  );
}