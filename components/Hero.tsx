import Link from "next/link";
import type { ReactNode } from "react";

// Full-bleed hero. Deliberately holds NO statistics — the lede leads with a
// person and a sentence, and stats live in their own sourced components below
// the fold (design spec + behavioral architecture).
export function Hero({
  eyebrow,
  title,
  children,
  cta,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="obp-hero">
      <div className="grid-container">
        <div className="tablet:grid-col-9">
          {eyebrow ? <p className="obp-hero__eyebrow">{eyebrow}</p> : null}
          <h1 className="obp-hero__title">{title}</h1>
          {children ? <div className="obp-hero__lede">{children}</div> : null}
          {cta ? (
            <Link className="usa-button usa-button--big obp-hero__cta" href={cta.href}>
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
