// The EMPTY state: nothing to show yet. It says why, and what to do next (not "No data").
// `children` is the explanation; `actions` are links.
export default function EmptyState({ title, children, actions }) {
  return (
    <section className="max-w-xl rounded-2xl border border-injera bg-white p-6" aria-labelledby="empty-title">
      <h2 id="empty-title" className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{children}</p>
      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}
