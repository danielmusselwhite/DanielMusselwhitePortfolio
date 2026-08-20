export default function About() {
    return (
        <section id="about" className="section">
            <div className="section__content">
                <div className="about__heading">
                    <p className="section__eyebrow">01 / Profile</p>
                    <h2>Building systems that stay understandable as they grow.</h2>
                </div>

                <div className="about__layout">
                    <div className="about__copy">
                        <p className="about__lead">
                            I'm a Software Engineer focused on designing and
                            building systems that are reliable, maintainable,
                            and straightforward to evolve.
                        </p>

                        <p>
                            I enjoy working across the engineering lifecycle:
                            understanding requirements, shaping architecture,
                            implementing features, testing behaviour, and
                            taking software through to deployment and support.
                        </p>

                        <p>
                            My experience spans backend and full-stack web
                            development, desktop applications, APIs, databases,
                            and cloud infrastructure, with a particular focus
                            on C#, .NET, Azure, and distributed systems.
                        </p>
                    </div>

                    <div
                        className="about__readout"
                        aria-label="Developer profile"
                    >
                        <div className="about__readout-header">
                            <span className="about__status-dot" />
                            <span>engineer.profile</span>
                            <span className="status-label">active</span>
                        </div>

                        <dl className="about__facts">
                            <div>
                                <dt>focus</dt>
                                <dd>Backend & distributed systems</dd>
                            </div>
                            <div>
                                <dt>core stack</dt>
                                <dd>C# / .NET / Azure</dd>
                            </div>
                            <div>
                                <dt>approach</dt>
                                <dd>End-to-end ownership</dd>
                            </div>
                        </dl>

                        <p className="about__prompt">
                            <span>$</span> whoami --engineer-end-to-end
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}