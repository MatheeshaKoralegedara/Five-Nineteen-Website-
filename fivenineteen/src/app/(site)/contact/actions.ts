"use server";

import { z } from "zod";
import { Resend } from "resend";

const Inquiry = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().max(30).optional(),
  shoot: z.string().trim().max(50).optional(),
  date: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10, "Please write a little more (10+ characters)").max(5000),
  company: z.string().max(0), // hidden honeypot: real people leave it empty
});

export type ContactState = { ok: boolean; message: string } | null;

export async function sendInquiry(_prev: ContactState, form: FormData): Promise<ContactState> {
  const parsed = Inquiry.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    // A filled honeypot means a bot: pretend success so it doesn't retry
    if (form.get("company")) return { ok: true, message: "Thanks! I'll be in touch soon." };
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { name, email, phone, shoot, date, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || process.env.ADMIN_EMAIL;

  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO is missing");
    return { ok: false, message: "Sorry, the form isn't working right now. Please email me directly." };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM || "Five Nineteen <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `New inquiry from ${name}${shoot ? ` (${shoot})` : ""}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      shoot && `Type of shoot: ${shoot}`,
      date && `Date: ${date}`,
      "",
      message,
    ]
      .filter((line) => line !== undefined && line !== "")
      .join("\n")
      .replace(`Date: ${date}\n`, `Date: ${date}\n\n`),
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false, message: "Sorry, something went wrong. Please try again or email me directly." };
  }

  return { ok: true, message: "Thanks! Your message has been sent. I'll reply within a day." };
}