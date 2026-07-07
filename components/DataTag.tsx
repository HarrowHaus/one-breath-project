// The honesty component (non-negotiable #1): every figure on the site is shown
// with a Measured or Modeled tag and its source. "Measured" reads as a firm
// count; "Modeled" reads as an estimate. The word carries the meaning, not just
// the color (accessibility).

function variantOf(tag: string): "measured" | "modeled" {
  return /^measured/i.test(tag.trim()) ? "measured" : "modeled";
}

export function DataTag({ tag, source }: { tag: string; source?: string }) {
  const variant = variantOf(tag);
  return (
    <span className={`data-tag data-tag--${variant}`}>
      <span className="data-tag__label">{tag}</span>
      {source ? <span className="data-tag__source"> · {source}</span> : null}
    </span>
  );
}

// Renders a sourced figure inline: the value, then its Measured/Modeled tag.
// Pass the shape the internal /api/metrics returns. If there's no value, render
// nothing — the caller's sentence hides rather than showing a placeholder.
export function DataFigure({
  value,
  tag,
  source,
}: {
  value: string | null | undefined;
  tag: string;
  source?: string;
}) {
  if (!value) return null;
  return (
    <span className="data-figure">
      <span className="data-figure__value">{value}</span>{" "}
      <DataTag tag={tag} source={source} />
    </span>
  );
}
