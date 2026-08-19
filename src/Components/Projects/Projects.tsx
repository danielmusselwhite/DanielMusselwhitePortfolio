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
    const allClosed = projects.length > 0 && visibleProjects.length === 0;

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

        const dismissTimeout = window.setTimeout(() => setShowTrafficHint(false), 6000);

        return () => window.clearTimeout(dismissTimeout);
    }, [showTrafficHint]);

    return (
        <section id="projects" className="section" ref={sectionRef}>
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

                {allClosed ? (
                    <div className="projects__empty-state" role="status">
                        <p className="projects__empty-state__command">
                            $ rm -rf ~/projects/*
                        </p>
                        <p className="projects__empty-state__message">
                            Whoa, you closed every project window! 🎉
                        </p>
                        <p className="projects__empty-state__hint">
                            Refresh the page to bring them all back.
                        </p>
                    </div>
                ) : (
                    <div className="project-terminal-grid">
                        {visibleProjects.map((project, index) => (
                            <ProjectCard
                                key={project.slug}
                                project={project}
                                index={index}
                                onClose={() =>
                                    setClosedSlugs((current) => [...current, project.slug])
                                }
                                showTrafficHint={index === 0 && showTrafficHint}
                                onDismissTrafficHint={() => setShowTrafficHint(false)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}