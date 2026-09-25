export default function Contact() {
    return (
        <div id="contact" className="section-band">
            <section className="contact-section container">
                <div className="contact-top">
                    <div>
                        <p className="eyebrow">06 / Contact</p>
                        <h2>
                            Want to get in touch<span>?</span>
                        </h2>
                        <p className="contact-intro">
                            If you’d like to talk about a role, ask about a project, or
                            compare notes on something I’ve built, send me a message.
                        </p>
                    </div>
                    <div className="contact-actions">
                        <a
                            className="contact-action contact-action--primary"
                            href="mailto:danielmusselwhite@outlook.com"
                        >
                            Email me <span aria-hidden="true">↗</span>
                        </a>
                        <a
                            className="contact-action"
                            href="https://github.com/danielmusselwhite"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub <span aria-hidden="true">↗</span>
                        </a>
                        <a
                            className="contact-action"
                            href="https://www.linkedin.com/in/daniel-musselwhite/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            LinkedIn <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>
                <div className="contact-address">
                    <span>EMAIL</span>
                    <a href="mailto:danielmusselwhite@outlook.com">
                        danielmusselwhite@outlook.com
                    </a>
                    <span>GITHUB</span>
                    <a href="https://github.com/danielmusselwhite" target="_blank" rel="noreferrer">
                        github.com/danielmusselwhite
                    </a>
                    <span>LINKEDIN</span>
                    <a href="https://www.linkedin.com/in/daniel-musselwhite/" target="_blank" rel="noreferrer">
                        linkedin.com/in/daniel-musselwhite/
                    </a>
                </div>
            </section>
        </div>
    );
}
