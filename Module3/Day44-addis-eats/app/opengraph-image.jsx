import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_TYPE } from "@/lib/og";

// File convention: this name, at the top of app/, is the preview for every page that does not
// have a more specific opengraph-image beside it. No import, no config - the name is the API.
export const alt = "Addis Eats - Ethiopian food, delivered across Addis Ababa";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="ADDIS EATS"
        title="Ethiopian food, delivered."
        subtitle="Kitfo, tibs, shiro and more, across Addis Ababa."
        palette={["#8f2a1d", "#d99a2b", "#3f7a46", "#a4531f", "#b9461f"]}
      />
    ),
    { ...OG_SIZE }
  );
}
