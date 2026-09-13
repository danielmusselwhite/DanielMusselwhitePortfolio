import type { Project } from "../../Types/Project";
import ProjectScreenshots from "./ProjectScreenshots";

export default function WorkbenchProject({ project }: { project: Project }) {
  const demo = typeof project.demo === "string"
    ? { url: project.demo, label: "View demo" }
    : project.demo;
  const sections = [
    ["The challenge", project.problem],
    ["The approach", project.solution],
    ["What it demonstrates", project.outcome],
  ].filter(([, body]) => body);

  return (
    <details className="workbench-project">
      <summary>
        <span className="workbench-title">{project.title}</span>
        <span className="workbench-description">{project.shortDescription}</span>
        <span className="tags">{project.technologies.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</span>
        <span className="workbench-toggle"><span className="when-closed">Explore project</span><span className="when-open">Close project</span><span className="expand-symbol" aria-hidden="true">+</span></span>
      </summary>
      <div className="workbench-body">
        <ProjectScreenshots project={project} />
        {project.overview && <p className="workbench-overview">{project.overview}</p>}
        <div className="workbench-sections">
          {sections.map(([title, body]) => <div key={title}><h4>{title}</h4><p>{body}</p></div>)}
        </div>
        <div className="tags">{project.technologies.map(tag => <span key={tag}>{tag}</span>)}</div>
        <div className="work-links">
          {project.github && <a href={project.github} target="_blank" rel="noreferrer">Explore code <span aria-hidden="true">↗</span></a>}
          {demo && <a href={demo.url} target="_blank" rel="noreferrer">{demo.label} <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </details>
  );
}
