/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

// About / Transparency. Copy verbatim from content/about.md; metadata from
// content/metadata.md. Funding, team, and contact are provisional placeholders
// (Phase 9 allows this) — stated honestly, never invented.
export const metadata: Metadata = {
  title: "About The One Breath Project",
  description:
    "An independent nonprofit working to end preventable carbon monoxide poisoning through honest information and advocacy.",
};

export default function AboutPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>About us</h1>
        <p>
          The One Breath Project is an independent nonprofit working to end
          preventable carbon monoxide poisoning through honest information, local
          resources, and advocacy. We are not a government agency and not a
          manufacturer. Carbon monoxide kills a few hundred Americans every year
          and sends far more to the hospital — and almost all of it is
          preventable. We exist to close that gap.
        </p>

        <h2>What we stand on</h2>
        <ul>
          <li>
            <strong>We source everything.</strong> Every figure names where it came
            from and whether it was measured or modeled. When a number is an
            estimate, we say so.
          </li>
          <li>
            <strong>We say "at least."</strong> Carbon monoxide is under-counted, so
            we treat our numbers as floors, not ceilings.
          </li>
          <li>
            <strong>We don't manufacture fear.</strong> No fake urgency, no invented
            statistics, no scare tactics. Just the truth and a clear next step.
          </li>
        </ul>
        <p>
          <Link href="/about/sources">Our sources &amp; methods</Link> explains how
          we tell measured from modeled.
        </p>

        <h2>Independence (the firewall)</h2>
        <p>
          Our safety information is written for the public, not for any company. We
          do not sell carbon monoxide products, and no manufacturer writes or
          approves our editorial content. When we point you toward protection, we
          show you the range of options and disclose any relationship in plain
          language. Education and commerce stay separate here, on purpose.
        </p>

        <h2>How we're funded</h2>
        <p>
          We'll name our funding sources here — grants, donations, and any other
          support — as they're confirmed. Transparency about money is part of the
          standard we hold others to.
        </p>

        <h2>Our team and advisors</h2>
        <p>Our board and advisory members will be listed here as they're formed.</p>

        <h2>Contact</h2>
        <p>A contact address will be added here before launch.</p>
      </div>
    </article>
  );
}
