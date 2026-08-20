const educationItems = [
    {
        institution: "University College London",
        degree: "MSc Software Systems Engineering",
        dates: "Sep 2021 — Sep 2022",
        grade: "Distinction · 76%",
        highlights: [
            "Worked with Microsoft London on team projects involving requirements elicitation, system design, development, documentation, and validation within existing software projects.",
            "Focused on practical software engineering, architecture, and the design and delivery of complex software systems.",
        ],
    },
    {
        institution: "University of Nottingham",
        degree: "BSc (Hons) Computer Science & Artificial Intelligence",
        dates: "2018 — 2021",
        grade: "First-Class Honours · 81%",
        highlights: [
            "Graduated within the top 5% of the cohort and received the High Achievers Award.",
            "Developed an energy forecasting model and novel hyperparameter optimisation algorithm for my dissertation, benchmarking it against established approaches.",
        ],
    },
];

export default function Education() {
    return (
        <section id="education" className="section education">
            <div className="section__content">
                <div className="education__heading">
                    <p className="section__eyebrow">05 / Education</p>

                    <h2>Strong foundations in software engineering and computer science.</h2>

                    <p>
                        Academic experience spanning software systems
                        engineering, artificial intelligence, collaborative
                        development, and applied research.
                    </p>
                </div>

                <div className="education-list">
                    {educationItems.map((item, index) => (
                        <article
                            className="education-card"
                            key={item.institution}
                        >
                            <div className="education-card__marker">
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            <div className="education-card__content">
                                <div className="education-card__header">
                                    <div>
                                        <h3>{item.institution}</h3>
                                        <p>{item.degree}</p>
                                    </div>

                                    <span>{item.dates}</span>
                                </div>

                                <div className="education-card__grade">
                                    <span>Result</span>
                                    <strong>{item.grade}</strong>
                                </div>

                                <ul className="education-card__highlights">
                                    {item.highlights.map((highlight) => (
                                        <li key={highlight}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}