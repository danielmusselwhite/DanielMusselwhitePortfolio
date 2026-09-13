import { useEffect, useState } from "react";
import AiAssistant from "./Components/Hero/AiAssistant/AiAssistant";
import Experience from "./Components/Experience/Experience";
import Education from "./Components/Education/Education";
import { loadProjects } from "./Utils/loadProjects";
import WorkbenchProject from "./Components/Projects/WorkbenchProject";
import ProjectFeature from "./Components/Projects/ProjectFeature";
import CurrentlyBuilding from "./Components/Projects/CurrentlyBuilding";
import ParticleBackground from "./Components/ParticleBackground";
import "./App.css";
import "./styles/Comic.css";
import "./styles/Sections.css";

// Retain project assets and metadata so these can be restored later.
const hiddenProjects = new Set(["Activity Web App", "Developer Portfolio"]);
const projects = loadProjects().filter(project => !hiddenProjects.has(project.title));
const expertise = [
  {
    number: "01",
    title: "Applications, end to end.",
    text: "From customer requirements to the interface and the services behind it. Clear boundaries, useful features, and maintainable code.",
    skills: ["C# / .NET", "React / TypeScript", "Angular", "WPF / Blazor"],
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

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* Theme still works without storage. */
    }
  }, [theme]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <div className={`site-shell site-shell--${theme}`}>
      <ParticleBackground theme={theme} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a
          href="#home"
          className="wordmark"
          aria-label="Daniel Musselwhite home"
        >
          dm<span>.</span>
        </a>
        <nav
          id="navigation"
          className={menuOpen ? "nav-links is-open" : "nav-links"}
          aria-label="Primary navigation"
        >
          {[
            ["building", "Building"],
            ["projects", "Projects"],
            ["about", "Approach"],
            ["experience", "Experience"],
            ["education", "Education"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <a
            className="header-github"
            href="https://github.com/danielmusselwhite"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            aria-controls="navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <main id="main">
        <div id="home" className="section-band">
        <section className="intro container">
          <div className="intro-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Daniel Musselwhite · Software
              Engineer
            </p>
            <h1>
              Big ideas.
              <br />
              Real systems.
              <br />
              <em>Built with curiosity.</em>
            </h1>
            <p className="intro-description">
              I’m a software engineer working across .NET, Azure and React.
              My commercial work spans finance, aviation and insurance; my
              personal projects explore distributed systems and applied AI.
            </p>
            <div className="intro-actions">
              <a className="button button-primary" href="#projects">
                Explore my work <span aria-hidden="true">↓</span>
              </a>
              <a className="text-link" href="#contact">
                Let’s talk <Arrow />
              </a>
            </div>
            <div className="intro-footnote">
              <span>BASED IN THE UK</span>
              <span>BUILDING ACROSS THE STACK</span>
            </div>
          </div>
          <div className="assistant-stage">
            <div className="assistant-label">
              <span className="status-dot" /> MEET BLOOP
              <span>YOUR PORTFOLIO GUIDE</span>
            </div>
            <AiAssistant />
            <p className="assistant-note">
              A little personality. A lot to ask about.
            </p>
          </div>
        <div className="credentials">
          <p>
            Experience across
            <br />
            <strong>finance, aviation & insurance</strong>
          </p>
          <span>
            SS&C<span className="credential-sub">TECHNOLOGIES</span>
          </span>
          <span>GAMIT</span>
          <span>Websure</span>
          <p>
            Academic foundations
            <br />
            <strong>UCL & Nottingham</strong>
          </p>
        </div>
        </section>
        </div>
        <div id="building" className="section-band"><CurrentlyBuilding /></div>
        <div id="projects" className="section-band">
        <section className="work-section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Selected work</p>
              <h2>Ideas, engineered.</h2>
            </div>
            <p>
              Personal projects in cloud and desktop engineering.
              <br />
              Explore the code and the decisions behind it.
            </p>
          </div>
          {projects.filter(p => ["CommerceFabric", "DotNote"].includes(p.title)).map((project, index) => (
            <ProjectFeature key={project.slug} project={project} index={index + 1} />
          ))}
          <div className="more-work-heading">
            <h3>More from the workbench</h3>
            <span>EXPERIMENTS & SMALLER BUILDS</span>
          </div>
          <div className="more-work">
            {projects
              .filter((p) => !["CommerceFabric", "DotNote"].includes(p.title))
              .map((project) => (
                <WorkbenchProject key={project.slug} project={project} />
              ))}
          </div>
        </section>
        </div>
        <div id="about" className="section-band">
        <section className="approach-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / How I work</p>
                <h2>
                  The whole system
                  <br />
                  is the interesting part.
                </h2>
              </div>
              <p>
                I work across requirements, application code, testing and
                deployment. At GAMIT, I led RDOC from customer conversations
                through release; at Websure, I’m helping modernise a legacy
                insurance platform with APIs and Azure services.
              </p>
            </div>
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
          </div>
        </section>
        </div>
        <div id="experience" className="section-band"><Experience /></div>
        <div id="education" className="section-band"><Education /></div>
        <div id="contact" className="section-band">
        <section className="contact-section container">
          <p className="eyebrow">05 / Next conversation</p>
          <div className="contact-heading">
            <h2>
              Good software starts
              <br />
              with a conversation<span>.</span>
            </h2>
            <a
              className="contact-arrow"
              href="mailto:danielmusselwhite@outlook.com"
              aria-label="Email Daniel"
            >
              <Arrow />
            </a>
          </div>
          <div className="contact-socials">
            <a className="text-link" href="https://www.linkedin.com/in/daniel-musselwhite/" target="_blank" rel="noreferrer">Connect on LinkedIn <Arrow /></a>
          </div>
          <div className="contact-bottom">
            <p>
              Have an interesting engineering challenge or a role in mind?
              <br />
              I’d like to hear about it.
            </p>
            <a href="mailto:danielmusselwhite@outlook.com">
              danielmusselwhite@outlook.com <Arrow />
            </a>
          </div>
        </section>
        </div>
      </main>
      <footer className="site-footer container">
        <p>© {new Date().getFullYear()} Daniel Musselwhite</p>
        <span>Built with care. And a little help from Bloop.</span>
        <div>
          <a
            href="https://github.com/danielmusselwhite"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
          <a
            href="https://www.linkedin.com/in/daniel-musselwhite/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <Arrow />
          </a>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
