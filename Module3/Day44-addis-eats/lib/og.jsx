// Shared layout for every generated preview card (1200 x 630). ImageResponse understands only a
// subset of CSS: flexbox, absolute positioning, borders and radii. No grid, no external stylesheet,
// and every <div> that has more than one child needs display:"flex" - so each one below says so.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

function Plate({ palette, size }) {
  const n = palette.length;
  const spots =
    n === 1
      ? [[0.5, 0.5, 0.23]]
      : palette.map((_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return [0.5 + Math.cos(a) * 0.22, 0.5 + Math.sin(a) * 0.22, n > 3 ? 0.105 : 0.135];
        });
  return (
    <div style={{ display: "flex", position: "relative", width: size, height: size, borderRadius: "50%", background: "#e2cf9f" }}>
      <div style={{ display: "flex", position: "absolute", left: Math.round(size * 0.055), top: Math.round(size * 0.055), width: Math.round(size * 0.89), height: Math.round(size * 0.89), borderRadius: "50%", background: "#f2e6c6" }} />
      {spots.map(([x, y, r], i) => (
        <div
          key={i}
          style={{ display: "flex", position: "absolute", left: Math.round((x - r) * size), top: Math.round((y - r) * size), width: Math.round(2 * r * size), height: Math.round(2 * r * size), borderRadius: "50%", background: palette[i] }}
        />
      ))}
    </div>
  );
}

export function OgCard({ eyebrow, title, subtitle, badge, palette }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#1d5c3f", color: "#fbf6ea", padding: "64px 72px", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#e3a72f", letterSpacing: 3 }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: title.length > 18 ? 72 : 104, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 34, color: "#eadcb8", marginTop: 24, lineHeight: 1.3 }}>{subtitle}</div>
        {badge ? (
          <div style={{ display: "flex", alignSelf: "flex-start", marginTop: 36, padding: "10px 28px", borderRadius: 9999, background: "#e3a72f", color: "#123d2a", fontSize: 44, fontWeight: 700 }}>{badge}</div>
        ) : null}
      </div>
      <Plate palette={palette} size={400} />
    </div>
  );
}
