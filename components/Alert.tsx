import type { ReactNode } from "react";

// USWDS alert with the variants this site uses. "emergency" is the ember 911
// line; "seasonal" is an info-tinted timeliness strip. Uses role="alert" only
// for urgent variants so screen readers aren't interrupted by calm notices.
type Variant = "info" | "warning" | "emergency" | "success" | "seasonal";

const USWDS_CLASS: Record<Variant, string> = {
  info: "usa-alert--info",
  warning: "usa-alert--warning",
  emergency: "usa-alert--error",
  success: "usa-alert--success",
  seasonal: "usa-alert--info",
};

export function Alert({
  variant = "info",
  heading,
  children,
}: {
  variant?: Variant;
  heading?: string;
  children: ReactNode;
}) {
  const urgent = variant === "emergency" || variant === "warning";
  return (
    <div
      className={`usa-alert ${USWDS_CLASS[variant]}${
        variant === "seasonal" ? " obp-alert--seasonal" : ""
      }`}
      role={urgent ? "alert" : undefined}
    >
      <div className="usa-alert__body">
        {heading ? <h3 className="usa-alert__heading">{heading}</h3> : null}
        <p className="usa-alert__text">{children}</p>
      </div>
    </div>
  );
}
