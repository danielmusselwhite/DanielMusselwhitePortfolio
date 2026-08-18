export interface ProjectMetadata {
  title: string;
  shortDescription: string;
  technologies: string[];
  overview?: string;
  problem?: string;
  solution?: string;
  outcome?: string;
  highlights?: string[];

  featured?: boolean;
  order?: number;

  github?: string;
  demo?: string;

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