// Renders one JSON-LD block. "<" is escaped so a dish description containing "</script>" could never
// close the tag early (the standard guard when putting JSON inside a script element).
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
