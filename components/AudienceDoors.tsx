import Link from "next/link";

// The three "doors" on the home page — one per audience. A card group where the
// whole card is a link. Accessible: each card is a heading + description inside
// a single anchor, and the grid collapses to one column on small screens.
export type Door = { title: string; description: string; href: string };

export function AudienceDoors({ doors }: { doors: Door[] }) {
  return (
    <ul className="usa-card-group obp-doors">
      {doors.map((door) => (
        <li key={door.href} className="usa-card tablet:grid-col-4">
          <Link className="usa-card__container obp-door" href={door.href}>
            <div className="usa-card__header">
              <h2 className="usa-card__heading">{door.title}</h2>
            </div>
            <div className="usa-card__body">
              <p>{door.description}</p>
            </div>
            <div className="usa-card__footer">
              <span className="obp-door__go" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
