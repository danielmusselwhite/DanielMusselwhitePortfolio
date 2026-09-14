import ProjectDetails from "./ProjectDetails";
import ProjectScreenshots from "./ProjectScreenshots";
import ProjectTechnologies from "./ProjectTechnologies";
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

        <ProjectTechnologies
          technologies={project.technologies}
          projectTitle={project.title}
          initialCount={5}
        />

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
          Explore the engineering <span aria-hidden="true">+</span>
        </summary>
        <ProjectDetails project={project} />
      </details>
    </article>
  );
}