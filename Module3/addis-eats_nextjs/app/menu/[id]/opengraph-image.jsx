import { ImageResponse } from "next/og";
import { getDish } from "@/lib/dishes";
import { etb } from "@/lib/format";

// One tailored 1200×630 preview card per dish, written as JSX (Day 44).
// ImageResponse supports only a subset of CSS (flexbox, no grid, no external stylesheet).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Addis Eats dish preview";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: 80, background: "#14532d", color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, color: "#f4c46a" }}>Addis Eats</div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 700, marginTop: 16 }}>{dish ? dish.name : "Addis Eats"}</div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 24, color: "#d9f0e2" }}>
          {dish ? `${dish.category} · ${etb(dish.price)}` : "Ethiopian food delivery in Addis Ababa"}
        </div>
      </div>
    ),
    size,
  );
}
