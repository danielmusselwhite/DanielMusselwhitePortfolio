import { loadProjects } from "../../Utils/loadProjects";
import ProjectCard from "./ProjectCard";

const projects = loadProjects();

export default function Projects() {
    return (
        <section id="projects" className="section">
            <div className="section__content">
                <div className="projects__heading">
                    <div>
                        <p className="section__eyebrow">03 / Workbench</p>
                        <h2>Systems built to solve real problems.</h2>
                        <p>
                            A selection of projects where architecture,
                            product thinking, and dependable engineering meet.
                            Use the terminal panels to explore the decisions
                            behind each build.
                        </p>
                    </div>

                    <div className="projects__summary" aria-label="Project collection summary">
                        <span className="projects__summary-dot" />
                        <span>{projects.length} project{projects.length === 1 ? "" : "s"} indexed</span>
                    </div>
                </div>

                <div className="project-terminal-grid">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}