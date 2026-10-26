// Page-level guards (Day 42, layer two): the right screen for this person.
// Layer one is middleware (a cheap redirect); layer three, the real check, lives in the service functions.
import { notFound, redirect } from "next/navigation";
import { getSession, getStaffSession } from "./session.js";

export async function requireUser(nextPath) {
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(nextPath)}`);
  return session;
}

/** Staff only. Signed-out visitors are sent to sign in; signed-in non-staff get a 404 (the page "does not exist" for them). */
export async function requireStaff(nextPath) {
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(nextPath)}`);
  const staff = await getStaffSession();
  if (!staff) notFound();
  return staff;
}
