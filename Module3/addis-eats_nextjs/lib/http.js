// Route-handler helpers. One error shape everywhere (Day 39):
//   { "error": "message", "fieldErrors": { "field": ["message"] } }   — never a 200 with an error inside.
const noStore = { "Cache-Control": "no-store" };

export const json = (data, status = 200, headers = {}) => Response.json(data, { status, headers: { ...noStore, ...headers } });

export const fail = (status, error, extra = {}) => json({ error, ...extra }, status);

/** Turn a service result ({ ok:false, status, error, fieldErrors? }) into a response. */
export const failFrom = (result) => fail(result.status, result.error, result.fieldErrors ? { fieldErrors: result.fieldErrors } : {});

/** Unknown failures are logged on the server; the caller gets a message, never a stack trace or SQL. */
export function serverError(error) {
  console.error(error);
  return fail(500, "Something went wrong on our side. Please try again.");
}
