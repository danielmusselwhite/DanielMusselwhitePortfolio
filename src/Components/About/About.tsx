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
                            I work from the problem outward: understand the user, choose clear
                            boundaries, and build in testing and delivery. My experience spans
                            customer requirements, application architecture, and release support.
                        </p>
                    </div>
                    <Skills />
                </div>
            </section>
        </div>
    );
}
