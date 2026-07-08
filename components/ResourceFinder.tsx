"use client";

/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import type { LocalResources } from "@/lib/db/queries";

// The local resource finder. Enter a ZIP → the "Your local carbon monoxide
// resources" panel. Labels are verbatim from content/resources.md. Poison
// Control and the 911 instruction are always shown; every other row renders
// only if we have a verified value (never a blank or a guess).

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

function ResourceLine({ r }: { r: LocalResources["fireDepartments"][number] }) {
  return (
    <li className="obp-finder__item">
      <span className="text-bold">{r.name}</span>
      {r.phone ? (
        <>
          {" "}— <a href={telHref(r.phone)}>{r.phone}</a>
        </>
      ) : null}
      {r.notes ? <div className="obp-finder__meta">{r.notes.split(" · ")[0]}</div> : null}
    </li>
  );
}

export function ResourceFinder() {
  const [zip, setZip] = useState("");
  const [data, setData] = useState<LocalResources | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = zip.replace(/\D/g, "").slice(0, 5);
    if (clean.length !== 5) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/resources/local?zip=${clean}`);
      setData((await res.json()) as LocalResources);
    } catch {
      setData({ zip: clean, state: null, fireDepartments: [], gasUtilities: [], installers: [] });
    } finally {
      setLoading(false);
    }
  }

  const fire = data?.fireDepartments ?? [];

  return (
    <div className="obp-finder">
      <form className="usa-form" onSubmit={submit}>
        <label className="usa-label" htmlFor="obp-zip">
          Type your ZIP code
        </label>
        <div className="obp-finder__row">
          <input
            className="usa-input"
            id="obp-zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            style={{ maxWidth: "8rem" }}
          />
          <button type="submit" className="usa-button obp-cta" disabled={zip.replace(/\D/g, "").length !== 5}>
            Find help near me
          </button>
        </div>
      </form>

      {loading ? <p aria-live="polite">Finding your local resources…</p> : null}

      {data && !loading ? (
        <div className="obp-finder__panel" aria-live="polite">
          <h2>Your local carbon monoxide resources</h2>

          {fire.length > 0 ? (
            <div className="obp-finder__group">
              <h3>Your nearest fire department</h3>
              <p className="text-base">Call these for non-emergencies. For emergencies, call 911.</p>
              <ul className="usa-list usa-list--unstyled">
                {fire.map((r) => (
                  <ResourceLine key={r.id} r={r} />
                ))}
              </ul>
            </div>
          ) : (
            <div className="usa-alert usa-alert--info" role="status">
              <div className="usa-alert__body">
                <p className="usa-alert__text">
                  We don't have a fire department listed for that ZIP yet. When we
                  do, it'll appear here. Poison Control and 911 are always below.
                </p>
              </div>
            </div>
          )}

          <div className="obp-finder__group">
            <h3>Poison Control</h3>
            <p className="obp-finder__item">
              24/7: <a href="tel:18002221222">1-800-222-1222</a>
            </p>
          </div>

          {data.gasUtilities.length > 0 ? (
            <div className="obp-finder__group">
              <h3>Gas utility emergency line</h3>
              <ul className="usa-list usa-list--unstyled">
                {data.gasUtilities.map((r) => (
                  <ResourceLine key={r.id} r={r} />
                ))}
              </ul>
            </div>
          ) : null}

          {data.installers.length > 0 ? (
            <div className="obp-finder__group">
              <h3>Get an alarm or inspection</h3>
              <ul className="usa-list usa-list--unstyled">
                {data.installers.map((r) => (
                  <ResourceLine key={r.id} r={r} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
