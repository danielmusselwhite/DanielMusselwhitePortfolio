import { useEffect, useState } from "react";

import type { Project } from "../../Types/Project";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({
    project,
    index,
}: ProjectCardProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeDetailIndex, setActiveDetailIndex] = useState(0);
    const slides =
        project.images.length > 0
            ? project.images
            : [{ fileName: "cover", url: project.coverImageUrl ?? "" }];

    const detailSections = [
        {
            key: "overview",
            label: "About",
            value: project.overview ?? project.shortDescription,
        },
        ...(project.problem
            ? [{ key: "problem", label: "Problem", value: project.problem }]
            : []),
        ...(project.solution
            ? [{ key: "solution", label: "Solution", value: project.solution }]
            : []),
        ...(project.outcome
            ? [{ key: "outcome", label: "Outcome", value: project.outcome }]
            : []),
        ...(project.highlights && project.highlights.length > 0
            ? [{ key: "highlights", label: "Highlights", value: project.highlights }]
            : []),
    ];

    const cardClassName =
        index % 2 === 0
            ? "project-window project-window--left"
            : "project-window project-window--right";

    const previousSlide = () => {
        setActiveImageIndex((current) =>
            current === 0 ? slides.length - 1 : current - 1,
        );
    };

    const nextSlide = () => {
        setActiveImageIndex((current) =>
            current === slides.length - 1 ? 0 : current + 1,
        );
    };

    useEffect(() => {
        if (slides.length <= 1) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveImageIndex((current) =>
                current === slides.length - 1 ? 0 : current + 1,
            );
        }, 4000);

        return () => window.clearInterval(interval);
    }, [slides.length]);

    const previousDetail = () => {
        setActiveDetailIndex((current) =>
            current === 0 ? detailSections.length - 1 : current - 1,
        );
    };

    const nextDetail = () => {
        setActiveDetailIndex((current) =>
            current === detailSections.length - 1 ? 0 : current + 1,
        );
    };

    const activeDetail = detailSections[activeDetailIndex] ?? detailSections[0];

    return (
        <article className={cardClassName}>
            <div className="project-window__chrome">
                <div className="project-window__traffic">
                    <span className="traffic-dot traffic-dot--red" />
                    <span className="traffic-dot traffic-dot--yellow" />
                    <span className="traffic-dot traffic-dot--green" />
                </div>

                <span className="project-window__path">
                    ~/projects/{project.slug}
                </span>
            </div>

            <div className="project-window__carousel">
                {slides.map((slide, slideIndex) => (
                    <img
                        key={slide.fileName}
                        src={slide.url}
                        alt={`${project.title} preview ${slideIndex + 1}`}
                        className={
                            slideIndex === activeImageIndex
                                ? "project-window__image project-window__image--active"
                                : "project-window__image"
                        }
                        aria-hidden={slideIndex !== activeImageIndex}
                    />
                ))}

                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="project-window__arrow project-window__arrow--left"
                            onClick={previousSlide}
                            aria-label="Previous project view"
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            className="project-window__arrow project-window__arrow--right"
                            onClick={nextSlide}
                            aria-label="Next project view"
                        >
                            →
                        </button>

                        <div className="project-window__image-status" aria-label={`Image ${activeImageIndex + 1} of ${slides.length}`}>
                            {slides.map((slide, slideIndex) => (
                                <button
                                    key={slide.fileName}
                                    type="button"
                                    className={
                                        slideIndex === activeImageIndex
                                            ? "project-window__image-dot project-window__image-dot--active"
                                            : "project-window__image-dot"
                                    }
                                    onClick={() => setActiveImageIndex(slideIndex)}
                                    aria-label={`Show image ${slideIndex + 1}`}
                                    aria-current={
                                        slideIndex === activeImageIndex
                                            ? "true"
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="project-window__body">
                <div className="project-window__title-row">
                    <span className="project-window__prompt">$</span>
                    <h3>{project.title}</h3>
                </div>

                {detailSections.length > 0 && activeDetail && (
                    <div className="project-window__detail-panel">
                        <div className="project-window__detail-header">
                            <span>{activeDetail.label}</span>
                            <div className="project-window__detail-nav">
                                <button
                                    type="button"
                                    onClick={previousDetail}
                                    aria-label="Previous detail"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={nextDetail}
                                    aria-label="Next detail"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div className="project-window__detail-content">
                            {typeof activeDetail.value === "string" ? (
                                <p className="project-window__summary">
                                    {activeDetail.value}
                                </p>
                            ) : (
                                <ul className="project-window__highlights">
                                    {activeDetail.value.map((highlight: string) => (
                                        <li key={highlight}>{highlight}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                <div className="project-card__technologies">
                    {project.technologies.map((technology) => (
                        <span key={technology} className="technology">
                            {technology}
                        </span>
                    ))}
                </div>

                <div className="project-card__actions">
                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Live Demo
                        </a>
                    )}

                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}