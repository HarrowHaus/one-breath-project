"use client";

import { useId, useState } from "react";

// Accessible range slider with a live value read-out. The <output> is tied to
// the input; the value is also reflected in aria-valuetext for screen readers.
export function RangeSlider({
  label,
  name,
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  format = (v: number) => String(v),
}: {
  label: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  format?: (v: number) => string;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue ?? Math.round((min + max) / 2));

  return (
    <div className="usa-form-group">
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
      <div className="obp-range">
        <input
          type="range"
          className="usa-range"
          id={id}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <output htmlFor={id} className="obp-range__value">
          {format(value)}
        </output>
      </div>
    </div>
  );
}
