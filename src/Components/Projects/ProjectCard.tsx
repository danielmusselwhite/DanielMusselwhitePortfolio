import "./ProjectCard.css";
import { useState } from "react";

import type {
    Project,
    ProjectProminence,
} from "../../Types/Project";
import ProjectGallery from "./ProjectGallery";

export type ProjectViewMode = "minimized" | "normal" | "maximized";

interface ProjectCardProps {
    project: Project;
    index: number;
    viewMode: ProjectViewMode;
    onViewModeChange: (viewMode: ProjectViewMode) => void;
    onClose: () => void;
}

interface ProjectDetailSection {
    key: string;
    label: string;
    value: string | string[];
}

function getProjectProminence(project: Project): ProjectProminence {
    if (project.prominence) {
        return project.prominence;
    }

    return project.featured ? "featured" : "standard";
}

export function getDefaultProjectViewMode(
    project: Project,
): ProjectViewMode {
    return getProjectProminence(project) === "flagship"
        ? "normal"
        : "minimized";
}

export default function ProjectCard({
    project,
    index,
    viewMode,
    onViewModeChange,
    onClose,
}: ProjectCardProps) {
    const prominence = getProjectProminence(project);
    const [activeDetailKey, setActiveDetailKey] = useState("overview");

    const galleryImages =
        project.images.length > 0
            ? project.images
            : project.coverImageUrl
                ? [
                    {
                        fileName: "cover",
                        url: project.coverImageUrl,
                    },
                ]
                : [];

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

    const detailSections: ProjectDetailSection[] = [
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

    const activeDetail =
        detailSections.find(
            (detail) => detail.key === activeDetailKey,
        ) ?? detailSections[0];

    const cardClassName = [
        "project-window",
        `project-window--${prominence}`,
        index % 2 === 0
            ? "project-window--left"
            : "project-window--right",
        viewMode === "maximized"
            ? "project-window--maximized"
            : "",
        viewMode === "minimized"
            ? "project-window--minimized"
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <article className={cardClassName}>
            <div className="project-window__chrome">
                <div className="project-window__traffic">
                    <button
                        type="button"
                        className="traffic-dot traffic-dot--red"
                        onClick={onClose}
                        aria-label="Close project window"
                    >
                        <span
                            className="traffic-dot__icon traffic-dot__icon--close"
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        type="button"
                        className="traffic-dot traffic-dot--yellow"
                        onClick={() =>
                            onViewModeChange(
                                viewMode === "minimized"
                                    ? "normal"
                                    : "minimized",
                            )
                        }
                        aria-label={
                            viewMode === "minimized"
                                ? "Restore project window"
                                : "Minimize project window"
                        }
                        aria-pressed={viewMode === "minimized"}
                    >
                        <span
                            className="traffic-dot__icon traffic-dot__icon--minimize"
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        type="button"
                        className="traffic-dot traffic-dot--green"
                        onClick={() =>
                            onViewModeChange(
                                viewMode === "maximized"
                                    ? "normal"
                                    : "maximized",
                            )
                        }
                        aria-label={
                            viewMode === "maximized"
                                ? "Restore project window"
                                : "Maximize project window"
                        }
                        aria-pressed={viewMode === "maximized"}
                    >
                        <span
                            className="traffic-dot__icon traffic-dot__icon--expand"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <span className="project-window__path">
                    <span
                        className={
                            viewMode === "minimized"
                                ? "project-window__path-marquee project-window__path-marquee--scrolling"
                                : "project-window__path-marquee"
                        }
                    >
                        <span className="project-window__path-track">
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

            {viewMode === "minimized" ? (
                <div className="project-window__minimized-preview">
                    <div className="project-window__title-row">
                        <span className="project-window__prompt">
                            $
                        </span>
                        <h3>{project.title}</h3>
                    </div>

                    <p className="project-window__minimized-summary">
                        {project.shortDescription}
                    </p>

                    <div
                        className="project-window__minimized-technologies"
                        aria-label="Project technologies"
                    >
                        {project.technologies.map((technology) => (
                            <span
                                key={technology}
                                className="technology"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="project-window__content">
                    <div className="project-window__main">
                        <ProjectGallery
                            images={galleryImages}
                            projectTitle={project.title}
                        />

                        <div className="project-window__body">
                            <div className="project-window__title-row">
                                <span className="project-window__prompt">
                                    $
                                </span>
                                <h3>{project.title}</h3>
                            </div>

                            <div className="project-window__body-scroll">
                                <p className="project-window__summary">
                                    {project.shortDescription}
                                </p>

                                <div className="project-card__technologies">
                                    {project.technologies.map((technology) => (
                                        <span
                                            key={technology}
                                            className="technology"
                                        >
                                            {technology}
                                        </span>
                                    ))}
                                </div>
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
                        </div>
                    </div>

                    {viewMode === "maximized" && (
                        <div className="project-window__details">
                            <div
                                className="project-window__detail-tabs"
                                role="tablist"
                                aria-label={`${project.title} details`}
                            >
                                {detailSections.map((detail) => (
                                    <button
                                        key={detail.key}
                                        type="button"
                                        id={`${project.slug}-${detail.key}-tab`}
                                        className={
                                            activeDetail.key === detail.key
                                                ? "project-window__detail-tab project-window__detail-tab--active"
                                                : "project-window__detail-tab"
                                        }
                                        onClick={() =>
                                            setActiveDetailKey(detail.key)
                                        }
                                        role="tab"
                                        aria-selected={
                                            activeDetail.key === detail.key
                                        }
                                        aria-controls={`${project.slug}-detail-panel`}
                                    >
                                        {detail.label}
                                    </button>
                                ))}
                            </div>

                            <section
                                id={`${project.slug}-detail-panel`}
                                className="project-window__detail-panel"
                                role="tabpanel"
                                aria-labelledby={`${project.slug}-${activeDetail.key}-tab`}
                            >
                                <h4>{activeDetail.label}</h4>

                                {typeof activeDetail.value === "string" ? (
                                    <p>{activeDetail.value}</p>
                                ) : (
                                    <ul>
                                        {activeDetail.value.map(
                                            (highlight) => (
                                                <li key={highlight}>
                                                    {highlight}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
