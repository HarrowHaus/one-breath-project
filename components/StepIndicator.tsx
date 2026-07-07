// USWDS step indicator — for multi-step flows (e.g. the risk tool). Accessible:
// the current step is announced via aria-current and a visually-hidden label.
export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number; // zero-based index of the current step
}) {
  return (
    <div className="usa-step-indicator" aria-label="progress">
      <ol className="usa-step-indicator__segments">
        {steps.map((label, i) => {
          const state = i < current ? "complete" : i === current ? "current" : "";
          return (
            <li
              key={label}
              className={`usa-step-indicator__segment${
                state ? ` usa-step-indicator__segment--${state}` : ""
              }`}
              aria-current={i === current ? "step" : undefined}
            >
              <span className="usa-step-indicator__segment-label">
                {label}
                {i === current ? <span className="usa-sr-only"> (current step)</span> : null}
                {i < current ? <span className="usa-sr-only"> (completed)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
