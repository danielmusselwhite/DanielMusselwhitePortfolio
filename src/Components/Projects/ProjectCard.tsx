import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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

        let interval: number | undefined;
        const startAutoplay = () => {
            interval = window.setInterval(() => {
                setActiveImageIndex((current) =>
                    current === slides.length - 1 ? 0 : current + 1,
                );
            }, 4000);
        };
        const initialDelay = window.setTimeout(startAutoplay, 4000 + index * 900);

        return () => {
            window.clearTimeout(initialDelay);
            if (interval !== undefined) {
                window.clearInterval(interval);
            }
        };
    }, [index, slides.length]);

    useEffect(() => {
        if (!isDetailsOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsDetailsOpen(false);
            }
        };

        document.addEventListener("keydown", closeOnEscape);
        document.body.classList.add("modal-open");

        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.body.classList.remove("modal-open");
        };
    }, [isDetailsOpen]);

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

                <span className="project-window__state">
                    {project.featured ? "featured" : "project"}
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
                        draggable={false}
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

                <p className="project-window__summary">
                    {project.overview ?? project.shortDescription}
                </p>

                <button
                    type="button"
                    className="project-window__details-trigger"
                    onClick={() => setIsDetailsOpen(true)}
                >
                    <span>View project details</span>
                    <span aria-hidden="true">↗</span>
                </button>

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

            {isDetailsOpen &&
                createPortal(
                    <div
                        className="project-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${project.slug}-details-title`}
                        onClick={() => setIsDetailsOpen(false)}
                    >
                        <div
                            className="project-modal__content"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="project-modal__header">
                                <div>
                                    <p className="project-modal__eyebrow">
                                        ~/projects/{project.slug}
                                    </p>
                                    <h4 id={`${project.slug}-details-title`}>
                                        {project.title}
                                    </h4>
                                </div>
                                <button
                                    type="button"
                                    className="project-modal__close"
                                    onClick={() => setIsDetailsOpen(false)}
                                    aria-label="Close project details"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="project-modal__body">
                                {detailSections.map((detail) => (
                                    <section
                                        key={detail.key}
                                        className="project-modal__section"
                                    >
                                        <h5>{detail.label}</h5>
                                        {typeof detail.value === "string" ? (
                                            <p>{detail.value}</p>
                                        ) : (
                                            <ul>
                                                {detail.value.map((highlight: string) => (
                                                    <li key={highlight}>{highlight}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}
                            </div>

                            <div className="project-modal__footer">
                                <div className="project-card__technologies">
                                    {project.technologies.map((technology) => (
                                        <span key={technology} className="technology">
                                            {technology}
                                        </span>
                                    ))}
                                </div>
                                <div className="project-card__actions">
                                    {project.demo && (
                                        <a href={project.demo} target="_blank" rel="noreferrer">
                                            Live Demo
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noreferrer">
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}

        </article>
    );
}