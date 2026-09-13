export default function Contact() {
    return (
        <div id="contact" className="section-band">
            <section className="contact-section container">
                <p className="eyebrow">05 / Contact</p>
                <div className="contact-heading">
                    <h2>
                        Want to get in touch<span>?</span>
                    </h2>
                    <a
                        className="contact-arrow"
                        href="mailto:danielmusselwhite@outlook.com"
                        aria-label="Email Daniel"
                    >
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <div className="contact-socials">
                    <a
                        className="text-link"
                        href="https://www.linkedin.com/in/daniel-musselwhite/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Connect on LinkedIn <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <div className="contact-bottom">
                    <p>
                        If you'd like to talk about a role, ask about a project, or compare
                        notes on something I've built, send me a message.
                    </p>
                    <a href="mailto:danielmusselwhite@outlook.com">
                        danielmusselwhite@outlook.com <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
