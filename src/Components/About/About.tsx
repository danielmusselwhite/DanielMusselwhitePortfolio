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
                                How I approach
                                <br />
                                software
                            </h2>
                        </div>
                        <p>
                            I like being involved beyond a single feature: understanding the
                            problem, working out how the pieces fit together, and seeing what
                            happens when the software is used. These are the areas I work
                            across most often.
                        </p>
                    </div>
                    <Skills />
                </div>
            </section>
        </div>
    );
}
