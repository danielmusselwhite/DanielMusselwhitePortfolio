import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type {
    Project,
    ProjectProminence,
} from "../../Types/Project";

interface ProjectCardProps {
    project: Project;
    index: number;
    onClose: () => void;
    showTrafficHint?: boolean;
    onDismissTrafficHint?: () => void;
}

type ProjectViewMode = "minimized" | "normal" | "expanded";

function getProjectProminence(project: Project): ProjectProminence {
    if (project.prominence) {
        return project.prominence;
    }

    return project.featured ? "featured" : "standard";
}

function getInitialViewMode(
    prominence: ProjectProminence,
): ProjectViewMode {
    return prominence === "flagship"
        ? "expanded"
        : "minimized";
}

export default function ProjectCard({
    project,
    index,
    onClose,
    showTrafficHint = false,
    onDismissTrafficHint,
}: ProjectCardProps) {
    const prominence = getProjectProminence(project);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [viewMode, setViewMode] = useState<ProjectViewMode>(() =>
        getInitialViewMode(prominence),
    );
    const [hintPosition, setHintPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const pathRef = useRef<HTMLSpanElement>(null);
    const pathTextRef = useRef<HTMLSpanElement>(null);
    const trafficRef = useRef<HTMLDivElement>(null);

    const slides =
        project.images.length > 0
            ? project.images
            : [
                {
                    fileName: "cover",
                    url: project.coverImageUrl ?? "",
                },
            ];

    const demoLink =
        typeof project.demo === "string"
            ? {
                url: project.demo,
                label: "Live Demo",
            }
            : project.demo;

    const statusLabel =
        prominence === "standard"
            ? "project"
            : prominence;

    const detailSections = [
        {
            key: "overview",
            label: "Overview",
            value: project.overview ?? project.shortDescription,
        },
        ...(project.problem
            ? [
                {
                    key: "problem",
                    label: "Problem",
                    value: project.problem,
                },
            ]
            : []),
        ...(project.solution
            ? [
                {
                    key: "solution",
                    label: "Solution",
                    value: project.solution,
                },
            ]
            : []),
        ...(project.outcome
            ? [
                {
                    key: "outcome",
                    label: "Outcome",
                    value: project.outcome,
                },
            ]
            : []),
        ...(project.highlights && project.highlights.length > 0
            ? [
                {
                    key: "highlights",
                    label: "Highlights",
                    value: project.highlights,
                },
            ]
            : []),
    ];

    const cardClassName = [
        "project-window",
        `project-window--${prominence}`,
        index % 2 === 0
            ? "project-window--left"
            : "project-window--right",
        viewMode === "expanded"
            ? "project-window--expanded"
            : "",
        viewMode === "minimized"
            ? "project-window--minimized"
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    const previousSlide = () => {
        setActiveImageIndex((current) =>
            current === 0
                ? slides.length - 1
                : current - 1,
        );
    };

    const nextSlide = () => {
        setActiveImageIndex((current) =>
            current === slides.length - 1
                ? 0
                : current + 1,
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
                    current === slides.length - 1
                        ? 0
                        : current + 1,
                );
            }, 4000);
        };

        const initialDelay = window.setTimeout(
            startAutoplay,
            4000 + index * 900,
        );

        return () => {
            window.clearTimeout(initialDelay);

            if (interval !== undefined) {
                window.clearInterval(interval);
            }
        };
    }, [index, slides.length]);

    useEffect(() => {
        if (!showTrafficHint) {
            setHintPosition(null);
            return undefined;
        }

        const updatePosition = () => {
            const rect =
                trafficRef.current?.getBoundingClientRect();

            if (rect) {
                setHintPosition({
                    top: rect.bottom + 12,
                    left: rect.left,
                });
            }
        };

        updatePosition();

        window.addEventListener(
            "scroll",
            updatePosition,
            true,
        );
        window.addEventListener(
            "resize",
            updatePosition,
        );

        return () => {
            window.removeEventListener(
                "scroll",
                updatePosition,
                true,
            );
            window.removeEventListener(
                "resize",
                updatePosition,
            );
        };
    }, [showTrafficHint]);

    return (
        <article className={cardClassName}>
            <div className="project-window__chrome">
                <div
                    className="project-window__traffic"
                    ref={trafficRef}
                >
                    <button
                        type="button"
                        className="traffic-dot traffic-dot--red"
                        onClick={() => {
                            onClose();
                            onDismissTrafficHint?.();
                        }}
                        aria-label="Close project window"
                    />

                    <button
                        type="button"
                        className="traffic-dot traffic-dot--yellow"
                        onClick={() => {
                            setViewMode((current) =>
                                current === "minimized"
                                    ? "normal"
                                    : "minimized",
                            );
                            onDismissTrafficHint?.();
                        }}
                        aria-label={
                            viewMode === "minimized"
                                ? "Restore project preview"
                                : "Minimize project window"
                        }
                        aria-pressed={
                            viewMode === "minimized"
                        }
                    />

                    <button
                        type="button"
                        className="traffic-dot traffic-dot--green"
                        onClick={() => {
                            setViewMode((current) =>
                                current === "expanded"
                                    ? "normal"
                                    : "expanded",
                            );
                            onDismissTrafficHint?.();
                        }}
                        aria-label={
                            viewMode === "expanded"
                                ? "Collapse project details"
                                : "Expand project details"
                        }
                        aria-pressed={
                            viewMode === "expanded"
                        }
                    />
                </div>

                {showTrafficHint &&
                    hintPosition &&
                    createPortal(
                        <div
                            className="traffic-hint"
                            role="status"
                            style={{
                                top: hintPosition.top,
                                left: hintPosition.left,
                            }}
                        >
                            <span
                                className="traffic-hint__cursor"
                                aria-hidden="true"
                            >
                                <span className="traffic-hint__cursor-glyph">
                                    🖱️
                                </span>
                                <span className="traffic-hint__cursor-ripple" />
                            </span>

                            <p className="traffic-hint__text">
                                Click these to close, minimize, or
                                maximize this project
                            </p>
                        </div>,
                        document.body,
                    )}

                <span
                    className="project-window__path"
                    ref={pathRef}
                >
                    <span
                        className={
                            viewMode === "minimized"
                                ? "project-window__path-marquee project-window__path-marquee--scrolling"
                                : "project-window__path-marquee"
                        }
                    >
                        <span
                            className="project-window__path-track"
                            ref={pathTextRef}
                        >
                            ~/projects/{project.slug}
                        </span>

                        {viewMode === "minimized" && (
                            <span
                                className="project-window__path-track"
                                aria-hidden="true"
                            >
                                ~/projects/{project.slug}
                            </span>
                        )}
                    </span>
                </span>

                <span className="status-label">
                    {statusLabel}
                </span>
            </div>

            <div
                className={`project-window__content ${viewMode === "minimized"
                        ? "project-window__content--minimized"
                        : ""
                    }`}
            >
                <div className="project-window__content-inner">
                    <div className="project-window__carousel">
                        {slides.map((slide, slideIndex) => (
                            <img
                                key={slide.fileName}
                                src={slide.url}
                                alt={`${project.title} preview ${slideIndex + 1
                                    }`}
                                className={
                                    slideIndex === activeImageIndex
                                        ? "project-window__image project-window__image--active"
                                        : "project-window__image"
                                }
                                aria-hidden={
                                    slideIndex !==
                                    activeImageIndex
                                }
                                draggable={false}
                            />
                        ))}

                        {slides.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="icon-btn project-window__arrow project-window__arrow--left"
                                    onClick={previousSlide}
                                    aria-label="Previous project view"
                                >
                                    ←
                                </button>

                                <button
                                    type="button"
                                    className="icon-btn project-window__arrow project-window__arrow--right"
                                    onClick={nextSlide}
                                    aria-label="Next project view"
                                >
                                    →
                                </button>

                                <div
                                    className="project-window__image-status"
                                    aria-label={`Image ${activeImageIndex + 1
                                        } of ${slides.length}`}
                                >
                                    {slides.map(
                                        (
                                            slide,
                                            slideIndex,
                                        ) => (
                                            <button
                                                key={
                                                    slide.fileName
                                                }
                                                type="button"
                                                className={
                                                    slideIndex ===
                                                        activeImageIndex
                                                        ? "project-window__image-dot project-window__image-dot--active"
                                                        : "project-window__image-dot"
                                                }
                                                onClick={() =>
                                                    setActiveImageIndex(
                                                        slideIndex,
                                                    )
                                                }
                                                aria-label={`Show image ${slideIndex +
                                                    1
                                                    }`}
                                                aria-current={
                                                    slideIndex ===
                                                        activeImageIndex
                                                        ? "true"
                                                        : undefined
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="project-window__body">
                        <div className="project-window__title-row">
                            <span className="project-window__prompt">
                                $
                            </span>
                            <h3>{project.title}</h3>
                        </div>

                        <p className="project-window__summary">
                            {project.shortDescription}
                        </p>

                        <div className="project-card__technologies">
                            {project.technologies.map(
                                (technology) => (
                                    <span
                                        key={technology}
                                        className="technology"
                                    >
                                        {technology}
                                    </span>
                                ),
                            )}
                        </div>

                        <div className="project-card__actions">
                            {demoLink && (
                                <a
                                    href={demoLink.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {demoLink.label}
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

                        {viewMode === "expanded" && (
                            <div className="project-window__expanded-sections">
                                {detailSections.map(
                                    (detail) => (
                                        <section
                                            key={
                                                detail.key
                                            }
                                            className="project-window__expanded-section"
                                        >
                                            <h5>
                                                {
                                                    detail.label
                                                }
                                            </h5>

                                            {typeof detail.value ===
                                                "string" ? (
                                                <p>
                                                    {
                                                        detail.value
                                                    }
                                                </p>
                                            ) : (
                                                <ul>
                                                    {detail.value.map(
                                                        (
                                                            highlight: string,
                                                        ) => (
                                                            <li
                                                                key={
                                                                    highlight
                                                                }
                                                            >
                                                                {
                                                                    highlight
                                                                }
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </section>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}