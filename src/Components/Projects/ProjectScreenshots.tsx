import { useEffect, useState } from "react";
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
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (project.images.length < 2 || isPaused) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;
    const timer = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % project.images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, project.images.length]);
  if (!project.images.length) return null;
  return (
    <div
      className="work-visual"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
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
            alt={`${project.title} application - ${project.images[imageIndex].fileName.replace(/[_-]/g, " ").replace(/\.png$/i, "")}`}
            loading="lazy"
          />
        </a>
      )}
      <div className="image-controls">
        <span>APPLICATION GALLERY</span>
        <div>
          {project.images.length > 1 && (
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              aria-label={
                isPaused
                  ? "Resume automatic gallery"
                  : "Pause automatic gallery"
              }
              aria-pressed={isPaused}
            >
              {isPaused ? "▶" : "⏸"}
            </button>
          )}
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
