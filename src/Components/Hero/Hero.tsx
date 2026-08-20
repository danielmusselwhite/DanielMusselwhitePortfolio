import { useEffect, useState } from "react";
import AiAssistant from "./AiAssistant/AiAssistant";

const heroTitle = "Full-Stack Developer";

export default function Hero() {
    const [typedTitle, setTypedTitle] = useState("");

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            setTypedTitle(heroTitle);
            return;
        }

        let characterIndex = 0;

        const typingInterval = window.setInterval(() => {
            characterIndex += 1;
            setTypedTitle(heroTitle.slice(0, characterIndex));

            if (characterIndex === heroTitle.length) {
                window.clearInterval(typingInterval);
            }
        }, 85);

        return () => window.clearInterval(typingInterval);
    }, []);

    return (
        <section id="home" className="hero">
            <div className="hero__content">
                <div className="hero__copy">
                    <p className="hero__eyebrow">Hello, I'm</p>

                    <h1>Daniel Musselwhite</h1>

                    <h2 className="hero__typing" aria-label={heroTitle}>
                        <span aria-hidden="true">{typedTitle}</span>

                        <span
                            className="hero__typing-cursor"
                            aria-hidden="true"
                        >
                            _
                        </span>
                    </h2>

                    <p className="hero__description">
                        I build modern, performant applications with a focus on
                        clean architecture, usability and maintainable code.
                    </p>

                    <div className="hero__actions">
                        <a
                            href="#projects"
                            className="button button--primary"
                        >
                            View my work
                        </a>

                        <a
                            href="#contact"
                            className="button button--secondary"
                        >
                            Contact me
                        </a>
                    </div>
                </div>

                <AiAssistant />
            </div>
        </section>
    );
}
