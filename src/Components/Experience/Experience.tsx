const experienceItems = [
  {
    role: "Software Engineer",
    company: "Websure · Sheraton Systems Ltd",
    dates: "Aug 2026 - Present",
    location: "Wickford, England · Hybrid",
    summary:
      "Modernising a legacy Delphi insurance platform toward domain-focused APIs and services on Azure.",
    highlights: [
      "Designing APIs and helping separate legacy functionality into business domains as part of an ongoing platform modernisation.",
      "Developing Azure infrastructure with Bicep and CI/CD pipelines to support automated builds, testing, and deployment.",
    ],
  },
  {
    role: "Intermediate Software Engineer",
    company: "GAMIT",
    dates: "Dec 2024 - Jul 2026",
    location: "Stansted Mountfitchet, England · On-site",
    summary:
      "Led development of RDOC, a WPF application for aviation, working directly with customers from requirements through release and support.",
    highlights: [
      "Turned customer requirements into technical designs and delivered features, owning implementation, deployment, and ongoing maintenance.",
      "Built full-stack .NET applications using WPF, Blazor, ASP.NET Core, EF Core, REST APIs, SQL, and Azure Blob Storage.",
      "Implemented authentication and role-based access control using FusionAuth SSO, token-based API authorization, and custom permission attributes.",
      "Wrote xUnit and FlaUI tests, contributed to code reviews and team standards, and mentored junior engineers.",
    ],
  },
  {
    role: "Technical Specialist",
    company: "SS&C Technologies",
    dates: "Sep 2022 - Dec 2024",
    location: "Basildon, England · Hybrid",
    summary:
      "Developed features, engineering tools, automated tests, and CI/CD infrastructure for large-scale financial software.",
    highlights: [
      "Built internal Python and PowerShell tooling to automate repetitive engineering workflows, including a development environment for Drools-based files.",
      "Created PyTest suites covering backend services and SOAP APIs alongside Selenium-based browser testing.",
      "Configured Jenkins CI/CD pipelines using Groovy and Python to automate testing, promotion, and deployment workflows.",
    ],
  },
];

export default function Experience() {
  return (
    <section className="section">
      <div className="section__content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / Experience</p>
            <h2>Where I’ve worked</h2>
          </div>
          <p>
            From engineering tools and CI/CD at SS&C to leading RDOC development
            at GAMIT and now modernising insurance software at Websure.
            Increasing ownership across design, implementation, and delivery.
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
