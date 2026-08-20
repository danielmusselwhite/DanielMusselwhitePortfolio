import { useEffect, useRef, useState } from "react";

import { loadProjects } from "../../Utils/loadProjects";
import ProjectCard from "./ProjectCard";

const projects = loadProjects();

export default function Projects() {
    const [closedSlugs, setClosedSlugs] = useState<string[]>([]);
    const [showTrafficHint, setShowTrafficHint] = useState(false);
    const sectionRef = useRef<HTMLElement | null>(null);

    const visibleProjects = projects.filter(
        (project) => !closedSlugs.includes(project.slug),
    );

    const allClosed =
        projects.length > 0 && visibleProjects.length === 0;

    useEffect(() => {
        const sectionEl = sectionRef.current;

        if (!sectionEl) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowTrafficHint(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 },
        );

        observer.observe(sectionEl);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!showTrafficHint) {
            return undefined;
        }

        const dismissTimeout = window.setTimeout(
            () => setShowTrafficHint(false),
            6000,
        );

        return () => window.clearTimeout(dismissTimeout);
    }, [showTrafficHint]);

    const restoreProjects = () => {
        setClosedSlugs([]);
    };

    return (
        <section id="projects" className="section" ref={sectionRef}>
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
                                showTrafficHint={
                                    index === 0 && showTrafficHint
                                }
                                onDismissTrafficHint={() =>
                                    setShowTrafficHint(false)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}