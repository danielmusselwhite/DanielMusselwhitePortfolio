interface SkillGroup {
    title: string;
    description: string;
    skills: string[];
}

const skillGroups: SkillGroup[] = [
    {
        title: "Languages",
        description: "Languages I use across application and systems development.",
        skills: ["C#", "Python", "TypeScript", "Java", "SQL", "PowerShell"],
    },
    {
        title: "Application Development",
        description: "Building web, desktop, and service-based applications.",
        skills: ["ASP.NET Core", "WPF", "Blazor", "Angular", "React", "EF Core"],
    },
    {
        title: "Distributed Systems",
        description: "Connecting services while keeping boundaries and failures manageable.",
        skills: [
            "REST APIs",
            "RabbitMQ",
            "Azure Service Bus",
            "Redis",
            "Polly",
            "Ocelot",
        ],
    },
    {
        title: "Data",
        description: "Working across relational and document-oriented persistence.",
        skills: ["SQL Server", "PostgreSQL", "MySQL", "MongoDB"],
    },
    {
        title: "Cloud & DevOps",
        description: "Infrastructure and delivery from source control to production.",
        skills: [
            "Azure",
            "Docker",
            "Kubernetes",
            "Bicep",
            "GitHub Actions",
            "Azure DevOps Pipelines",
        ],
    },
    {
        title: "Testing",
        description: "Building confidence into systems through testing.",
        skills: [
            "xUnit",
            "NUnit",
            "PyTest",
            "FlaUI",
            "Selenium",
        ],
    },
    {
        title: "Identity & Authorization",
        description: "Managing identity and authorization in applications and systems.",
        skills: [
            "Microsoft Entra ID",
            "ASP.NET Identity",
            "FusionAuth",
            "OAuth 2.0",
            "OpenID Connect",
            "JWT",
        ],
    },
];

const applicationSkillGroups = skillGroups.slice(0, 3);
const platformSkillGroups = skillGroups.slice(3);

function SkillGroupCard({ group, index }: { group: SkillGroup; index: number }) {
    return (
        <article className="skill-group">
            <div className="skill-group__header">
                <span className="skill-group__index">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{group.title}</h3>
            </div>

            <p className="skill-group__description">{group.description}</p>

            <div className="skill-group__items">
                {group.skills.map((skill) => (
                    <span key={skill} className="skill">
                        {skill}
                    </span>
                ))}
            </div>
        </article>
    );
}

export default function Skills() {
    return (
        <section id="skills" className="section">
            <div className="section__content">
                <div className="skills__heading">
                    <p className="section__eyebrow">02 / Capabilities</p>

                    <h2>From application code to deployed systems.</h2>

                    <p>
                        I work across the software lifecycle, building
                        applications and APIs, designing service integrations,
                        working with data, and delivering systems through cloud
                        infrastructure and automated pipelines.
                    </p>
                </div>

                <div className="skills__bands">
                    <div className="skills__band">
                        <div className="skills__band-heading">
                            <span>01</span>
                            <h3>Applications &amp; architecture</h3>
                            <p>
                                The languages, frameworks, and patterns I use
                                to build software.
                            </p>
                        </div>

                        <div className="skills-grid skills-grid--core">
                            {applicationSkillGroups.map((group, index) => (
                                <SkillGroupCard
                                    key={group.title}
                                    group={group}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="skills__band">
                        <div className="skills__band-heading">
                            <span>02</span>
                            <h3>Data, cloud &amp; delivery</h3>
                            <p>
                                How I persist, test, secure, deploy, and
                                operate software.
                            </p>
                        </div>

                        <div className="skills-grid skills-grid--platform">
                            {platformSkillGroups.map((group, index) => (
                                <SkillGroupCard
                                    key={group.title}
                                    group={group}
                                    index={index + applicationSkillGroups.length}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}