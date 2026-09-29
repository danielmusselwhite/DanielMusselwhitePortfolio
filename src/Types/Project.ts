export type ProjectProminence = "flagship" | "featured" | "standard";

export interface ProjectDemo {
    url: string;
    label: string;
}

export interface ProjectMetadata {
    title: string;
    shortDescription: string;
    technologies: string[];
    overview?: string;
    problem?: string;
    solution?: string;
    outcome?: string;
    highlights?: string[];

    /**
     * Editorial prominence. The browser labels the flagship;
     * order controls the list position and default selection.
     */
    prominence?: ProjectProminence;

    /**
     * Legacy field kept temporarily so existing project JSON does not need
     * to be migrated in the same change.
     */
    featured?: boolean;

    order?: number;
    github?: string;

    /**
     * A string is supported for existing projects.
     * New projects can provide a custom CTA label.
     */
    demo?: string | ProjectDemo;

    coverImage?: string;
}

export interface ProjectImage {
    fileName: string;
    url: string;
}

export interface Project extends ProjectMetadata {
    slug: string;
    content?: string;
    coverImageUrl?: string;
    images: ProjectImage[];
}
