import "./Contact.css";
export default function Contact() {
    return (
        <section id="contact" className="section contact">
            <div className="section__content">
                <div className="contact__layout">
                    <div className="contact__copy">
                        <p className="section__eyebrow">06 / Contact</p>

                        <h2>Let&apos;s build something well.</h2>

                        <p>
                            I&apos;m always happy to talk about software
                            engineering, interesting technical challenges, and
                            opportunities to build reliable, well-designed
                            systems.
                        </p>

                        <p className="contact__note">
                            If you&apos;d like to discuss a role, a project, or
                            simply exchange ideas about software engineering,
                            email is the best way to reach me.
                        </p>
                    </div>

                    <div className="contact__panel">
                        <div className="contact__panel-header">
                            <span className="contact__status-dot" />
                            <span>communication.channels</span>
                            <span className="status-label">open</span>
                        </div>

                        <p className="contact__command">
                            <span>$</span> ./start-a-conversation
                        </p>

                        <div className="contact__links">
                            <a href="mailto:danielmusselwhite@outlook.com">
                                <span>Email</span>
                                <small>danielmusselwhite@outlook.com</small>
                            </a>

                            <a
                                href="https://github.com/danielmusselwhite"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>GitHub</span>
                                <small>Explore my projects</small>
                            </a>

                            <a
                                href="https://linkedin.com/in/daniel-musselwhite"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>LinkedIn</span>
                                <small>View my professional profile</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}