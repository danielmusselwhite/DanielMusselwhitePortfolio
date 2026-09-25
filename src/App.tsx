import { useEffect, useState } from "react";
import Hero from "./Components/Hero/Hero";
import Navbar from "./Components/Navbar/Navbar";
import Contributions from "./Components/Contributions/Contributions";
import Projects from "./Components/Projects/Projects";
import About from "./Components/About/About";
import Experience from "./Components/Experience/Experience";
import Education from "./Components/Education/Education";
import Contact from "./Components/Contact/Contact";
import ParticleBackground from "./Components/ParticleBackground";
import "./App.css";
import "./styles/Comic.css";
import "./styles/Sections.css";

type Theme = "dark" | "light";
const Arrow = () => <span aria-hidden="true">↗</span>;

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
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
      /* Storage is optional. */
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
      <Navbar
        theme={theme}
        menuOpen={menuOpen}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onToggleMenu={() => setMenuOpen((current) => !current)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      <main id="main">
        <Hero />
        <Projects />
        <Contributions />
        <About />
        <div id="experience" className="section-band">
          <Experience />
        </div>
        <div id="education" className="section-band">
          <Education />
        </div>
        <Contact />
      </main>
      <footer className="site-footer container">
        <p>© {new Date().getFullYear()} Daniel Musselwhite</p>
        <span>React, TypeScript, and Bloop.</span>
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
