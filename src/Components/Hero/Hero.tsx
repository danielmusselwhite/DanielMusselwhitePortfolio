export default function Hero() {
    return (
        <section id="home" className="hero">
            <div className="hero__content">
                <p className="hero__eyebrow">Hello, I'm</p>

                <h1>Daniel Musselwhite</h1>

                <h2>Full-Stack Developer</h2>

                <p className="hero__description">
                    I build modern, performant applications with a focus on
                    clean architecture, usability and maintainable code.
                </p>

                <div className="hero__actions">
                    <a href="#projects" className="button button--primary">
                        View my work
                    </a>

                    <a href="#contact" className="button button--secondary">
                        Contact me
                    </a>
                </div>
            </div>
        </section>
    );
}