const careerSignal = {
  title: "Career Signal",
  technologies: ["Python", "Java", "React / TypeScript", "Semantic search"],
};

export default function CurrentlyBuilding() {
  return (
    <section className="building-section container" aria-labelledby="building-title">
      <div className="building-heading">
        <p className="eyebrow">Up next / Career Signal</p>
        <span className="wip-badge">UNDER CONSTRUCTION · PLANNING</span>
      </div>
      <div className="building-grid">
        <div>
          <h2 id="building-title">Currently building<span>_</span></h2>
          <h3>{careerSignal.title}</h3>
          <p>An AI job search assistant to help people find roles that fit their experience and priorities. I’m planning a workflow that filters out unsuitable roles, ranks relevant matches, and explains why each one might be worth a closer look.</p>
          <p><strong>Planned technologies</strong></p>
          <div className="tags">{careerSignal.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
          <p>Python for ingestion and matching, Java for the application API, and React for reviewing opportunities. The architecture is still being worked out.</p>
        </div>
        <aside className="build-notes" aria-label="Career Signal planned workflow">
          <span className="build-notes-label">PROPOSED WORKFLOW</span>
          <h4>From preferences<br />to a useful shortlist.</h4>
          <ul>
            <li>Build a profile from a CV, experience, and job preferences.</li>
            <li>Gather job listings and apply constraints such as location and experience level.</li>
            <li>Rank matches using semantic search and explain the fit.</li>
            <li>Review shortlisted roles and decide which to pursue.</li>
          </ul>
          <p>Planned personal project · Features and stack may change</p>
        </aside>
      </div>
    </section>
  );
}
