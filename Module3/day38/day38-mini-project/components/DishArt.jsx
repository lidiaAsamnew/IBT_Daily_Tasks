// Plate drawn in SVG: an injera base with one mound of stew per colour.
export default function DishArt({ palette, className = "" }) {
  const n = palette.length;
  const spots =
    n === 1
      ? [[100, 100, 46]]
      : palette.map((_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return [100 + Math.cos(a) * 44, 100 + Math.sin(a) * 44, n > 3 ? 21 : 27];
        });

  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="97" fill="#e2cf9f" />
      <circle cx="100" cy="100" r="89" fill="#f2e6c6" stroke="#d6bf8c" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
      {spots.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} fill={palette[i]} />
          <circle cx={(x - r * 0.3).toFixed(1)} cy={(y - r * 0.32).toFixed(1)} r={(r * 0.34).toFixed(1)} fill="#fff" opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}
