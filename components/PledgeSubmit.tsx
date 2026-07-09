"use client";

import { track } from "@/lib/track";

// Submit button for the pledge form (a server action handles the actual write).
// Fires the "Pledge added" goal on click; native required/email validation
// blocks empty or malformed submits before this counts.
export function PledgeSubmit() {
  return (
    <button
      type="submit"
      className="usa-button obp-cta margin-top-3"
      onClick={() => track("Pledge added")}
    >
      Add my name
    </button>
  );
}
