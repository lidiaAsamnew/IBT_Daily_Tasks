import { MAP_HEIGHT_PX } from "@/lib/geo";

// Own skeleton for the tracking page: the same shapes as the real page, the map block at the map's real height.
export default function Loading() {
  return (
    <div className="wrap pt-12" role="status" aria-live="polite">
      <span className="sr-only">Loading your order</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="h-4 w-24 rounded bg-injera/60 motion-safe:animate-pulse" />
        <div className="h-10 w-64 rounded bg-injera/60 motion-safe:animate-pulse" />
        <div className="h-40 max-w-3xl rounded-2xl bg-injera/50 motion-safe:animate-pulse" />
        <div style={{ height: MAP_HEIGHT_PX }} className="rounded-2xl bg-injera/50 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
