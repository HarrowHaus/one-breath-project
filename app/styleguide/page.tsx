/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { Alert } from "@/components/Alert";
import { AudienceDoors } from "@/components/AudienceDoors";
import { CharacterCountTextarea } from "@/components/CharacterCountTextarea";
import { Checklist } from "@/components/Checklist";
import { DataFigure, DataTag } from "@/components/DataTag";
import { Hero } from "@/components/Hero";
import { ProcessList } from "@/components/ProcessList";
import { RadioGroup, Select, TextInput } from "@/components/forms";
import { RangeSlider } from "@/components/RangeSlider";
import { StepIndicator } from "@/components/StepIndicator";
import { SummaryBox } from "@/components/SummaryBox";

export const metadata: Metadata = {
  title: "Component library",
  robots: { index: false, follow: false },
};

// Internal preview of the Phase 3 component library. Demo text is drawn from the
// canonical copy in /docs/01_VOICE_GUIDE.md — not new user-facing copy.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="usa-section padding-top-2">
      <div className="grid-container">
        <h2 className="obp-sg-heading">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <div className="grid-container padding-top-4">
        <h1>Component library</h1>
        <p className="usa-intro">
          Internal preview of the reusable building blocks. Each is accessible and
          responsive.
        </p>
      </div>

      <Section title="Hero (full-bleed, no stats inside)">
        <Hero
          eyebrow="Silent & Preventable"
          title="They had no reason to be afraid."
          cta={{ label: "Check my home", href: "/risk" }}
        >
          <p>
            Carbon monoxide has no color, no smell, no taste. That is how this gas
            kills: quietly, in your sleep, in a home you trusted.
          </p>
        </Hero>
      </Section>

      <Section title="Audience doors">
        <AudienceDoors
          doors={[
            { title: "Renters", description: "Know your rights and send your landlord a ready-made request.", href: "/renters" },
            { title: "Landlords", description: "Meet the standard of care — the simple, inexpensive way.", href: "/landlords" },
            { title: "Seniors & caregivers", description: "A ten-minute checklist that protects the people you love.", href: "/caregivers" },
          ]}
        />
      </Section>

      <Section title="Measured / Modeled data tags">
        <p>
          <DataFigure value="more than 400" tag="Measured" source="CDC" /> die each
          year from accidental carbon monoxide poisoning.
        </p>
        <p>
          At least <DataFigure value="over 100,000" tag="Modeled" source="CDC" /> more
          are sent to emergency rooms.
        </p>
        <p>
          Standalone tags: <DataTag tag="Measured" source="CDC WONDER" />{" "}
          <DataTag tag="Modeled (national estimate)" source="CPSC NEISS" />
        </p>
      </Section>

      <Section title="Alerts">
        <Alert variant="emergency" heading="If you suspect carbon monoxide right now">
          Get outside into fresh air and call 911. Don't wait to feel sure.
        </Alert>
        <div className="margin-top-2">
          <Alert variant="seasonal" heading="Seasonal reminder">
            Most poisonings happen in the cold months. Test your alarm as the heating
            season begins.
          </Alert>
        </div>
        <div className="margin-top-2">
          <Alert variant="warning" heading="Generators">
            Never run a portable generator inside a home, garage, or basement.
          </Alert>
        </div>
        <div className="margin-top-2">
          <Alert variant="success">Copied. Paste it into an email or text to your landlord.</Alert>
        </div>
      </Section>

      <Section title="Summary box">
        <SummaryBox heading="What this page says">
          <ul className="usa-list">
            <li>You cannot smell carbon monoxide.</li>
            <li>A working alarm is the only thing that notices it.</li>
            <li>Put one near where you sleep.</li>
          </ul>
        </SummaryBox>
      </Section>

      <Section title="Step indicator">
        <StepIndicator
          steps={["Your home", "Your heat", "Your alarms", "Your result"]}
          current={2}
        />
      </Section>

      <Section title="Process list">
        <ProcessList
          steps={[
            { heading: "Get everyone outside", body: <p>Move to fresh air immediately — don't stop to investigate.</p> },
            { heading: "Call 911", body: <p>Tell them you suspect carbon monoxide.</p> },
            { heading: "Don't go back in", body: <p>Wait for responders to say it's safe.</p> },
          ]}
        />
      </Section>

      <Section title="Accordion">
        <Accordion
          items={[
            { title: "Where should I put a carbon monoxide alarm?", content: <p>On every level of the home and near sleeping areas.</p> },
            { title: "How often should I test it?", content: <p>Monthly, and replace the alarm per the manufacturer's date.</p> },
          ]}
        />
      </Section>

      <Section title="Form controls">
        <form className="usa-form usa-form--large">
          <TextInput id="sg-name" name="name" label="Your name" hint="First and last." />
          <Select
            id="sg-heat"
            name="heat"
            label="How is your home heated?"
            options={[
              { value: "gas", label: "Gas furnace" },
              { value: "electric", label: "Electric" },
              { value: "other", label: "Something else" },
            ]}
          />
          <RadioGroup
            legend="Do you have a working carbon monoxide alarm?"
            name="alarm"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unsure", label: "I'm not sure" },
            ]}
          />
          <CharacterCountTextarea
            label="Message to your landlord"
            name="message"
            maxLength={250}
            hint="Keep it short and specific."
          />
          <RangeSlider label="How many alarms are in your home?" name="alarms" min={0} max={10} defaultValue={1} />
        </form>
      </Section>

      <Section title="Print-friendly checklist">
        <Checklist
          title="Ten-minute safety check"
          items={[
            "A working carbon monoxide alarm near where you sleep",
            "An alarm on every level of the home",
            "The furnace checked within the last year",
            "No generator ever run indoors or in the garage",
          ]}
        />
      </Section>

      <div className="grid-container padding-bottom-6" />
    </>
  );
}
