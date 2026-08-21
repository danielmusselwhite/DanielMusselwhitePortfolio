import "./Experience.css";

const experienceItems = [
    {
        role: "Software Engineer",
        company: "Websure · Sheraton Systems Ltd",
        dates: "Aug 2026 — Present",
        location: "Wickford, England · Hybrid",
        summary:
            "Developing and maintaining software for a specialist insurance platform within a mature commercial codebase.",
        highlights: [
            "Delivering production features and improvements across an established insurance software platform.",
            "Working with the wider engineering team to understand domain requirements and translate them into maintainable technical solutions.",
        ],
    },
    {
        role: "Intermediate Software Engineer",
        company: "GAMIT",
        dates: "Dec 2024 — Jul 2026",
        location: "Stansted Mountfitchet, England · On-site",
        summary:
            "Led development of the RDOC platform, taking features from customer requirements and technical design through implementation, testing, deployment, and support.",
        highlights: [
            "Led the design, development, deployment, and maintenance of RDOC, working directly with customers to elicit requirements and turn them into technical designs and delivered features.",
            "Built full-stack .NET applications using WPF, Blazor, ASP.NET Core, EF Core, REST APIs, SQL, and Azure Blob Storage.",
            "Implemented authentication and role-based access control using FusionAuth SSO, token-based API authorization, and custom permission attributes.",
            "Improved engineering quality through xUnit and FlaUI test automation, UML-driven design, team standards, code review practices, and mentoring junior engineers.",
        ],
    },
    {
        role: "Technical Specialist",
        company: "SS&C Technologies",
        dates: "Sep 2022 — Dec 2024",
        location: "Basildon, England · Hybrid",
        summary:
            "Developed features, engineering tools, automated tests, and CI/CD infrastructure for large-scale financial software.",
        highlights: [
            "Designed, developed, and deployed production changes using Python, Java, JavaScript, and SQL within a large financial software platform.",
            "Built internal Python and PowerShell tooling to automate repetitive engineering workflows, including a development environment for Drools-based files.",
            "Created PyTest suites covering backend services and SOAP APIs alongside Selenium-based browser testing.",
            "Configured Jenkins CI/CD pipelines using Groovy and Python to automate testing, promotion, and deployment workflows.",
        ],
    },
];

export default function Experience() {
    return (
        <section id="experience" className="section">
            <div className="section__content">
                <div className="experience__heading">
                    <p className="section__eyebrow">04 / Experience</p>

                    <h2>Engineering software from requirements to release.</h2>

                    <p>
                        Commercial experience across system design, application
                        development, testing, automation, deployment, and the
                        engineering practices that keep software maintainable
                        as it evolves.
                    </p>
                </div>

                <div className="experience-list">
                    {experienceItems.map((item, index) => (
                        <article className="experience" key={item.company}>
                            <div className="experience__marker">
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            <div className="experience__content">
                                <div className="experience__header">
                                    <div>
                                        <h3>{item.role}</h3>
                                        <p>{item.company}</p>
                                    </div>

                                    <span>{item.dates}</span>
                                </div>

                                <p className="experience__meta">
                                    {item.location}
                                </p>

                                <p className="experience__summary">
                                    {item.summary}
                                </p>

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