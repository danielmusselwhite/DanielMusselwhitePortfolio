import Skills from "../Skills/Skills";
export default function About() {
    return (
        <div id="about" className="section-band">
            <section className="approach-section">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">02 / How I work</p>
                            <h2>
                                What I enjoy
                                <br />
                                about the work
                            </h2>
                        </div>
                        <p>
                            I like being involved beyond a single feature: understanding the
                            problem, working out how the pieces fit together, and seeing what
                            happens when the software is used. Here's what that has looked
                            like in practice.
                        </p>
                    </div>
                    <Skills />
                </div>
            </section>
        </div>
    );
}
