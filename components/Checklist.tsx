import { PrintButton } from "./PrintButton";

// A print-friendly checklist — the reader can tick items on screen or print it
// and check them off by hand. Uncontrolled native checkboxes; print styles in
// globals.css render clean empty boxes. Each item has a real <label>.
export function Checklist({
  title,
  items,
  printLabel,
  event,
}: {
  title?: string;
  items: string[];
  printLabel?: string;
  event?: string;
}) {
  return (
    <div className="obp-checklist">
      {title ? <h3 className="obp-checklist__title">{title}</h3> : null}
      <ul className="usa-list usa-list--unstyled">
        {items.map((item, i) => (
          <li key={i} className="obp-checklist__item">
            <label className="obp-checklist__label">
              <input type="checkbox" className="obp-checklist__box" />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <PrintButton label={printLabel} event={event} />
    </div>
  );
}
