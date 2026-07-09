/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What carbon monoxide does to your body",
  description:
    "It starves your organs of oxygen. What that means, why it harms the brain and heart, and why survivors can have lasting effects.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>What carbon monoxide does to your body</h1>
        <p>
          Your blood carries oxygen using a protein called hemoglobin. Carbon
          monoxide binds to that same protein far more tightly than oxygen does — so
          when you breathe it in, it takes oxygen's place. Your blood keeps
          circulating, but it's carrying poison instead of the oxygen your organs
          need.
        </p>
        <p>
          The organs that need the most oxygen suffer first: the brain and the
          heart. That's why the early signs are headache, dizziness, and confusion,
          and why higher exposures can cause fainting, seizures, heart damage, and
          death.
        </p>
        <p>
          <strong>Why survivors aren't always in the clear.</strong> Serious carbon
          monoxide poisoning can leave lasting effects — memory and concentration
          problems, mood changes, and a raised risk of heart problems. Some effects
          show up days or weeks later. This is part of why "they survived" doesn't
          mean "no harm done," and why prevention matters as much as rescue.
        </p>
        <p>
          <strong>Who's most vulnerable.</strong> Unborn babies, infants, older
          adults, and people with heart or lung conditions are hit hardest, because
          their bodies have the least margin to lose. So are people who are asleep
          or impaired, who may never feel the early warnings.
        </p>
        <p>
          The treatment for poisoning is oxygen, delivered fast — which is why
          getting out and calling 911 immediately matters so much. But the surest
          protection is never breathing it in: an alarm that warns you, and
          appliances that don't leak in the first place.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn/generators-and-storms">
            → Next: Generator safety after a storm
          </Link>
        </p>
      </div>
    </article>
  );
}
