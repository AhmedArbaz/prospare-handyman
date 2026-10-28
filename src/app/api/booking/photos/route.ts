import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { MAX_PHOTOS } from "@/lib/booking";
import { escapeHtml, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Step 2: after the browser uploaded the photos, record them and email the links.
export async function POST(req: Request) {
  let body: { bookingId?: unknown; paths?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const id = typeof body.bookingId === "string" ? body.bookingId : "";
  const paths = Array.isArray(body.paths) ? body.paths.filter((p): p is string => typeof p === "string") : [];
  const pathRe = new RegExp(`^${id}/[0-9a-f-]{36}\\.(jpg|png|webp)$`);
  if (!UUID.test(id) || paths.length === 0 || paths.length > MAX_PHOTOS || !paths.every((p) => pathRe.test(p))) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const sb = getAdminClient();
  if (!sb) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const { data: booking } = await sb.from("bookings").select("id,name,created_at").eq("id", id).single();
  if (!booking || Date.now() - new Date(booking.created_at).getTime() > 60 * 60 * 1000) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const { error } = await sb.from("booking_photos").insert(paths.map((path) => ({ booking_id: id, path })));
  if (error) {
    console.error("[photo rows]", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  const notify = process.env.BOOKING_NOTIFY_EMAIL;
  if (notify) {
    const { data: signed } = await sb.storage.from("booking-photos").createSignedUrls(paths, 60 * 60 * 24 * 7);
    const links = (signed ?? [])
      .map((s) => s.signedUrl)
      .filter((u): u is string => !!u)
      .map((u, i) => `<li><a href="${escapeHtml(u)}">Photo ${i + 1}</a></li>`)
      .join("");
    await sendEmail({
      to: notify,
      subject: `Photos for booking: ${booking.name}`,
      html: `<p>${paths.length} photo(s) were added to the booking from ${escapeHtml(booking.name)}. Links work for 7 days.</p><ul>${links}</ul>`,
    });
  }
  return NextResponse.json({ ok: true });
}
