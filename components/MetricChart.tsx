// One clean chart — a bar per available year (or a single bar for the latest
// snapshot). Deliberately minimal: no walls of numbers, one metric at a time.
// Dependency-free inline SVG so it runs on the Workers runtime; an adjacent
// visually-hidden table carries the same data for screen readers.

export type ChartPoint = { label: string; value: number };

export function MetricChart({
  points,
  caption,
  unitLabel,
}: {
  points: ChartPoint[];
  caption: string;
  unitLabel: string;
}) {
  if (points.length === 0) return null;

  const max = Math.max(...points.map((p) => p.value), 1);
  const nf = new Intl.NumberFormat("en-US");

  // Geometry (viewBox units; scales responsively via width:100%).
  const W = 720;
  const H = 300;
  const padX = 48;
  const padTop = 32;
  const padBottom = 48;
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;
  const n = points.length;
  const slot = plotW / n;
  const barW = Math.min(slot * 0.6, 120);

  return (
    <figure className="obp-chart" role="group" aria-label={caption}>
      <svg
        className="obp-chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${caption}. ${points
          .map((p) => `${p.label}: at least ${nf.format(p.value)} ${unitLabel}`)
          .join("; ")}.`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Baseline */}
        <line
          x1={padX}
          y1={padTop + plotH}
          x2={W - padX}
          y2={padTop + plotH}
          className="obp-chart__axis"
        />
        {points.map((p, i) => {
          const h = (p.value / max) * plotH;
          const x = padX + slot * i + (slot - barW) / 2;
          const y = padTop + plotH - h;
          return (
            <g key={`${p.label}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={2}
                className="obp-chart__bar"
              />
              <text
                x={x + barW / 2}
                y={y - 8}
                textAnchor="middle"
                className="obp-chart__value"
              >
                {nf.format(p.value)}
              </text>
              <text
                x={x + barW / 2}
                y={padTop + plotH + 24}
                textAnchor="middle"
                className="obp-chart__label"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Same data, for assistive tech and copy-paste. */}
      <table className="usa-sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">{unitLabel}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={`${p.label}-row-${i}`}>
              <th scope="row">{p.label}</th>
              <td>at least {nf.format(p.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
