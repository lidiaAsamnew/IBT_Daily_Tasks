import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_TYPE } from "@/lib/og";
import { getDish } from "@/lib/dishes";
import { etb } from "@/lib/format";

// One preview card per dish, drawn from the dish record: add a dish and its card exists.
export const alt = "A dish from the Addis Eats menu";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({ params }) {
  const { id } = await params; // a Promise in Next 15, like the page
  const dish = getDish(id);

  if (!dish) {
    // Unknown id: a neutral card, never a crash (the page itself answers 404).
    return new ImageResponse(
      <OgCard eyebrow="ADDIS EATS" title="Dish not found" subtitle="See the full menu at addiseats.et" palette={["#e9dcc0"]} />,
      { ...OG_SIZE }
    );
  }

  return new ImageResponse(
    (
      <OgCard
        eyebrow={dish.category.toUpperCase() + (dish.spicy ? " · SPICY" : "")}
        title={dish.name}
        subtitle={dish.description}
        badge={etb(dish.price)}
        palette={dish.palette}
      />
    ),
    { ...OG_SIZE }
  );
}
