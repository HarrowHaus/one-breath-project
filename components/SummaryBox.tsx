import type { ReactNode } from "react";

// USWDS summary box — for a short "what this page says" or key-takeaways block.
export function SummaryBox({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="usa-summary-box" role="region" aria-label={heading}>
      <div className="usa-summary-box__body">
        <h3 className="usa-summary-box__heading">{heading}</h3>
        <div className="usa-summary-box__text">{children}</div>
      </div>
    </div>
  );
}
