import type { Project } from "../../Types/Project";

export default function ProjectDetails({ project }: { project: Project }) {
  const sections = [
    ["01", "The challenge", project.problem],
    ["02", "The design", project.solution],
    ["03", "What it demonstrates", project.outcome],
  ].filter(([, , body]) => body);
  return (
    <div className="project-details">
      <div className="decision-grid">
        {sections.map(([number, title, body]) => (
          <section className="decision-card" key={number}>
            <span className="decision-number" aria-hidden="true">{number}</span>
            <h4>{title}</h4>
            <p>{body}</p>
          </section>
        ))}
      </div>
      {!!project.highlights?.length && (
        <div className="build-evidence">
          <h4>Inside the implementation</h4>
          <ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
