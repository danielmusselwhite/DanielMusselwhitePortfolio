const experienceItems = [
    {
        role: "Software Engineer",
        company: "Websure · Sheraton Systems Ltd",
        dates: "Aug 2026 — Present",
        location: "Wickford, England · Hybrid",
        summary:
            "Building dependable software for a specialist insurance platform, with a focus on maintainable systems and thoughtful delivery.",
        highlights: [
            "Designing and delivering features across a production software platform.",
            "Working closely with the wider team to turn domain needs into practical technical solutions.",
        ],
    },
    {
        role: "Intermediate Software Engineer",
        company: "GAMIT",
        dates: "Dec 2024 — Jul 2026",
        location: "Stansted Mountfitchet, England · On-site",
        summary:
            "Led development of the RDOC platform across desktop, web, APIs, data, testing, and deployment.",
        highlights: [
            "Led the design, development, deployment, and maintenance of a WPF application while working directly with customers.",
            "Built .NET, Blazor, REST API, SQL, and Azure Blob Storage solutions with authentication and role-based access control.",
            "Improved team delivery through automated testing, architecture discussions, engineering standards, and mentoring.",
        ],
    },
    {
        role: "Technical Specialist",
        company: "SS&C Technologies",
        dates: "Sep 2022 — Dec 2024",
        location: "Basildon, England · Hybrid",
        summary:
            "Delivered features and automation for large-scale financial software across development, testing, and CI/CD.",
        highlights: [
            "Created Python and PowerShell tools that improved team workflows and reduced repetitive work.",
            "Built automated tests for backend services, SOAP APIs, and browser-based interfaces.",
            "Configured Jenkins pipelines with Groovy to automate testing and deployment processes.",
        ],
    },
];

export default function Experience() {
    return (
        <section id="experience" className="section">
            <div className="section__content">
                <div className="experience__heading">
                    <p className="section__eyebrow">04 / Experience</p>
                    <h2>A track record of building and improving systems.</h2>
                    <p>
                        Roles spanning product development, architecture,
                        automation, testing, and the engineering practices that
                        help teams deliver with confidence.
                    </p>
                </div>

                <div className="experience-list">
                    {experienceItems.map((item, index) => (
                        <article className="experience" key={item.company}>
                            <div className="experience__marker">
                                <span>{String(index + 1).padStart(2, "0")}</span>
                            </div>

                            <div className="experience__content">
                                <div className="experience__header">
                                    <div>
                                        <h3>{item.role}</h3>
                                        <p>{item.company}</p>
                                    </div>

                                    <span>{item.dates}</span>
                                </div>

                                <p className="experience__meta">{item.location}</p>
                                <p className="experience__summary">{item.summary}</p>

                                <ul className="experience__highlights">
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