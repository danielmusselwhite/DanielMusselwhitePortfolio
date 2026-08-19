export default function Contact() {
    return (
        <section id="contact" className="section contact">
            <div className="section__content">
                <div className="contact__layout">
                    <div className="contact__copy">
                        <p className="section__eyebrow">06 / Contact</p>

                        <h2>Have a problem worth solving?</h2>

                        <p>
                            I'm open to thoughtful conversations about software
                            engineering, development opportunities, and systems
                            that need making clearer or more reliable.
                        </p>

                        <p className="contact__note">
                            The best way to reach me is by email. I usually reply
                            with a few questions so we can understand the shape
                            of the problem before talking solutions.
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
                                <small>View the code</small>
                            </a>

                            <a
                                href="https://linkedin.com/in/daniel-musselwhite"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>LinkedIn</span>
                                <small>Connect professionally</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}