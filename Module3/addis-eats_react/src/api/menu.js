export async function getMenu(signal) {
  const res = await fetch("/menu.json", { signal });
  if (!res.ok) throw new Error(`Menu request failed (${res.status})`);
  return res.json();
}