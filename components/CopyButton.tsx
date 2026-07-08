"use client";

import { useState } from "react";

// Small client button that copies text to the clipboard (or, in share mode,
// opens the device share sheet with a clipboard fallback), then shows a brief
// confirmation. Used for the "copy this message" and share actions.
export function CopyButton({
  text,
  label,
  share = false,
  variant = "outline",
  confirm = "Copied.",
}: {
  text: string;
  label: string;
  share?: boolean;
  variant?: "primary" | "outline";
  confirm?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setDone(true);
  }

  async function onClick() {
    if (share && typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // Cancelled or unsupported — fall back to copy.
      }
    }
    await copy();
  }

  return (
    <span className="obp-copy">
      <button
        type="button"
        className={`usa-button ${variant === "outline" ? "usa-button--outline" : "obp-cta"}`}
        onClick={onClick}
      >
        {label}
      </button>
      {done ? (
        <span className="obp-copy__done" role="status">
          {confirm}
        </span>
      ) : null}
    </span>
  );
}
