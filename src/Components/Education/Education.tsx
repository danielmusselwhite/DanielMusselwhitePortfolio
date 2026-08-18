const educationItems = [
    {
        institution: "University College London",
        degree: "Master of Science - MSc",
        subject: "Software Systems Engineering",
        dates: "Sep 2021 - Sep 2022",
        grade: "Distinction",
    },
    {
        institution: "University of Nottingham",
        degree: "Bachelor of Science - BSc",
        subject: "Computer Science and Artificial Intelligence",
        dates: "2018 - 2021",
        grade: "First-Class Honours",
    },
];

export default function Education() {
    return (
        <section id="education" className="section education">
            <div className="section__content">
                <div className="education__heading">
                    <p className="section__eyebrow">05 / Education</p>
                    <h2>A foundation in software systems and intelligent computing.</h2>
                    <p>
                        Academic work that shaped how I think about software
                        design, engineering trade-offs, and the systems behind
                        the applications I build.
                    </p>
                </div>

                <div className="education-list">
                    {educationItems.map((item, index) => (
                        <article className="education-card" key={item.institution}>
                            <div className="education-card__marker">
                                <span>{String(index + 1).padStart(2, "0")}</span>
                            </div>

                            <div className="education-card__content">
                                <div className="education-card__header">
                                    <div>
                                        <h3>{item.institution}</h3>
                                        <p>{item.degree}</p>
                                    </div>
                                    <span>{item.dates}</span>
                                </div>

                                <p className="education-card__subject">
                                    {item.subject}
                                </p>

                                <div className="education-card__grade">
                                    <span>Result</span>
                                    <strong>{item.grade}</strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
