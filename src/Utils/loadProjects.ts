import type {
  Project,
  ProjectImage,
  ProjectMetadata,
} from "../Types/Project";

const metadataFiles = import.meta.glob<ProjectMetadata>(
  "../Resources/Projects/*/project.json",
  {
    eager: true,
    import: "default",
  },
);

const imageFiles = import.meta.glob<string>(
  "../Resources/Projects/*/Images/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

function getProjectFolder(path: string): string {
  const match = path.match(/Projects\/([^/]+)\//);

  if (!match) {
    throw new Error(`Unable to determine project folder from: ${path}`);
  }

  return match[1];
}

function getFileName(path: string): string {
  return path.split("/").pop() ?? "";
}

export function loadProjects(): Project[] {
  const projects: Project[] = [];

  for (const [metadataPath, metadata] of Object.entries(metadataFiles)) {
    const folder = getProjectFolder(metadataPath);

    const projectImages: ProjectImage[] = Object.entries(imageFiles)
      .filter(([path]) => getProjectFolder(path) === folder)
      .map(([path, url]) => ({
        fileName: getFileName(path),
        url,
      }))
      .sort((a, b) =>
        a.fileName.localeCompare(b.fileName, undefined, {
          numeric: true,
        }),
      );

    const coverImageUrl = metadata.coverImage
      ? projectImages.find(
          (image) => image.fileName === metadata.coverImage,
        )?.url
      : projectImages[0]?.url;

    projects.push({
      ...metadata,
      slug: folder,
      coverImageUrl,
      images: projectImages,
    });
  }

  return projects.sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  );
}