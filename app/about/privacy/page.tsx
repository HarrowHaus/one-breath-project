/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";

// Privacy. Plain-language DRAFT verbatim from content/about.md — must be
// reviewed by a lawyer before launch (noted visibly).
export const metadata: Metadata = {
  title: "Privacy",
  description: "How we handle your information — plainly.",
};

export default function PrivacyPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Privacy</h1>
        <div className="usa-alert usa-alert--info" role="note">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              Plain-language draft — to be finalized by a lawyer before launch.
            </p>
          </div>
        </div>
        <p>
          We try to collect as little as possible. We use privacy-respecting
          analytics to understand which pages help people, without building
          profiles of you. If you give us your email for the checklist or updates,
          we use it only for that, and you can unsubscribe anytime. We don't sell
          your information. The risk tool runs in your browser and isn't saved.
        </p>
      </div>
    </article>
  );
}
