import { useState } from "react";

interface ProjectTechnologiesProps {
    technologies: string[];
    projectTitle: string;
    initialCount?: number;
}

export default function ProjectTechnologies({
    technologies,
    projectTitle,
    initialCount = 5,
}: ProjectTechnologiesProps) {
    const [expanded, setExpanded] = useState(false);
    const hiddenCount = Math.max(0, technologies.length - initialCount);

    return (
        <span className="tags project-technologies">
            {technologies.map((technology, index) => (
                <span
                    key={technology}
                    hidden={!expanded && index >= initialCount}
                >
                    {technology}
                </span>
            ))}

            {hiddenCount > 0 && (
                <button
                    type="button"
                    className="project-technologies__toggle"
                    aria-expanded={expanded}
                    aria-label={
                        expanded
                            ? `Show fewer technologies for ${projectTitle}`
                            : `Show ${hiddenCount} more technologies for ${projectTitle}`
                    }
                    onClick={(event) => {
                        // Keep the surrounding project summary from opening or closing.
                        event.preventDefault();
                        event.stopPropagation();
                        setExpanded((current) => !current);
                    }}
                >
                    {expanded ? "Show fewer −" : `+${hiddenCount} more`}
                </button>
            )}
        </span>
    );
}