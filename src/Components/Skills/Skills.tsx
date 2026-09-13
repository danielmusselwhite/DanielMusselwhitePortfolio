const expertise = [
  {
    number: "01",
    title: "Applications, end to end.",
    text: "From customer requirements to the interface and the services behind it. Clear boundaries, useful features, and maintainable code.",
    skills: ["C# / .NET", "React / TypeScript", "Python", "WPF / Blazor"],
  },
  {
    number: "02",
    title: "Systems that work together.",
    text: "Service boundaries, asynchronous workflows, data ownership, and the trade-offs that come with building distributed software.",
    skills: ["ASP.NET Core", "Service Bus / RabbitMQ", "SQL / NoSQL", "Redis"],
  },
  {
    number: "03",
    title: "Built to be delivered.",
    text: "Infrastructure, automated tests, and deployment are part of the product. I enjoy taking responsibility for the whole journey.",
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
