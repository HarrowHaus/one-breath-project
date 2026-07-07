/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

// The full Witherspoon / Allen Benedict story. Lede is verbatim from the voice
// guide; the systemic turn uses the attributed facts in /docs/03_HERO_DOSSIER.md
// (NBC News, CBS News). Every threat is followed by an action within sight.
export const metadata: Metadata = {
  title: "The night carbon monoxide killed two neighbors",
  description:
    "Calvin Witherspoon Jr. and Derrick Roper died in public housing with no alarms. Their deaths changed federal law. Here's what happened.",
};

export default function StoryPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Calvin Witherspoon Jr. went to sleep in his apartment and never woke up.</h1>

        <p>
          So did his neighbor, Derrick Roper. It was January 2019, in public housing
          in Columbia, South Carolina. Investigators found not one carbon monoxide
          alarm in the entire complex. Weeks later, Witherspoon's daughter still
          caught herself dialing her father's number in the mornings, only to reach
          his voicemail.
        </p>
        <p>
          Carbon monoxide has no color, no smell, no taste. The people who died that
          night had no reason to be afraid — there was nothing to smell, and nothing
          to warn them. That is how this gas kills: quietly, in your sleep, in a home
          you trusted. And almost every death like it could have been stopped by a
          $20 alarm and an inspection that never happened.
        </p>

        <h2>Nobody had told them the danger was there</h2>
        <p>
          About 400 residents of Allen Benedict Court were evacuated. One resident,
          Sharon Johnson, told reporters she'd been warned about lead, mold, and
          mildew — but never carbon monoxide. "I knew it was a gas," she said, "but I
          didn't know it was a gas that could kill us."
        </p>

        <h2>Two men died, and the rules changed</h2>
        <p>
          Public housing was not required to have carbon monoxide alarms under
          federal law. The U.S. Department of Housing and Urban Development required
          smoke detectors in subsidized housing, but not carbon monoxide alarms.
          After an NBC News investigation exposed the gap, HUD moved to write the
          first federal rule requiring carbon monoxide detectors in public housing,
          and later set a deadline to install them in about 3 million units
          nationwide.
        </p>
        <p>
          It should not take two deaths to put a $20 alarm on a wall. But when people
          pushed, the rules changed — and that is the part you can carry into your
          own home tonight.
        </p>

        <h2>You can shut this one out</h2>
        <p>
          This is one of the few dangers you can shut out of your home completely. A
          working alarm. A furnace someone actually checks. Ten minutes and a plan.
          That's the whole price of never becoming one of these stories.
        </p>
        <p className="margin-top-3">
          <Link className="usa-button usa-button--big obp-cta" href="/risk">
            Check my home
          </Link>{" "}
          <Link className="usa-button usa-button--outline usa-button--big" href="/resources">
            Find help near me
          </Link>
        </p>

        <h3 className="margin-top-4">Sources</h3>
        <p className="text-base">
          Reported by NBC News, "Carbon monoxide is killing public housing residents,
          but HUD doesn't require detectors" (Suzy Khimm, 2019); CBS News, "Carbon
          monoxide detectors save lives. Why aren't they required everywhere?" (2022).
        </p>
      </div>
    </article>
  );
}
