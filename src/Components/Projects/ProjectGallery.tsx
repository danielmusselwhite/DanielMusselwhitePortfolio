import "./ProjectGallery.css";
import "./ProjectGalleryPreview.css";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { createPortal } from "react-dom";

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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const previousImage = useCallback(() => {
        setCurrentIndex((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    }, [images.length]);

    const nextImage = useCallback(() => {
        setCurrentIndex((current) =>
            current === images.length - 1 ? 0 : current + 1,
        );
    }, [images.length]);

    const openPreview = (index: number) => {
        setCurrentIndex(index);
        setIsPreviewOpen(true);
    };

    const closePreview = useCallback(() => {
        setIsPreviewOpen(false);
    }, []);

    // Automatically move to the next image every 4 seconds while the
    // gallery is not being inspected in the zoomed preview.
    useEffect(() => {
        if (images.length <= 1 || isPreviewOpen) {
            return;
        }

        const interval = window.setInterval(() => {
            setCurrentIndex((current) =>
                current === images.length - 1 ? 0 : current + 1,
            );
        }, 4000);

        return () => window.clearInterval(interval);
    }, [images.length, isPreviewOpen]);

    useEffect(() => {
        if (!isPreviewOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closePreview();
                return;
            }

            if (event.key === "ArrowLeft" && images.length > 1) {
                previousImage();
                return;
            }

            if (event.key === "ArrowRight" && images.length > 1) {
                nextImage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        closePreview,
        images.length,
        isPreviewOpen,
        nextImage,
        previousImage,
    ]);

    if (images.length === 0) {
        return null;
    }

    const preview =
        isPreviewOpen && typeof document !== "undefined"
            ? createPortal(
                <div
                    className="project-gallery-preview"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${projectTitle} image preview`}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePreview();
                        }
                    }}
                >
                    <div className="project-gallery-preview__content">
                        <button
                            type="button"
                            className="project-gallery-preview__close"
                            onClick={closePreview}
                            aria-label="Close image preview"
                        >
                            ×
                        </button>

                        <img
                            src={images[currentIndex].url}
                            alt={`${projectTitle} screenshot ${currentIndex + 1} enlarged`}
                            className="project-gallery-preview__image"
                            draggable={false}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="project-gallery-preview__button project-gallery-preview__button--previous"
                                    onClick={previousImage}
                                    aria-label="Previous image"
                                >
                                    ←
                                </button>

                                <button
                                    type="button"
                                    className="project-gallery-preview__button project-gallery-preview__button--next"
                                    onClick={nextImage}
                                    aria-label="Next image"
                                >
                                    →
                                </button>
                            </>
                        )}

                        <p className="project-gallery-preview__counter">
                            {currentIndex + 1} / {images.length}
                        </p>
                    </div>
                </div>,
                document.body,
            )
            : null;

    if (images.length === 1) {
        return (
            <>
                <div className="project-gallery">
                    <button
                        type="button"
                        className="project-gallery__zoom-trigger"
                        onClick={() => openPreview(0)}
                        aria-label={`Enlarge ${projectTitle} screenshot`}
                    >
                        <img
                            src={images[0].url}
                            alt={`${projectTitle} screenshot`}
                            className="project-gallery__image"
                            draggable={false}
                        />
                    </button>
                </div>

                {preview}
            </>
        );
    }

    return (
        <>
            <div className="project-gallery">
                <div className="project-gallery__viewport">
                    <div
                        className="project-gallery__track"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {images.map((image, index) => (
                            <button
                                key={image.fileName}
                                type="button"
                                className="project-gallery__slide"
                                onClick={() => openPreview(index)}
                                aria-label={`Enlarge ${projectTitle} screenshot ${index + 1}`}
                            >
                                <img
                                    src={image.url}
                                    alt={`${projectTitle} screenshot ${index + 1}`}
                                    className="project-gallery__image"
                                    draggable={false}
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="icon-btn project-gallery__button project-gallery__button--previous"
                        onClick={previousImage}
                        aria-label="Previous image"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        className="icon-btn project-gallery__button project-gallery__button--next"
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

            {preview}
        </>
    );
}
