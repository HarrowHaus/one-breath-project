# Data hub

## Intro
Here's what carbon monoxide does, in the numbers we can verify — where you live, if we have it. Pick a place, a measure, and a year. Every figure names its source and tells you whether it was measured or modeled.

## Metric definitions (shown on tap)
- **Deaths:** People who died from accidental (non-fire) carbon monoxide poisoning, from death-certificate data.
- **ER visits:** People treated in an emergency department for accidental carbon monoxide poisoning.
- **Hospitalizations:** People admitted to a hospital for accidental carbon monoxide poisoning.

## Auto-written result sentence (template)
Fill only from the API; never guess. If no value, show the "not available" empty state from `global.md`.

> In {{local:place}} in {{data:year}}, at least {{data:selected_metric|local:place|data:year|source|tag}} people {{metric_verb}} for accidental carbon monoxide poisoning. Almost none of it had to happen.

- metric_verb: Deaths → "died"; ER visits → "were treated in an emergency room"; Hospitalizations → "were hospitalized".
- Always render the Measured/Modeled tag and the source next to the sentence.
- Provide a "Download this data (CSV)" button.

## "Almost none of it had to happen" — why we can say that
Carbon monoxide poisoning is considered preventable with detection and maintenance. We use that framing because public-health sources do; we don't overstate it into "100% preventable" as a hard fact.

## Methodology page: Measured vs Modeled

**Measured** means the number comes directly from a records system — for example, death certificates or hospital and emergency-department records reported to the CDC or the Consumer Product Safety Commission. We name the system and the year.

**Modeled** means the number is an estimate built from a sample or a statistical method — for example, a national projection from a sample of emergency departments, or our own estimate combining public datasets. We label these clearly and explain how they were made.

**Why "at least."** Carbon monoxide poisoning is under-counted. It's misdiagnosed as the flu, and death-investigation and coding practices vary from place to place. So our measured figures are floors, not ceilings — the real numbers are almost certainly higher. We'd rather say "at least" and be honest than pretend to a precision that doesn't exist.

**The gap we can't fill.** No public dataset measures the carbon monoxide inside any specific home. Nothing measures your furnace. That gap is exactly why an alarm in your home — not a statistic — is what protects you.
