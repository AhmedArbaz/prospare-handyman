import { Resend } from "resend";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import es from "@/messages/es.json";

export const messages = { en, fr, es } as const;
export type Locale = keyof typeof messages;

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email skipped: RESEND_API_KEY not set] to=${opts.to} subject="${opts.subject}"`);
    return;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Prospare Handyman Work <onboarding@resend.dev>",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
  if (error) console.error("[email error]", error);
}
