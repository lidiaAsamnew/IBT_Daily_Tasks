// Own boundary for the tracking page, so /orders/loading.js (a table skeleton) never shows here.
export default function Loading() {
  return (
    <div className="wrap pt-12" role="status" aria-live="polite">
      <span className="sr-only">Loading your order</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="h-4 w-24 rounded bg-injera/60 motion-safe:animate-pulse" />
        <div className="h-10 w-64 rounded bg-injera/60 motion-safe:animate-pulse" />
        <div className="h-56 max-w-xl rounded-2xl bg-injera/50 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
