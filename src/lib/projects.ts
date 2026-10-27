// Sample entries. In Step 5 these come from Supabase (table: projects).
// Set `image` to a photo URL to replace the solid color block.
export type Tone = "orange" | "yellow" | "black" | "paper";

export type Project = {
  key: "tv" | "deck" | "painting" | "fireplace" | "patching" | "holiday";
  tone: Tone;
  image?: string;
};

export const projects: Project[] = [
  { key: "tv", tone: "orange", image: "/images/work/tv.svg" },
  { key: "deck", tone: "black", image: "/images/work/deck.svg" },
  { key: "painting", tone: "yellow", image: "/images/work/painting.svg" },
  { key: "fireplace", tone: "paper", image: "/images/work/fireplace.svg" },
  { key: "patching", tone: "orange", image: "/images/work/patching.svg" },
  { key: "holiday", tone: "black", image: "/images/work/holiday.svg" },
];
