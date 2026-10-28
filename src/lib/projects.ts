// Photos live in public/images/work. In Step 5 these come from Supabase (table: projects).
// The first entry marked `wide` spans two columns on desktop.
export type Project = {
  key: "fireplace" | "deck" | "painting" | "patching" | "holiday";
  image: string;
  wide?: boolean;
};

export const projects: Project[] = [
  { key: "fireplace", image: "/images/work/fireplace.png", wide: true },
  { key: "deck", image: "/images/work/deck.png" },
  { key: "painting", image: "/images/work/painting.png" },
  { key: "patching", image: "/images/work/patching.png" },
  { key: "holiday", image: "/images/work/holiday.png" },
];
