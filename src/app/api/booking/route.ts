import { NextResponse } from "next/server";
import { z } from "zod";
import { bookingSchema, photoMetaSchema, MAX_PHOTOS, PHOTO_EXT } from "@/lib/booking";
import { getAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { escapeHtml, fill, messages, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

// Step 1: validate, save the booking, hand back signed URLs so the browser uploads photos straight to storage.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success, save nothing.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true, bookingId: null, uploads: [] });
  }

  const parsed = bookingSchema.safeParse(body);
  const photos = z.array(photoMetaSchema).max(MAX_PHOTOS).safeParse(body.photos ?? []);
  if (!parsed.success || !photos.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (!(await verifyTurnstile(typeof body.turnstileToken === "string" ? body.turnstileToken : undefined))) {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  const sb = getAdminClient();
  if (!sb) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const d = parsed.data;
  const { data: row, error } = await sb
    .from("bookings")
    .insert({
      name: d.name,
      phone: d.phone,
      email: d.email,
      address: d.address,
      service: d.service,
      preferred_date: d.preferredDate || null,
      preferred_time: d.preferredTime,
      reason: d.reason,
      locale: d.locale,
    })
    .select("id")
    .single();
  if (error || !row) {
    console.error("[booking insert]", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  const uploads: { path: string; token: string }[] = [];
  for (const p of photos.data) {
    const path = `${row.id}/${crypto.randomUUID()}.${PHOTO_EXT[p.type]}`;
    const { data, error: e } = await sb.storage.from("booking-photos").createSignedUploadUrl(path);
    if (e || !data) {
      console.error("[signed upload]", e);
      continue;
    }
    uploads.push({ path, token: data.token });
  }

  // Emails never block the booking.
  const en = messages.en;
  const loc = messages[d.locale];
  const svcEn = d.service === "other" ? en.book.form.other : en.services.items[d.service].title;
  const svcLoc = d.service === "other" ? loc.book.form.other : loc.services.items[d.service].title;
  const notify = process.env.BOOKING_NOTIFY_EMAIL;
  const rows: [string, string][] = [
    ["Name", d.name], ["Phone", d.phone], ["Email", d.email], ["Address", d.address],
    ["Service", svcEn], ["Preferred date", d.preferredDate || "-"], ["Preferred time", d.preferredTime],
    ["Language", d.locale.toUpperCase()], ["Photos", String(photos.data.length)], ["Reason", d.reason],
  ];
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${k}</td><td style="padding:6px 12px;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join("");
  await Promise.allSettled([
    notify
      ? sendEmail({ to: notify, replyTo: d.email, subject: `New booking: ${svcEn} - ${d.name}`, html: `<h2>New booking request</h2><table>${table}</table>` })
      : Promise.resolve(),
    sendEmail({
      to: d.email,
      replyTo: notify,
      subject: loc.emailConfirm.subject,
      html: `<p>${escapeHtml(fill(loc.emailConfirm.hello, { name: d.name }))}</p><p>${escapeHtml(fill(loc.emailConfirm.body, { service: svcLoc }))}</p><p>${escapeHtml(loc.emailConfirm.bye)}</p>`,
    }),
  ]);

  return NextResponse.json({ ok: true, bookingId: row.id, uploads });
}
