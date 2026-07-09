/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carbon monoxide symptoms — and the one clue",
  description:
    "Early poisoning feels like the flu. The one clue that tells them apart could save your life.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Symptoms — and the one clue</h1>
        <p>
          Early carbon monoxide poisoning feels like the flu: headache, dizziness,
          nausea, weakness, shortness of breath, and confusion. That's why it's so
          often missed — by the people breathing it, and sometimes by the doctors
          who see them.
        </p>
        <p>
          As levels rise, thinking gets foggy, coordination fails, and people lose
          consciousness. Someone asleep, or who has been drinking, can be overcome
          before any symptom wakes them. That's how carbon monoxide kills quietly.
        </p>
        <p>
          <strong>The one clue that separates it from the flu:</strong> you feel
          better when you leave the house, and worse when you come back. A real
          illness travels with you. Carbon monoxide stays in the building. If
          everyone in the home — including pets — feels sick at the same time, and
          improves in fresh air, treat that as a carbon monoxide warning.
        </p>
        <p>
          <strong>What to do right now if you suspect it:</strong> get everyone
          outside into fresh air immediately, then call <a href="tel:911">911</a> or
          Poison Control at <a href="tel:18002221222">1-800-222-1222</a>. Don't go
          back in to investigate. Don't wait to feel sure.
        </p>
        <p>
          Because the symptoms are so ordinary, an alarm matters even more — it
          catches the gas before your body has to.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn/what-co-does-to-the-body">
            → Next: What carbon monoxide does to your body
          </Link>
        </p>
      </div>
    </article>
  );
}
