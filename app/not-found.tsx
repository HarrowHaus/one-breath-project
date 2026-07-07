/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

// 404 page — copy verbatim from content/system-pages.md.
export default function NotFound() {
  return (
    <section className="usa-section">
      <div className="grid-container">
        <div className="usa-prose">
          <h1>That page isn't here.</h1>
          <p>
            The page you're looking for may have moved. Here's the way back — and
            if you came for something urgent: if you suspect carbon monoxide right
            now, get outside and call 911.
          </p>
          <ul className="usa-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/risk">Check my home</Link>
            </li>
            <li>
              <Link href="/resources">Find help near me</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
