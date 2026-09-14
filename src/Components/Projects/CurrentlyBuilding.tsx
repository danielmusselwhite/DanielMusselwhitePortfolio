const incidentIQ = {
  title: "IncidentIQ",
  repository: "https://github.com/danielmusselwhite/IncidentIQ",
  technologies: [".NET", "React", "Azure", "Cosmos DB", "RAG", "Service Bus"],
};

export default function CurrentlyBuilding() {
  return (
    <section className="building-section container" aria-labelledby="building-title">
      <div className="building-heading">
        <p className="eyebrow">Featured build / Applied AI</p>
        <span className="wip-badge">WIP · IN DEVELOPMENT</span>
      </div>
      <div className="building-grid">
        <div>
          <h2 id="building-title">Currently building<span>_</span></h2>
          <h3>{incidentIQ.title}</h3>
          <p>An AI-powered incident analysis tool. I’m building it to help engineers investigate failures using relevant past incidents and operational runbooks, with evidence behind the suggested causes and next steps.</p>
          <div className="tags">{incidentIQ.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
          <a className="button button-primary" href={incidentIQ.repository} target="_blank" rel="noreferrer">View progress on GitHub <span aria-hidden="true">↗</span></a>
        </div>
        <aside className="build-notes" aria-label="IncidentIQ design goals">
          <span className="build-notes-label">THE ANALYSIS PIPELINE</span>
          <h4>Less digging.<br />More understanding.</h4>
          <ul>
            <li>Submit incident reports for asynchronous AI analysis </li>
            <li>Retrieve relevant incidents and runbooks using semantic search</li>
            <li>Generate structured likely causes, recommended actions, and evidence-linked explanations through a custom RAG pipeline</li>
            <li>Explore reliable processing with queued jobs, retries, and failure handling</li>
          </ul>
          <p>Personal project in development · Pipeline design goals</p>
        </aside>
      </div>
    </section>
  );
}
