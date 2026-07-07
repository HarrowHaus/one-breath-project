/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";

// Measured vs Modeled — the honesty standard, explained. Copy verbatim from
// content/data.md ("Methodology page: Measured vs Modeled").
export const metadata: Metadata = {
  title: "Our sources and methods",
  description:
    "How we source every number, what 'measured' and 'modeled' mean, and why we say 'at least.'",
};

export default function MethodologyPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Measured vs Modeled</h1>

        <p>
          <strong>Measured</strong> means the number comes directly from a records
          system — for example, death certificates or hospital and
          emergency-department records reported to the CDC or the Consumer Product
          Safety Commission. We name the system and the year.
        </p>

        <p>
          <strong>Modeled</strong> means the number is an estimate built from a
          sample or a statistical method — for example, a national projection from
          a sample of emergency departments, or our own estimate combining public
          datasets. We label these clearly and explain how they were made.
        </p>

        <p>
          <strong>Why "at least."</strong> Carbon monoxide poisoning is
          under-counted. It's misdiagnosed as the flu, and death-investigation and
          coding practices vary from place to place. So our measured figures are
          floors, not ceilings — the real numbers are almost certainly higher.
          We'd rather say "at least" and be honest than pretend to a precision that
          doesn't exist.
        </p>

        <p>
          <strong>The gap we can't fill.</strong> No public dataset measures the
          carbon monoxide inside any specific home. Nothing measures your furnace.
          That gap is exactly why an alarm in your home — not a statistic — is what
          protects you.
        </p>
      </div>
    </article>
  );
}
