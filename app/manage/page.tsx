/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { adminConfigured, isAuthed } from "@/lib/auth";
import { listMetrics, listStaleResources } from "@/lib/db/queries";
import {
  loginAction,
  logoutAction,
  runConnectorAction,
  saveMetricAction,
  saveResourceAction,
  seedNationalAction,
  verifyResourceAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Manage data",
  robots: { index: false, follow: false },
};

const INDICATORS = ["co_deaths", "co_er_visits", "co_hospitalizations"];
const TAGS = ["Measured", "Modeled", "Modeled (national estimate)"];
const RESOURCE_TYPES = [
  "fire_department",
  "poison_control",
  "gas_utility",
  "installer",
  "program",
];

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; ran?: string }>;
}) {
  const sp = await searchParams;

  if (!adminConfigured()) {
    return (
      <section className="usa-section">
        <div className="grid-container usa-prose">
          <h1>Manage data</h1>
          <p>
            The admin is not configured. Set the <code>ADMIN_PASSWORD</code>{" "}
            environment variable (locally in <code>.env</code>, and in the
            Cloudflare dashboard for production) to enable this screen.
          </p>
        </div>
      </section>
    );
  }

  const authed = await isAuthed();

  if (!authed) {
    return (
      <section className="usa-section">
        <div className="grid-container usa-prose">
          <h1>Manage data</h1>
          {sp.error && (
            <div className="usa-alert usa-alert--error" role="alert">
              <div className="usa-alert__body">
                <p className="usa-alert__text">That password wasn't right.</p>
              </div>
            </div>
          )}
          <form action={loginAction} className="usa-form">
            <label className="usa-label" htmlFor="password">
              Admin password
            </label>
            <input
              className="usa-input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <button className="usa-button" type="submit">
              Sign in
            </button>
          </form>
        </div>
      </section>
    );
  }

  const [metrics, stale] = await Promise.all([listMetrics(), listStaleResources()]);

  return (
    <section className="usa-section">
      <div className="grid-container usa-prose">
        <div className="display-flex flex-justify flex-align-center">
          <h1 className="margin-0">Manage data</h1>
          <form action={logoutAction}>
            <button className="usa-button usa-button--outline" type="submit">
              Sign out
            </button>
          </form>
        </div>

        {sp.saved && (
          <div className="usa-alert usa-alert--success" role="status">
            <div className="usa-alert__body">
              <p className="usa-alert__text">Saved.</p>
            </div>
          </div>
        )}
        {sp.ran && (
          <div className="usa-alert usa-alert--info" role="status">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{sp.ran}</p>
            </div>
          </div>
        )}
        {sp.error === "metric" && (
          <div className="usa-alert usa-alert--error" role="alert">
            <div className="usa-alert__body">
              <p className="usa-alert__text">
                A metric needs an indicator, value, source, and Measured/Modeled tag.
              </p>
            </div>
          </div>
        )}

        {/* ---- Current metrics ---- */}
        <h2>Current figures</h2>
        {metrics.length === 0 ? (
          <p>No figures yet. Add one below.</p>
        ) : (
          <table className="usa-table usa-table--striped width-full">
            <thead>
              <tr>
                <th scope="col">Indicator</th>
                <th scope="col">Geo</th>
                <th scope="col">Value</th>
                <th scope="col">Tag</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.id}>
                  <td>{m.indicator}</td>
                  <td>{m.geo}</td>
                  <td>{m.value}</td>
                  <td>{m.tag}</td>
                  <td>{m.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ---- Data connectors ---- */}
        <h2>Data connectors</h2>
        <p className="text-base">
          Pull the latest figures from their live source. Every row is tagged
          Measured/Modeled with its source. Safe to re-run — it refreshes rather
          than duplicates. A run can take up to a minute.
        </p>
        <form action={runConnectorAction} className="usa-form">
          <input type="hidden" name="connector" value="cdc-tracking" />
          <button className="usa-button" type="submit">
            Run CDC Tracking (deaths, ER visits, hospitalizations by state &amp; year)
          </button>
        </form>

        <p className="text-base margin-top-3">
          Load the national headline figures (the harm pyramid and landing scale
          band) from the published Sircar 2019 estimate, with their exact
          Measured/Modeled tags and periods. Idempotent — safe to re-run.
        </p>
        <form action={seedNationalAction} className="usa-form">
          <button className="usa-button usa-button--outline" type="submit">
            Load national figures (Sircar 2019)
          </button>
        </form>

        <p className="text-base margin-top-3">
          Backfill fire-department coordinates (from their address, via the free
          U.S. Census geocoder) so the resources finder can show a map and true
          nearest-by-distance results. Batched — click again until it says done.
        </p>
        <form action={runConnectorAction} className="usa-form">
          <input type="hidden" name="connector" value="geocode" />
          <button className="usa-button usa-button--outline" type="submit">
            Geocode fire departments (next batch)
          </button>
        </form>

        {/* ---- Add / update a figure ---- */}
        <h2>Add or update a figure</h2>
        <p className="text-base">
          Saving updates the "latest" figure for that indicator and geography.
          Every figure must carry a source and a Measured/Modeled tag.
        </p>
        <form action={saveMetricAction} className="usa-form">
          <label className="usa-label" htmlFor="indicator">
            Indicator
          </label>
          <select className="usa-select" id="indicator" name="indicator" required>
            {INDICATORS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>

          <label className="usa-label" htmlFor="geo">
            Geography (US, or a state name/FIPS)
          </label>
          <input className="usa-input" id="geo" name="geo" defaultValue="US" />

          <label className="usa-label" htmlFor="valueDisplay">
            Display value (reads in a sentence, e.g. "more than 400")
          </label>
          <input className="usa-input" id="valueDisplay" name="valueDisplay" required />

          <label className="usa-label" htmlFor="valueNumeric">
            Numeric value (optional, e.g. 400)
          </label>
          <input className="usa-input" id="valueNumeric" name="valueNumeric" inputMode="numeric" />

          <label className="usa-label" htmlFor="measuredOrModeled">
            Measured or Modeled
          </label>
          <select
            className="usa-select"
            id="measuredOrModeled"
            name="measuredOrModeled"
            required
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label className="usa-label" htmlFor="source">
            Source (e.g. CDC)
          </label>
          <input className="usa-input" id="source" name="source" required />

          <label className="usa-label" htmlFor="notes">
            Notes (provenance, caveats)
          </label>
          <textarea className="usa-textarea" id="notes" name="notes" />

          <button className="usa-button" type="submit">
            Save figure
          </button>
        </form>

        {/* ---- Add a resource ---- */}
        <h2>Add a resource</h2>
        <form action={saveResourceAction} className="usa-form">
          <label className="usa-label" htmlFor="type">
            Type
          </label>
          <select className="usa-select" id="type" name="type" required>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label className="usa-label" htmlFor="name">
            Name
          </label>
          <input className="usa-input" id="name" name="name" required />

          <label className="usa-label" htmlFor="res-geo">
            Geography (state name/FIPS, optional)
          </label>
          <input className="usa-input" id="res-geo" name="geo" />

          <label className="usa-label" htmlFor="phone">
            Phone
          </label>
          <input className="usa-input" id="phone" name="phone" />

          <label className="usa-label" htmlFor="url">
            URL
          </label>
          <input className="usa-input" id="url" name="url" type="url" />

          <label className="usa-label" htmlFor="source-r">
            Source
          </label>
          <input className="usa-input" id="source-r" name="source" required />

          <label className="usa-label" htmlFor="res-notes">
            Notes
          </label>
          <textarea className="usa-textarea" id="res-notes" name="notes" />

          <button className="usa-button" type="submit">
            Add resource
          </button>
        </form>

        {/* ---- Stale resources ---- */}
        <h2>Resources needing re-verification</h2>
        <p className="text-base">
          Resources not verified in the last six months (or never verified).
          Re-check the contact against its source, then mark it verified.
        </p>
        {stale.length === 0 ? (
          <p>Nothing needs re-verification right now.</p>
        ) : (
          <table className="usa-table usa-table--striped width-full">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Last verified</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {stale.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.verifiedAt ? r.verifiedAt.slice(0, 10) : "never"}</td>
                  <td>
                    <form action={verifyResourceAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="usa-button usa-button--outline" type="submit">
                        Mark verified
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
