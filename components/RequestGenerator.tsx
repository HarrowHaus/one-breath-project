"use client";

import { useState } from "react";
import { track } from "@/lib/track";

// The renter's request generator: a pre-written message (verbatim from
// content/journeys/renter.md) the reader edits, then copies or opens in their
// email app. Nothing is sent or stored — it just hands them a ready message.

const DEFAULT_SUBJECT = "Carbon monoxide alarm request — [your unit / address]";

const DEFAULT_BODY = `Hi [landlord/manager name],

I'm writing to request working carbon monoxide (CO) alarms for my unit at [address], near the sleeping areas, and to confirm that the furnace and any gas appliances have been inspected recently. Carbon monoxide is odorless and can't be detected without an alarm.

Could you let me know when this can be taken care of? I'm happy to provide access. Thank you for keeping the home safe.

[Your name] · [unit] · [date]`;

export function RequestGenerator() {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    const text = `Subject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable — fall back to a hidden textarea select+copy.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    track("Renter request copied");
    setCopied(true);
  }

  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="obp-request">
      <label className="usa-label" htmlFor="obp-req-subject">
        Subject
      </label>
      <input
        className="usa-input"
        id="obp-req-subject"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          setCopied(false);
        }}
      />

      <label className="usa-label" htmlFor="obp-req-body">
        Message to your landlord
      </label>
      <textarea
        className="usa-textarea"
        id="obp-req-body"
        rows={10}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setCopied(false);
        }}
      />

      <div className="obp-request__actions margin-top-2">
        <button type="button" className="usa-button obp-cta" onClick={copyMessage}>
          Send my landlord the request
        </button>
        <a className="usa-button usa-button--outline" href={mailto}>
          Open in your email app
        </a>
      </div>

      {copied ? (
        <div className="usa-alert usa-alert--success margin-top-2" role="status">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              Copied. Paste it into an email or text to your landlord.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
