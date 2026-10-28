"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import { bookingSchema, MAX_PHOTOS, MAX_PHOTO_BYTES, PHOTO_TYPES, SERVICES, TIMES, type BookingInput } from "@/lib/booking";
import { getBrowserClient } from "@/lib/supabase/browser";
import Turnstile, { turnstileEnabled } from "./Turnstile";

const field = "mt-1 w-full border-2 border-brand-black bg-white px-3 py-2.5 text-base focus:border-brand-orange";

function Field({ id, label, help, error, children }: { id: string; label: string; help?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">{label}</label>
      {help && <p id={`${id}-help`} className="text-sm text-black/60">{help}</p>}
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}

export default function BookingForm() {
  const t = useTranslations("book");
  const ts = useTranslations("services.items");
  const locale = useLocale() as BookingInput["locale"];
  const params = useSearchParams();
  const preselect = SERVICES.find((s) => s === params.get("service"));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { service: (preselect ?? "") as BookingInput["service"], preferredTime: "flexible", preferredDate: "", consent: false, locale },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const hp = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const err = (code?: string) => (code ? t(`errors.${code}`) : undefined);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    setPhotoError("");
    const next = [...files];
    for (const f of picked) {
      if (!PHOTO_TYPES.includes(f.type)) { setPhotoError(t("errors.photoType")); continue; }
      if (f.size > MAX_PHOTO_BYTES) { setPhotoError(t("errors.photoSize")); continue; }
      if (next.length >= MAX_PHOTOS) { setPhotoError(t("errors.photoCount")); break; }
      next.push(f);
    }
    setFiles(next);
  }

  async function onSubmit(values: BookingInput) {
    setServerError("");
    if (turnstileEnabled && !token) { setServerError(t("errors.captcha")); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, website: hp.current?.value ?? "", turnstileToken: token, photos: files.map((f) => ({ type: f.type, size: f.size })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setServerError(data.error === "not_configured" ? t("errors.notConfigured") : data.error === "captcha" ? t("errors.captcha") : t("errors.generic"));
        setStatus("idle");
        return;
      }

      // Photos go straight from the browser to Supabase Storage (signed URLs), so large files never hit our server.
      const sb = getBrowserClient();
      const uploaded: string[] = [];
      if (sb && data.bookingId && Array.isArray(data.uploads)) {
        for (let i = 0; i < data.uploads.length; i++) {
          const { error } = await sb.storage.from("booking-photos").uploadToSignedUrl(data.uploads[i].path, data.uploads[i].token, files[i], { contentType: files[i].type });
          if (!error) uploaded.push(data.uploads[i].path);
        }
        if (uploaded.length) {
          await fetch("/api/booking/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: data.bookingId, paths: uploaded }),
          }).catch(() => {});
        }
      }
      reset();
      setFiles([]);
      setStatus("done");
    } catch {
      setServerError(t("errors.generic"));
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="border-t-4 border-brand-black bg-white p-8">
        <CheckCircle2 aria-hidden="true" size={48} className="text-brand-orange" />
        <h2 className="mt-4 font-display text-4xl font-bold">{t("success.title")}</h2>
        <p className="mt-2 text-lg text-black/70">{t("success.text")}</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 rounded bg-brand-orange px-5 py-3 font-semibold text-brand-black hover:bg-brand-yellow">
          {t("success.another")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 border-t-4 border-brand-black bg-white p-6 sm:p-8">
      <input ref={hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t("form.name")} error={err(errors.name?.message)}>
          <input id="name" autoComplete="name" className={field} aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field id="phone" label={t("form.phone")} error={err(errors.phone?.message)}>
          <input id="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
      </div>

      <Field id="email" label={t("form.email")} error={err(errors.email?.message)}>
        <input id="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} {...register("email")} />
      </Field>

      <Field id="address" label={t("form.address")} error={err(errors.address?.message)}>
        <input id="address" autoComplete="street-address" className={field} aria-invalid={!!errors.address} {...register("address")} />
      </Field>

      <Field id="service" label={t("form.service")} error={err(errors.service?.message)}>
        <select id="service" className={field} aria-invalid={!!errors.service} {...register("service")}>
          <option value="">{t("form.servicePlaceholder")}</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s === "other" ? t("form.other") : ts(`${s}.title`)}</option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="date" label={t("form.date")} error={err(errors.preferredDate?.message)}>
          <input id="date" type="date" min={new Date().toISOString().slice(0, 10)} suppressHydrationWarning className={field} {...register("preferredDate")} />
        </Field>
        <Field id="time" label={t("form.time")} error={err(errors.preferredTime?.message)}>
          <select id="time" className={field} {...register("preferredTime")}>
            {TIMES.map((x) => <option key={x} value={x}>{t(`times.${x}`)}</option>)}
          </select>
        </Field>
      </div>

      <Field id="reason" label={t("form.reason")} help={t("form.reasonHelp")} error={err(errors.reason?.message)}>
        <textarea id="reason" rows={5} aria-describedby="reason-help" className={field} aria-invalid={!!errors.reason} {...register("reason")} />
      </Field>

      <div>
        <span className="block font-semibold">{t("form.photos")}</span>
        <p className="text-sm text-black/60">{t("form.photosHelp")}</p>
        <input ref={fileInput} type="file" multiple accept={PHOTO_TYPES.join(",")} onChange={onPick} className="sr-only" aria-label={t("form.addPhotos")} />
        <button type="button" onClick={() => fileInput.current?.click()} disabled={files.length >= MAX_PHOTOS}
          className="mt-2 inline-flex items-center gap-2 border-2 border-brand-black px-4 py-2.5 font-semibold hover:bg-brand-yellow disabled:opacity-50">
          <ImagePlus size={20} aria-hidden="true" /> {t("form.addPhotos")} ({files.length}/{MAX_PHOTOS})
        </button>
        {photoError && <p role="alert" className="mt-1 text-sm font-semibold text-red-700">{photoError}</p>}
        {files.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="relative aspect-square overflow-hidden bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previews[i]} alt="" className="h-full w-full object-cover" />
                <button type="button" aria-label={`${t("form.remove")} ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 bg-brand-black p-1 text-white hover:bg-brand-orange hover:text-brand-black">
                  <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-brand-orange" aria-invalid={!!errors.consent} {...register("consent")} />
          <span>{t("form.consent")}</span>
        </label>
        {errors.consent && <p role="alert" className="mt-1 text-sm font-semibold text-red-700">{err(errors.consent.message)}</p>}
      </div>

      <Turnstile onToken={setToken} />
      {serverError && <p role="alert" className="border-l-4 border-red-700 bg-red-50 p-3 font-semibold text-red-800">{serverError}</p>}

      <button type="submit" disabled={status === "sending"} className="w-full rounded bg-brand-orange px-6 py-3.5 text-lg font-semibold text-brand-black hover:bg-brand-yellow disabled:opacity-60 sm:w-auto">
        {status === "sending" ? t("form.sending") : t("form.submit")}
      </button>
    </form>
  );
}
