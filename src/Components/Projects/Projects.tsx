import "./Projects.css";
import {
    useEffect,
    useMemo,
    useState,
    type KeyboardEvent,
} from "react";

import { loadProjects } from "../../Utils/loadProjects";
import ProjectCard, {
    getDefaultProjectViewMode,
    type ProjectViewMode,
} from "./ProjectCard";

const projects = loadProjects();

function createInitialProjectViewModes(): Record<string, ProjectViewMode> {
    return Object.fromEntries(
        projects.map((project) => [
            project.slug,
            getDefaultProjectViewMode(project),
        ]),
    );
}

export default function Projects() {
    const [closedSlugs, setClosedSlugs] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFilters, setSearchFilters] = useState<string[]>([]);
    const [projectViewModes, setProjectViewModes] = useState<
        Record<string, ProjectViewMode>
    >(createInitialProjectViewModes);

    const skills = useMemo(() => {
        const skillCounts = new Map<string, number>();

        projects.forEach((project) => {
            project.technologies.forEach((technology) => {
                skillCounts.set(
                    technology,
                    (skillCounts.get(technology) ?? 0) + 1,
                );
            });
        });

        return [...skillCounts.entries()]
            .sort(([skillA, countA], [skillB, countB]) => {
                if (countA !== countB) {
                    return countB - countA;
                }

                return skillA.localeCompare(skillB);
            })
            .map(([skill]) => skill);
    }, []);

    const normalizedSearchTerms = useMemo(
        () => [
            ...searchFilters,
            ...(searchQuery.trim() ? [searchQuery.trim()] : []),
        ]
            .map((term) => term.toLowerCase())
            .filter(Boolean),
        [searchFilters, searchQuery],
    );

    const hasSearch = normalizedSearchTerms.length > 0;

    const searchMatches = useMemo(() => {
        if (!hasSearch) {
            return projects;
        }

        return projects.filter((project) => {
            const searchableText = [
                project.title,
                ...project.technologies,
            ]
                .join(" ")
                .toLowerCase();

            return normalizedSearchTerms.some((term) =>
                searchableText.includes(term),
            );
        });
    }, [hasSearch, normalizedSearchTerms]);

    const searchMatchSlugs = useMemo(
        () => searchMatches.map((project) => project.slug),
        [searchMatches],
    );

    useEffect(() => {
        if (!hasSearch) {
            return;
        }

        // Searching should make every project available again without
        // changing the window size the user selected for that project.
        setClosedSlugs((current) =>
            current.length > 0 ? [] : current,
        );
    }, [hasSearch]);

    const visibleProjects = projects.filter(
        (project) => !closedSlugs.includes(project.slug),
    );

    const filteredProjects = (hasSearch
        ? searchMatches
        : visibleProjects
    ).filter(
        (project) => !closedSlugs.includes(project.slug),
    );

    const suggestedSkills = skills.filter(
        (skill) =>
            !searchFilters.some(
                (filter) =>
                    filter.toLowerCase() === skill.toLowerCase(),
            ),
    );

    const allClosed =
        !hasSearch &&
        projects.length > 0 &&
        visibleProjects.length === 0;

    const noSearchResults =
        hasSearch && searchMatches.length === 0;

    const matchingProjectsClosed =
        hasSearch &&
        searchMatches.length > 0 &&
        filteredProjects.length === 0;

    const restoreProjects = () => {
        setClosedSlugs([]);
    };

    const restoreMatchingProjects = () => {
        const matchingSlugs = new Set(searchMatchSlugs);

        setClosedSlugs((current) =>
            current.filter((slug) => !matchingSlugs.has(slug)),
        );
    };

    const addSearchFilter = (value: string) => {
        const filter = value.trim();

        if (!filter) {
            return;
        }

        const alreadyExists = searchFilters.some(
            (currentFilter) =>
                currentFilter.toLowerCase() === filter.toLowerCase(),
        );

        if (!alreadyExists) {
            setSearchFilters((current) => [...current, filter]);
        }

        setSearchQuery("");
    };

    const removeSearchFilter = (filter: string) => {
        setSearchFilters((current) =>
            current.filter(
                (currentFilter) =>
                    currentFilter.toLowerCase() !== filter.toLowerCase(),
            ),
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchFilters([]);
    };

    const handleSearchKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSearchFilter(searchQuery);
            return;
        }

        if (
            event.key === "Backspace" &&
            searchQuery.length === 0 &&
            searchFilters.length > 0
        ) {
            setSearchFilters((current) => current.slice(0, -1));
        }
    };

    const setProjectViewMode = (
        slug: string,
        viewMode: ProjectViewMode,
    ) => {
        setProjectViewModes((current) => ({
            ...current,
            [slug]: viewMode,
        }));
    };

    const setAllProjectViewModes = (viewMode: ProjectViewMode) => {
        const targetProjects = hasSearch ? searchMatches : projects;

        if (viewMode === "normal") {
            const targetSlugs = new Set(
                targetProjects.map((project) => project.slug),
            );

            setClosedSlugs((current) =>
                current.filter((slug) => !targetSlugs.has(slug)),
            );
        }

        setProjectViewModes((current) => {
            const next = { ...current };

            targetProjects.forEach((project) => {
                next[project.slug] = viewMode;
            });

            return next;
        });
    };

    const searchDescription = [
        ...searchFilters,
        ...(searchQuery.trim() ? [searchQuery.trim()] : []),
    ].join(" OR ");

    return (
        <section id="projects" className="section projects">
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
                                {hasSearch
                                    ? `${filteredProjects.length} of ${searchMatches.length} matches`
                                    : `${projects.length} project${projects.length === 1 ? "" : "s"} available`}
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
                                Maximize
                            </span>
                        </div>

                    </div>
                </div>

                <div className="projects__filter">
                    <div
                        className="projects__search"
                        role="search"
                        aria-label="Search projects"
                    >
                        <span
                            className="projects__search-icon"
                            aria-hidden="true"
                        >
                            ⌕
                        </span>

                        <div className="projects__search-content">
                            {searchFilters.map((filter) => (
                                <span
                                    key={filter}
                                    className="projects__search-tag"
                                >
                                    <span>{filter}</span>

                                    <button
                                        type="button"
                                        className="projects__search-tag-remove"
                                        onClick={() =>
                                            removeSearchFilter(filter)
                                        }
                                        aria-label={`Remove ${filter} filter`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                onKeyDown={handleSearchKeyDown}
                                placeholder={
                                    searchFilters.length > 0
                                        ? "Add filter..."
                                        : "Search projects..."
                                }
                                aria-label="Search projects by name or technology"
                            />
                        </div>

                        {hasSearch && (
                            <button
                                type="button"
                                className="projects__search-clear"
                                onClick={clearSearch}
                                aria-label="Clear all project filters"
                                title="Clear all filters"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div
                        className="projects__skill-suggestions"
                        aria-label="Technology filters"
                    >
                        {suggestedSkills.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                className="projects__skill-chip"
                                onClick={() => addSearchFilter(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>

                    <div
                        className="projects__bulk-actions"
                        aria-label="Project view controls"
                    >
                        <button
                            type="button"
                            className="projects__bulk-action projects__bulk-action--open"
                            onClick={() => setAllProjectViewModes("normal")}
                            aria-label={hasSearch ? "Open all matching projects" : "Open all projects"}
                            title={hasSearch ? "Open all matches" : "Open all"}
                        >
                            <span
                                className="projects__bulk-action-icon projects__bulk-action-icon--open"
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            className="projects__bulk-action projects__bulk-action--minimize"
                            onClick={() => setAllProjectViewModes("minimized")}
                            aria-label={hasSearch ? "Minimize all matching projects" : "Minimize all projects"}
                            title={hasSearch ? "Minimize all matches" : "Minimize all"}
                        >
                            <span
                                className="projects__bulk-action-icon projects__bulk-action-icon--minimize"
                                aria-hidden="true"
                            />
                        </button>
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
                ) : noSearchResults ? (
                    <div className="projects__empty-state" role="status">
                        <p className="projects__empty-state__command">
                            $ ~/projects --search "{searchDescription}"
                        </p>

                        <p className="projects__empty-state__message">
                            No matching projects found.
                        </p>

                        <p className="projects__empty-state__hint">
                            Try a project name or another technology.
                        </p>

                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={clearSearch}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : matchingProjectsClosed ? (
                    <div className="projects__empty-state" role="status">
                        <p className="projects__empty-state__command">
                            $ ~/projects --matches --closed
                        </p>

                        <p className="projects__empty-state__message">
                            Matching project windows closed.
                        </p>

                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={restoreMatchingProjects}
                        >
                            Restore matches
                        </button>
                    </div>
                ) : (
                    <div className="project-terminal-grid">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.slug}
                                project={project}
                                index={index}
                                viewMode={
                                    projectViewModes[project.slug] ??
                                    getDefaultProjectViewMode(project)
                                }
                                onViewModeChange={(viewMode) =>
                                    setProjectViewMode(
                                        project.slug,
                                        viewMode,
                                    )
                                }
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
