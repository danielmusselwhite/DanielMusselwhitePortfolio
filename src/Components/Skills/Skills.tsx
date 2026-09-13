const expertise = [
  {
    number: "01",
    title: "From a question to a feature",
    text: "At GAMIT, I worked directly with customers on RDOC. That meant understanding what they needed, building it, and supporting it after release.",
    skills: ["C# / .NET", "React / TypeScript", "Angular", "WPF / Blazor"],
  },
  {
    number: "02",
    title: "Understanding the pieces",
    text: "CommerceFabric is where I explore how services communicate and own their data. IncidentIQ takes that further with queued analysis jobs and retrieval for AI responses.",
    skills: ["ASP.NET Core", "Service Bus / RabbitMQ", "SQL / NoSQL", "Redis"],
  },
  {
    number: "03",
    title: "The work around the code",
    text: "At SS&C, I worked on Jenkins pipelines and test automation alongside application changes. At Websure, that work includes Azure infrastructure and Bicep.",
    skills: [
      "Azure / Kubernetes",
      "Docker / Bicep",
      "GitHub Actions / Jenkins",
      "xUnit / PyTest",
    ],
  },
];
export default function Skills() {
  return (
    <div id="skills" className="expertise-grid">
      {expertise.map((item) => (
        <article key={item.number}>
          <span className="expertise-number">{item.number} /</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <ul>
            {item.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
