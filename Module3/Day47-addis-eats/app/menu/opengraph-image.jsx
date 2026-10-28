import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_TYPE } from "@/lib/og";
import { dishes, categories } from "@/lib/dishes";
import { etb } from "@/lib/format";

// The preview for /menu (a section-level file overrides the site-wide one for everything under it,
// until a deeper file - the per-dish one - overrides it again).
export const alt = "The Addis Eats menu";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  const prices = dishes.map((d) => d.price);
  return new ImageResponse(
    (
      <OgCard
        eyebrow="ADDIS EATS"
        title="Our menu"
        subtitle={`${dishes.length} dishes across ${categories.length} categories: ${categories.join(", ")}.`}
        badge={`From ${etb(Math.min(...prices))}`}
        palette={["#8f2a1d", "#d99a2b", "#3f7a46", "#a4531f", "#b9461f"]}
      />
    ),
    { ...OG_SIZE }
  );
}
