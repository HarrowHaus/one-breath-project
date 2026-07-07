import type { ReactNode } from "react";

// USWDS process list — ordered "do this, then this" steps (e.g. "if your alarm
// goes off"). Rendered as a semantic ordered list.
export type ProcessStep = { heading: string; body: ReactNode };

export function ProcessList({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="usa-process-list">
      {steps.map((step, i) => (
        <li key={i} className="usa-process-list__item">
          <h4 className="usa-process-list__heading">{step.heading}</h4>
          <div className="margin-top-05">{step.body}</div>
        </li>
      ))}
    </ol>
  );
}
