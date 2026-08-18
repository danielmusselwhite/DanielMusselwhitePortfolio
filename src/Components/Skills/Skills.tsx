interface SkillGroup {
    title: string;
    skills: string[];
}

const skillGroups: SkillGroup[] = [
    {
        title: "Languages",
        skills: ["C#", "Python", "TypeScript"],
    },
    {
        title: "Frontend",
        skills: ["Blazor", "WPF", "React", "Angular"],
    },
    {
        title: "Backend",
        skills: ["ASP.NET Core", "Node.js"],
    },
    {
        title: "Databases",
        skills: ["PostgreSQL", "MySQL", "SQLServer", "MongoDB"],
    },
    {
        title: "Infrastructure & DevOps",
        skills: ["Docker", "Kubernetes", "Azure", "Bicep IaC", "GitHub Actions"],
    },
];

export default function Skills() {
    return (
        <section id="skills" className="section">
            <div className="section__content">
                <p className="section__eyebrow">Technologies</p>

                <h2>Tech Stack</h2>

                <div className="skills-grid">
                    {skillGroups.map((group) => (
                        <article key={group.title} className="skill-group">
                            <h3>{group.title}</h3>

                            <div className="skill-group__items">
                                {group.skills.map((skill) => (
                                    <span key={skill} className="skill">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}