import type { Project } from "../../Types/Project";
import ProjectDetails from "./ProjectDetails";
import ProjectScreenshots from "./ProjectScreenshots";
import ProjectTechnologies from "./ProjectTechnologies";

export default function WorkbenchProject({ project }: { project: Project }) {
  const demo =
    typeof project.demo === "string"
      ? { url: project.demo, label: "View demo" }
      : project.demo;

  return (
    <details className="workbench-project">
      <summary>
        <span className="workbench-title">{project.title}</span>

        <span className="workbench-description">
          {project.shortDescription}
        </span>

        <ProjectTechnologies
          technologies={project.technologies}
          projectTitle={project.title}
          initialCount={3}
        />

        <span className="workbench-toggle">
          <span className="when-closed">Explore project</span>
          <span className="when-open">Close project</span>
          <span className="expand-symbol" aria-hidden="true">
            +
          </span>
        </span>
      </summary>

      <div className="workbench-body">
        <ProjectScreenshots project={project} />

        {project.overview && (
          <p className="workbench-overview">{project.overview}</p>
        )}

        <ProjectDetails project={project} />

        <div className="work-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              Explore code <span aria-hidden="true">↗</span>
            </a>
          )}

          {demo && (
            <a href={demo.url} target="_blank" rel="noreferrer">
              {demo.label} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </details>
  );
}