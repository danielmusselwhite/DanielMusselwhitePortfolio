interface SkillGroup {
    title: string;
    description: string;
    skills: string[];
}

const skillGroups: SkillGroup[] = [
    {
        title: "Languages",
        description: "The tools I use to model ideas and build applications.",
        skills: ["C#", "Python", "TypeScript"],
    },
    {
        title: "Frontend",
        description: "Interfaces that make complex workflows feel clear.",
        skills: ["Blazor", "WPF", "React"],
    },
    {
        title: "Backend",
        description: "Services and APIs designed for reliable behaviour.",
        skills: ["ASP.NET Core"],
    },
    {
        title: "Databases",
        description: "Choosing the right shape for data and its access patterns.",
        skills: ["PostgreSQL", "MySQL", "SQLServer", "MongoDB"],
    },
    {
        title: "Infrastructure & DevOps",
        description: "The automation and cloud foundations behind the system.",
        skills: ["Docker", "Kubernetes", "Azure", "Bicep", "GitHub Actions"],
    },
];

const coreSkillGroups = skillGroups.slice(0, 3);
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
                    <h2>A practical stack for building end to end.</h2>
                    <p>
                        I work across the application boundary, from typed
                        interfaces and APIs to data, deployment, and the cloud
                        infrastructure that keeps everything running.
                    </p>
                </div>

                <div className="skills__bands">
                    <div className="skills__band">
                        <div className="skills__band-heading">
                            <span>01</span>
                            <h3>Core application</h3>
                            <p>Where ideas become working software.</p>
                        </div>
                        <div className="skills-grid skills-grid--core">
                            {coreSkillGroups.map((group, index) => (
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
                            <h3>Data &amp; delivery</h3>
                            <p>How applications are stored, shipped, and run.</p>
                        </div>
                        <div className="skills-grid skills-grid--platform">
                            {platformSkillGroups.map((group, index) => (
                                <SkillGroupCard
                                    key={group.title}
                                    group={group}
                                    index={index + coreSkillGroups.length}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}