"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

// Accessible accordion (self-contained React state, so it works regardless of
// USWDS JS init). Buttons control aria-expanded; panels are labelled by their
// button. Styled with USWDS accordion classes.
export type AccordionItem = { title: string; content: ReactNode };

export function Accordion({
  items,
  allowMultiple = true,
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="usa-accordion usa-accordion--bordered">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h4 className="usa-accordion__heading">
              <button
                type="button"
                className="usa-accordion__button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                id={btnId}
                onClick={() => toggle(i)}
              >
                {item.title}
              </button>
            </h4>
            <div
              id={panelId}
              className="usa-accordion__content usa-prose"
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
