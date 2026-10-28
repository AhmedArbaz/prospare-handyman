import { z } from "zod";

export const SERVICES = ["holiday", "electrical", "tv", "fireplace", "plumbing", "patching", "painting", "deck", "other"] as const;
export const TIMES = ["morning", "afternoon", "evening", "flexible"] as const;
export const LOCALES = ["en", "fr", "es"] as const;

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES: readonly string[] = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// Error messages are translation keys (messages: book.errors.<key>).
export const bookingSchema = z.object({
  name: z.string().trim().min(2, "required").max(100, "required"),
  phone: z.string().trim().regex(/^[+()\d\s.-]{7,20}$/, "phone"),
  email: z.string().trim().max(200, "email").email("email"),
  address: z.string().trim().min(5, "required").max(300, "required"),
  service: z.enum(SERVICES, { message: "required" }),
  preferredDate: z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "required"),
  preferredTime: z.enum(TIMES, { message: "required" }),
  reason: z.string().trim().min(10, "reasonShort").max(2000, "reasonShort"),
  consent: z.boolean().refine((v) => v === true, "consent"),
  locale: z.enum(LOCALES),
});

export type BookingInput = z.input<typeof bookingSchema>;

export const photoMetaSchema = z.object({
  type: z.string().refine((t) => PHOTO_TYPES.includes(t)),
  size: z.number().int().positive().max(MAX_PHOTO_BYTES),
});
