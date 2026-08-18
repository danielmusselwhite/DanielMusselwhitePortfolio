import { loadProjects } from "../../Utils/loadProjects";
import ProjectCard from "./ProjectCard";

const projects = loadProjects();

export default function Projects() {
    return (
        <section id="projects" className="section">
            <div className="section__content">
                <p className="section__eyebrow">My Work</p>

                <h2>Selected Projects</h2>

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