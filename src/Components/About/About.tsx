export default function About() {
    return (
        <section id="about" className="section">
            <div className="section__content">
                <div className="about__heading">
                    <p className="section__eyebrow">01 / Profile</p>
                    <h2>Building systems that stay understandable.</h2>
                </div>

                <div className="about__layout">
                    <div className="about__copy">
                        <p className="about__lead">
                            I'm a software developer who enjoys turning complex
                            problems into reliable, intuitive applications.
                        </p>

                        <p>
                            I care about the decisions behind the interface:
                            clear service boundaries, dependable data flows,
                            and systems that are straightforward to operate
                            and evolve.
                        </p>

                        <p>
                            My work spans full-stack development, desktop
                            applications, and cloud architecture, with a
                            particular focus on C#, .NET, Azure, and the
                            engineering practices that connect them.
                        </p>
                    </div>

                    <div className="about__readout" aria-label="Developer profile">
                        <div className="about__readout-header">
                            <span className="about__status-dot" />
                            <span>developer.profile</span>
                            <span className="about__readout-status">active</span>
                        </div>

                        <dl className="about__facts">
                            <div>
                                <dt>focus</dt>
                                <dd>Cloud-native systems</dd>
                            </div>
                            <div>
                                <dt>core stack</dt>
                                <dd>C# / .NET / Azure</dd>
                            </div>
                            <div>
                                <dt>approach</dt>
                                <dd>Reliable by design</dd>
                            </div>
                        </dl>

                        <p className="about__prompt">
                            <span>$</span> whoami --build-with-purpose
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}