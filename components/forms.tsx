import { cloneElement, isValidElement } from "react";
import type { ReactNode } from "react";

// USWDS form controls with proper label association and hint/error support.
// These are uncontrolled server components — wire values/handlers at the call
// site as needed. Every field has a real <label htmlFor>; hints and errors are
// linked via aria-describedby.

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  return (
    <div className={`usa-form-group${error ? " usa-form-group--error" : ""}`}>
      <label className="usa-label" htmlFor={id}>
        {label}
        {required ? <abbr title="required" className="usa-hint usa-hint--required"> *</abbr> : null}
      </label>
      {hint ? (
        <span className="usa-hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="usa-error-message" id={errId} role="alert">
          {error}
        </span>
      ) : null}
      {/* describedby is applied by each control below */}
      <ControlDescribedBy hintId={hintId} errId={errId}>
        {children}
      </ControlDescribedBy>
    </div>
  );
}

// Threads aria-describedby onto the single child control.
function ControlDescribedBy({
  hintId,
  errId,
  children,
}: {
  hintId?: string;
  errId?: string;
  children: ReactNode;
}) {
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  // The caller passes a single control element; clone it with aria-describedby.
  if (describedBy && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement<{ "aria-describedby"?: string }>,
      { "aria-describedby": describedBy },
    );
  }
  return <>{children}</>;
}

export function TextInput({
  id,
  label,
  name,
  type = "text",
  hint,
  error,
  required,
  defaultValue,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        className={`usa-input${error ? " usa-input--error" : ""}`}
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
      />
    </FieldShell>
  );
}

export function Select({
  id,
  label,
  name,
  options,
  hint,
  error,
  required,
}: {
  id: string;
  label: string;
  name: string;
  options: { value: string; label: string }[];
  hint?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select className="usa-select" id={id} name={name} required={required} defaultValue="">
        <option value="" disabled>
          — Select —
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function RadioGroup({
  legend,
  name,
  options,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset className="usa-fieldset">
      <legend className="usa-legend">{legend}</legend>
      {options.map((o) => {
        const id = `${name}-${o.value}`;
        return (
          <div className="usa-radio" key={o.value}>
            <input className="usa-radio__input" id={id} type="radio" name={name} value={o.value} />
            <label className="usa-radio__label" htmlFor={id}>
              {o.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}
