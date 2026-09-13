import { useState } from "react";
import type { Project } from "../../Types/Project";

export default function ProjectScreenshots({ project }: { project: Project }) {
  const [imageIndex, setImageIndex] = useState(() =>
    Math.max(
      0,
      project.images.findIndex(
        (image) =>
          image.fileName ===
          (project.title === "CommerceFabric"
            ? "CommerceFabric_User_ProductsPage.png"
            : "dotnote_ss.png"),
      ),
    ),
  );
  if (!project.images.length) return null;
  return (
      <div className="work-visual">
        <div className="window-bar">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>{project.title.toLowerCase()} / application</span>
          <span aria-hidden="true">↗</span>
        </div>
        {project.images.length > 0 && (
          <a
            href={project.images[imageIndex].url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title} screenshot at full size`}
          >
            <img
              src={project.images[imageIndex].url}
              alt={`${project.title} application — ${project.images[imageIndex].fileName.replace(/[_-]/g, " ").replace(/\.png$/i, "")}`}
              loading="lazy"
            />
          </a>
        )}
        <div className="image-controls">
          <span>APPLICATION GALLERY</span>
          <div>
            {project.images.map((image, i) => (
              <button
                key={image.fileName}
                onClick={() => setImageIndex(i)}
                aria-label={`Show ${project.title} screenshot ${i + 1}`}
                aria-pressed={i === imageIndex}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
  );
}
