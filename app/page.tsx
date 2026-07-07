// Phase 0 placeholder home page. This is scaffolding, not the real landing page:
// the verbatim editorial copy in content/home.md gets wired up in Phase 4.
// It intentionally shows only the site's own identity strings plus a build-status
// note, so no un-sourced user-facing copy is introduced.
export default function HomePage() {
  return (
    <section className="usa-section">
      <div className="grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-8">
            <h1>The One Breath Project</h1>
            <p className="usa-intro">Silent &amp; Preventable</p>
            <p className="build-status" role="status">
              This site is being built. Phase 0 — setup and deploy is live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
