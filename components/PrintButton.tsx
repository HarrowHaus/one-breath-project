"use client";

export function PrintButton({ label = "Print this checklist" }: { label?: string }) {
  return (
    <button
      type="button"
      className="usa-button usa-button--outline obp-print-hide"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
