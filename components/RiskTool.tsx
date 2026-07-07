"use client";

import { useId, useState } from "react";
import Link from "next/link";

// "Is your home at risk?" — five questions, verbatim from content/experiences.md,
// returning a plain-language personal read and ONE action. Nothing is saved or
// sent; all logic runs in the browser. Never a scare without an action.

type Result = "higher" | "protected" | "lower";

const QUESTIONS = [
  {
    key: "fuel",
    label:
      "Does your home burn any fuel — a gas or oil furnace, gas water heater, gas stove, fireplace, or wood stove?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "notsure", label: "Not sure" },
    ],
  },
  {
    key: "garage",
    label: "Is there an attached garage?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "alarm",
    label: "Do you have a carbon monoxide alarm?",
    options: [
      { value: "yes-tested", label: "Yes, and I've tested it recently" },
      { value: "yes-unsure", label: "Yes, but I'm not sure it works" },
      { value: "no", label: "No" },
      { value: "notsure", label: "Not sure" },
    ],
  },
  {
    key: "age",
    label: "If you have alarms, how old are they?",
    options: [
      { value: "under5", label: "Under 5 years" },
      { value: "5plus", label: "5 or more years" },
      { value: "dontknow", label: "I don't know" },
      { value: "none", label: "No alarms" },
    ],
  },
  {
    key: "inspection",
    label:
      "Has a professional checked your furnace or gas appliances in the last year?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "notsure", label: "Not sure" },
      { value: "none", label: "No such appliances" },
    ],
  },
] as const;

function computeResult(a: Record<string, string>): Result {
  const workingCurrentAlarm = a.alarm === "yes-tested" && a.age === "under5";

  // All-electric, no garage, no fuel → lower risk.
  if (a.fuel === "no" && a.garage === "no") return "lower";
  // A source of CO plus a working, current alarm → protected.
  if (workingCurrentAlarm) return "protected";
  // A source of CO (or "not sure") without a working, current alarm — the exact
  // combination behind most poisonings.
  return "higher";
}

// Build an .ics the browser downloads. Recurs every 6 months (twice a year).
function downloadIcs(dateStr: string) {
  const d = dateStr.replaceAll("-", ""); // YYYYMMDD
  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const uid = `${d}-${Math.floor(Number(stamp.slice(9, 15)) || 0)}@one-breath-project`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The One Breath Project//Alarm Test//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d}`,
    "RRULE:FREQ=MONTHLY;INTERVAL=6",
    "SUMMARY:Test the carbon monoxide alarm — The One Breath Project",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "test-your-co-alarm.ics";
  link.click();
  URL.revokeObjectURL(url);
}

function Reminder() {
  const id = useId();
  const [date, setDate] = useState("");
  return (
    <div className="margin-top-2">
      <label className="usa-label" htmlFor={id}>
        Pick a day to test your alarm
      </label>
      <div className="obp-range">
        <input
          className="usa-input"
          id={id}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ maxWidth: "12rem" }}
        />
        <button
          type="button"
          className="usa-button usa-button--outline"
          disabled={!date}
          onClick={() => downloadIcs(date)}
        >
          Add reminder to calendar
        </button>
      </div>
    </div>
  );
}

const RESULTS: Record<
  Result,
  { heading: string; body: string; actions: React.ReactNode; reminder: boolean }
> = {
  higher: {
    heading: "Higher risk — but a small fix closes most of the gap",
    body: "Your home has a way to make carbon monoxide and no reliable way to warn you about it. That's the exact combination behind most poisonings. The fix is small: put a working carbon monoxide alarm near every sleeping area, and get your fuel-burning appliances checked. Do the first part tonight.",
    actions: (
      <Link className="usa-button obp-cta" href="/resources">
        Find an alarm and local help
      </Link>
    ),
    reminder: true,
  },
  protected: {
    heading: "You're protected — keep it that way",
    body: "You've got the two things that matter: a working alarm and appliances someone actually checks. Keep it that way — test the alarm twice a year and replace it on schedule. Here's a reminder so you don't forget.",
    actions: null,
    reminder: true,
  },
  lower: {
    heading: "Lower risk — not zero",
    body: "Your home doesn't burn fuel and has no attached garage, so your risk is low. It isn't zero — a shared wall or a borrowed generator can still bring carbon monoxide in — so a single alarm near the bedrooms is cheap insurance.",
    actions: (
      <Link className="usa-button usa-button--outline" href="/learn">
        Learn where risk can still come from
      </Link>
    ),
    reminder: false,
  },
};

export function RiskTool() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (QUESTIONS.some((q) => !answers[q.key])) {
      setError(true);
      return;
    }
    setError(false);
    setResult(computeResult(answers));
  }

  if (result) {
    const r = RESULTS[result];
    return (
      <div className="usa-prose" role="status">
        <h2>{r.heading}</h2>
        <p>{r.body}</p>
        <p>{r.actions}</p>
        {r.reminder ? <Reminder /> : null}
        <p className="margin-top-3">
          <button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
          >
            Start over
          </button>
        </p>
      </div>
    );
  }

  return (
    <form className="usa-form usa-form--large" onSubmit={submit}>
      {error ? (
        <div className="usa-alert usa-alert--warning" role="alert">
          <div className="usa-alert__body">
            <p className="usa-alert__text">Please answer all five questions.</p>
          </div>
        </div>
      ) : null}
      {QUESTIONS.map((q, i) => (
        <fieldset className="usa-fieldset margin-top-3" key={q.key}>
          <legend className="usa-legend">
            {i + 1}. {q.label}
          </legend>
          {q.options.map((o) => {
            const id = `${q.key}-${o.value}`;
            return (
              <div className="usa-radio" key={o.value}>
                <input
                  className="usa-radio__input"
                  id={id}
                  type="radio"
                  name={q.key}
                  value={o.value}
                  checked={answers[q.key] === o.value}
                  onChange={() => setAnswers((p) => ({ ...p, [q.key]: o.value }))}
                />
                <label className="usa-radio__label" htmlFor={id}>
                  {o.label}
                </label>
              </div>
            );
          })}
        </fieldset>
      ))}
      <button type="submit" className="usa-button usa-button--big obp-cta margin-top-3">
        See my result
      </button>
    </form>
  );
}
