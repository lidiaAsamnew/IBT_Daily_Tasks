// One error shape for every endpoint:
//   { "error": "Validation failed", "fieldErrors": { "phone": ["Use 09… or +2519…"] } }
// `fieldErrors` is present only on 422. The status code carries the meaning.
export function errorResponse(message, status, fieldErrors) {
  const body = fieldErrors ? { error: message, fieldErrors } : { error: message };
  return Response.json(body, { status });
}
