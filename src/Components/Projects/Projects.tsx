import "./Projects.css";
import { useState } from "react";

import { loadProjects } from "../../Utils/loadProjects";
import ProjectCard from "./ProjectCard";

const projects = loadProjects();

export default function Projects() {
    const [closedSlugs, setClosedSlugs] = useState<string[]>([]);

    const visibleProjects = projects.filter(
        (project) => !closedSlugs.includes(project.slug),
    );

    const allClosed =
        projects.length > 0 && visibleProjects.length === 0;

    const restoreProjects = () => {
        setClosedSlugs([]);
    };

    return (
        <section id="projects" className="section">
            <div className="section__content">
                <div className="projects__heading">
                    <div>
                        <p className="section__eyebrow">03 / Projects</p>

                        <h2>Engineering beyond the feature boundary.</h2>

                        <p>
                            Selected projects exploring system architecture,
                            distributed communication, cloud infrastructure,
                            desktop tooling, and full-stack application
                            development. Explore each project to see the
                            technical decisions behind the build.
                        </p>
                    </div>

                    <div className="projects__meta">
                        <div
                            className="projects__summary"
                            aria-label="Project collection summary"
                        >
                            <span className="projects__summary-dot" />
                            <span>
                                {projects.length} project
                                {projects.length === 1 ? "" : "s"} available
                            </span>
                        </div>

                        <div
                            className="projects__controls-legend"
                            aria-label="Project window controls"
                        >
                            <span className="projects__control-guide">
                                <span
                                    className="projects__control-dot projects__control-dot--red"
                                    aria-hidden="true"
                                >
                                    <span className="projects__control-icon projects__control-icon--close" />
                                </span>
                                Close
                            </span>

                            <span className="projects__control-guide">
                                <span
                                    className="projects__control-dot projects__control-dot--yellow"
                                    aria-hidden="true"
                                >
                                    <span className="projects__control-icon projects__control-icon--minimize" />
                                </span>
                                Minimize
                            </span>

                            <span className="projects__control-guide">
                                <span
                                    className="projects__control-dot projects__control-dot--green"
                                    aria-hidden="true"
                                >
                                    <span className="projects__control-icon projects__control-icon--expand" />
                                </span>
                                Expand
                            </span>
                        </div>
                    </div>
                </div>

                {allClosed ? (
                    <div className="projects__empty-state" role="status">
                        <p className="projects__empty-state__command">
                            $ ~/projects --closed
                        </p>

                        <p className="projects__empty-state__message">
                            All project windows closed.
                        </p>

                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={restoreProjects}
                        >
                            Restore projects
                        </button>
                    </div>
                ) : (
                    <div className="project-terminal-grid">
                        {visibleProjects.map((project, index) => (
                            <ProjectCard
                                key={project.slug}
                                project={project}
                                index={index}
                                onClose={() =>
                                    setClosedSlugs((current) => [
                                        ...current,
                                        project.slug,
                                    ])
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}