"use client";

import { track } from "@/lib/track";

export function PrintButton({
  label = "Print this checklist",
  event,
}: {
  label?: string;
  // Optional analytics goal fired on click (e.g. a landlord toolkit download).
  event?: string;
}) {
  return (
    <button
      type="button"
      className="usa-button usa-button--outline obp-print-hide"
      onClick={() => {
        if (event) track(event);
        window.print();
      }}
    >
      {label}
    </button>
  );
}
