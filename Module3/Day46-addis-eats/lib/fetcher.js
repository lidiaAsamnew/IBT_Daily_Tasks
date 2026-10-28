// The ONE fetcher used by every SWR query. fetch() only rejects on network failure,
// so a 404 or 500 would look like success. This throws for any non-OK response,
// which is what makes SWR's `error` (and its retry logic) work.
export class FetchError extends Error {
  constructor(message, status, info) {
    super(message);
    this.name = "FetchError";
    this.status = status; // lets callers tell 404 from 500
    this.info = info;     // the parsed error body: { error, fieldErrors? }
  }
}

export async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    let info = null;
    try { info = await res.json(); } catch { /* body was not JSON */ }
    throw new FetchError(info?.error ?? `Request failed (${res.status})`, res.status, info);
  }
  return res.json();
}
