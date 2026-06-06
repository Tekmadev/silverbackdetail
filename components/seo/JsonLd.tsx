/**
 * Renders a JSON-LD structured data block. Server component (no client JS).
 * Pass any schema.org object; it is serialized safely into a script tag.
 */
export function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Schema is build-time/server data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
