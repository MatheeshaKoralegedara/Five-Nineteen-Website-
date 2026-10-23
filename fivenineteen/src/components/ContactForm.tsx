"use client";
import { useActionState } from "react";
import { sendInquiry, type ContactState } from "@/app/(site)/contact/actions";

// min-w-0 stops date/select inputs from forcing the column wider than the screen
const field =
  "block w-full min-w-0 min-h-11 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base focus:border-black focus:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendInquiry, null);

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Name *</span>
          <input name="name" required className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email *</span>
          <input name="email" type="email" required className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Phone / WhatsApp</span>
          <input name="phone" type="tel" className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Type of shoot</span>
          <select name="shoot" className={field} defaultValue="">
            <option value="">Choose one</option>
            <option>Graduation</option>
            <option>Wedding</option>
            <option>Engagement / Pre-shoot</option>
            <option>Portrait</option>
            <option>Event</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Date (if known)</span>
          {/* appearance-none: iOS Safari otherwise ignores the width and centers the date */}
          <input name="date" type="date" className={`${field} appearance-none text-left`} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Message *</span>
        <textarea name="message" required minLength={10} rows={6} className={field} />
      </label>

      {/* Honeypot: hidden from people, bots fill it in */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        disabled={pending}
        className="rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}