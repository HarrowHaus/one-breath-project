"use client";

import { useId, useState } from "react";

// Textarea with a live character count that updates as you type and is announced
// politely to screen readers (aria-live). Turns into a gentle over-limit state
// without blocking input.
export function CharacterCountTextarea({
  label,
  name,
  maxLength = 250,
  hint,
  rows = 4,
  defaultValue = "",
}: {
  label: string;
  name: string;
  maxLength?: number;
  hint?: string;
  rows?: number;
  defaultValue?: string;
}) {
  const id = useId();
  const [count, setCount] = useState(defaultValue.length);
  const remaining = maxLength - count;
  const over = remaining < 0;

  return (
    <div className="usa-form-group">
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <span className="usa-hint" id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
      <textarea
        className="usa-textarea"
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        aria-describedby={`${id}-count${hint ? ` ${id}-hint` : ""}`}
        onChange={(e) => setCount(e.target.value.length)}
      />
      <span
        id={`${id}-count`}
        className={`usa-hint${over ? " text-secondary-dark" : ""}`}
        aria-live="polite"
      >
        {over
          ? `${Math.abs(remaining)} character${Math.abs(remaining) === 1 ? "" : "s"} over the limit`
          : `${remaining} character${remaining === 1 ? "" : "s"} left`}
      </span>
    </div>
  );
}
