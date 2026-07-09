/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";
import { PledgeSubmit } from "@/components/PledgeSubmit";
import { pledgeAction } from "./actions";

// Act / advocacy hub. Copy verbatim from content/act.md; metadata from
// content/metadata.md. Ethical forms only: the updates box is unchecked by
// default, and opting out is as easy as opting in.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Act on carbon monoxide safety",
  description:
    "These deaths are preventable, and when people push, the rules change. Here's how to push.",
};

const REP_MESSAGE =
  "I'm a constituent asking you to support requiring working carbon monoxide alarms in rental housing and public accommodations near sleeping areas. Carbon monoxide is odorless and undetectable without an alarm, and these deaths are almost entirely preventable. Please help close this gap.";

const SHARE_1 =
  "Most older adults think they'd smell carbon monoxide. They wouldn't. Share this so someone you love installs an alarm tonight.";
const SHARE_2 =
  "Almost every carbon monoxide death is preventable with a $20 alarm. Pass it on.";

export default async function ActPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="usa-section">
      <div className="grid-container usa-prose">
        <h1>These deaths are preventable, and when people push, the rules change.</h1>
        <p className="obp-hero__lede">
          Two men died in a building with no alarms, and it took a national
          investigation to change one federal rule. That's the hard part and the
          hopeful part at once. Here's how to push.
        </p>

        {/* The pledge — honest opt-in, no pre-ticked boxes. */}
        <h2>The pledge</h2>
        <p className="text-bold">
          I'll protect my own home, and I'll help one other household do the same.
        </p>
        <p>
          Add your name, and we'll send you the two-minute checklist and, if you
          want it, occasional updates you can stop anytime.
        </p>
        {sp.error === "pledge" ? (
          <div className="usa-alert usa-alert--warning" role="alert">
            <div className="usa-alert__body">
              <p className="usa-alert__text">
                Please add your name and a valid email.
              </p>
            </div>
          </div>
        ) : null}
        <form action={pledgeAction} className="usa-form usa-form--large">
          <label className="usa-label" htmlFor="pledge-name">
            Name
          </label>
          <input className="usa-input" id="pledge-name" name="name" required />

          <label className="usa-label" htmlFor="pledge-email">
            Email
          </label>
          <input
            className="usa-input"
            id="pledge-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          <div className="usa-checkbox margin-top-2">
            {/* Unchecked by default — consent to updates is explicit. */}
            <input
              className="usa-checkbox__input"
              id="pledge-updates"
              name="updates"
              type="checkbox"
              value="yes"
            />
            <label className="usa-checkbox__label" htmlFor="pledge-updates">
              Send me occasional updates. I can unsubscribe anytime.
            </label>
          </div>

          <PledgeSubmit />
        </form>

        {/* Contact your representatives */}
        <h2 className="margin-top-4">Contact your representatives</h2>
        <p>
          Most carbon monoxide protections are decided by states and cities — which
          means your voice is close to the decision. Tell your representatives you
          want working carbon monoxide alarms required where people sleep and rent.
        </p>
        <blockquote className="obp-quote">{REP_MESSAGE}</blockquote>
        <p className="obp-request__actions">
          <a
            className="usa-button usa-button--outline"
            href="https://www.usa.gov/elected-officials"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find my representatives
          </a>
          <CopyButton text={REP_MESSAGE} label="Copy this message" />
        </p>

        {/* Share */}
        <h2 className="margin-top-4">Share</h2>
        <p>
          Carbon monoxide kills quietly partly because people don't talk about it.
          Change that.
        </p>
        <ul className="usa-list usa-list--unstyled">
          <li className="margin-bottom-2">
            <p>"{SHARE_1}"</p>
            <CopyButton text={SHARE_1} label="Share" share confirm="Copied to share." />
          </li>
          <li>
            <p>"{SHARE_2}"</p>
            <CopyButton text={SHARE_2} label="Share" share confirm="Copied to share." />
          </li>
        </ul>

        {/* For organizers — advocacy toolkit is {{local:advocacy_toolkit}}; no
            asset exists yet, so the download link is hidden (never a dead link). */}
        <h2 className="margin-top-4">For organizers</h2>
        <p>
          Running a local push — a housing authority, a fire department, a tenants'
          group? The advocacy toolkit — the standard-of-care one-pager, the data
          for your state, and a template letter — is on the way. In the meantime,
          the standard-of-care explainer lives on the{" "}
          <a href="/landlords">landlords page</a>.
        </p>
      </div>
    </div>
  );
}
