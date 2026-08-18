import { useEffect, useState } from "react";
import type { ProjectImage } from "../../Types/Project";

interface ProjectGalleryProps {
    images: ProjectImage[];
    projectTitle: string;
}

export default function ProjectGallery({
    images,
    projectTitle,
}: ProjectGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const previousImage = () => {
        setCurrentIndex((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    };

    const nextImage = () => {
        setCurrentIndex((current) =>
            current === images.length - 1 ? 0 : current + 1,
        );
    };

    // Automatically move to the next image every 4 seconds
    useEffect(() => {
        if (images.length <= 1) {
            return;
        }

        const interval = window.setInterval(() => {
            nextImage();
        }, 4000);

        return () => window.clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) {
        return null;
    }

    if (images.length === 1) {
        return (
            <div className="project-gallery">
                <img
                    src={images[0].url}
                    alt={`${projectTitle} screenshot`}
                    className="project-gallery__image"
                />
            </div>
        );
    }

    return (
        <div className="project-gallery">
            <div className="project-gallery__viewport">
                <div
                    className="project-gallery__track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <img
                            key={image.fileName}
                            src={image.url}
                            alt={`${projectTitle} screenshot ${index + 1}`}
                            className="project-gallery__image"
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="project-gallery__button project-gallery__button--previous"
                    onClick={previousImage}
                    aria-label="Previous image"
                >
                    ←
                </button>

                <button
                    type="button"
                    className="project-gallery__button project-gallery__button--next"
                    onClick={nextImage}
                    aria-label="Next image"
                >
                    →
                </button>
            </div>

            <div className="project-gallery__dots">
                {images.map((image, index) => (
                    <button
                        key={image.fileName}
                        type="button"
                        className={
                            index === currentIndex
                                ? "project-gallery__dot project-gallery__dot--active"
                                : "project-gallery__dot"
                        }
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        aria-current={
                            index === currentIndex ? "true" : undefined
                        }
                    />
                ))}
            </div>

            <p className="project-gallery__counter">
                {currentIndex + 1} / {images.length}
            </p>
        </div>
    );
}