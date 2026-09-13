import ProjectScreenshots from "./ProjectScreenshots";
import type { Project } from "../../Types/Project";
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export default function ProjectFeature({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const demo =
    typeof project.demo === "string"
      ? { url: project.demo, label: "View demo" }
      : project.demo;
  return (
    <article className={`work-card work-card--${index}`}>
      <div className="work-copy">
        <p className="eyebrow">
          0{index} / {index === 1 ? "Distributed systems" : "Desktop & cloud"}
        </p>
        <h3>{project.title}</h3>
        <p className="work-description">{project.shortDescription}</p>
        <div className="tags">
          {project.technologies.slice(0, 5).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
        <div className="work-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              Explore code <Arrow />
            </a>
          )}
          {demo && (
            <a href={demo.url} target="_blank" rel="noreferrer">
              {demo.label} <Arrow />
            </a>
          )}
        </div>
      </div>
      <ProjectScreenshots project={project} />
      <details className="case-study">
        <summary>
          Behind the build <span aria-hidden="true">+</span>
        </summary>
        <div className="case-study-grid">
          {[
            ["The challenge", project.problem],
            ["The approach", project.solution],
            ["What it demonstrates", project.outcome],
          ].map(([title, body]) => (
            <div key={title}>
              <h4>{title}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </details>
    </article>
  );
}

