// Sample entries. In Step 5 these come from Supabase (table: projects).
// Set `image` to a photo URL to replace the solid color block.
export type Tone = "orange" | "yellow" | "black" | "paper";

export type Project = {
  key: "tv" | "deck" | "painting" | "fireplace" | "patching" | "holiday";
  tone: Tone;
  image?: string;
};

export const projects: Project[] = [
  { key: "tv", tone: "orange" },
  { key: "deck", tone: "black" },
  { key: "painting", tone: "yellow" },
  { key: "fireplace", tone: "paper" },
  { key: "patching", tone: "orange" },
  { key: "holiday", tone: "black" },
];
