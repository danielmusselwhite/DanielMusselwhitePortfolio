import "./App.css";

import { useEffect, useRef, useState } from "react";

import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Education from "./Components/Education/Education";
import Experience from "./Components/Experience/Experience";
import Hero from "./Components/Hero/Hero";
import Navbar from "./Components/Navbar/Navbar";
import Projects from "./Components/Projects/Projects";
import Skills from "./Components/Skills/Skills";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pointerRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const glowRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const themeRef = useRef(theme);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme", theme);
    document.documentElement.style.colorScheme = theme;
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
    };

    const handlePointerLeave = () => {
      pointerRef.current.x = window.innerWidth / 2;
      pointerRef.current.y = window.innerHeight / 2;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return undefined;
    }

    let animationFrameId = 0;
    let particles: Particle[] = [];

    // Calculate particle count ONCE using the viewport size
    // from when the page initially loads.
    const initialArea = window.innerWidth * window.innerHeight;

    const particleCount = Math.max(
      20,
      Math.min(900, Math.round(initialArea / 20000)),
    );

    const setupParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.8 + 0.2,
      }));
    };

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      glowRef.current.x = pointerRef.current.x;
      glowRef.current.y = pointerRef.current.y;

      // Important:
      // Do NOT call setupParticles() here.
      // This keeps the particle count unchanged when resizing.
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      glowRef.current.x +=
        (pointerRef.current.x - glowRef.current.x) * 0.08;

      glowRef.current.y +=
        (pointerRef.current.y - glowRef.current.y) * 0.08;

      document.documentElement.style.setProperty(
        "--pointer-x",
        `${glowRef.current.x}px`,
      );

      document.documentElement.style.setProperty(
        "--pointer-y",
        `${glowRef.current.y}px`,
      );

      ctx.clearRect(0, 0, width, height);

      // Light mode inverts the palette:
      // dark particles/accents on a light backdrop.
      const particleRgb =
        themeRef.current === "light" ? "15, 135, 113" : "110, 231, 209";

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }

        const dx = particle.x - glowRef.current.x;
        const dy = particle.y - glowRef.current.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance < 180) {
          particle.x += (dx / distance) * 0.7;
          particle.y += (dy / distance) * 0.7;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${particleRgb}, ${particle.alpha})`;
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 110) {
            const opacity = (1 - distance / 110) * 0.45;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${particleRgb}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const glowSize = 140;

      const glowGradient = ctx.createRadialGradient(
        glowRef.current.x,
        glowRef.current.y,
        0,
        glowRef.current.x,
        glowRef.current.y,
        glowSize,
      );

      glowGradient.addColorStop(
        0,
        `rgba(${particleRgb}, 0.22)`,
      );

      glowGradient.addColorStop(
        0.5,
        `rgba(${particleRgb}, 0.08)`,
      );

      glowGradient.addColorStop(
        1,
        `rgba(${particleRgb}, 0)`,
      );

      ctx.beginPath();
      ctx.fillStyle = glowGradient;

      ctx.arc(
        glowRef.current.x,
        glowRef.current.y,
        glowSize,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      animationFrameId = window.requestAnimationFrame(draw);
    };

    // Resize the canvas first, then create the particles once.
    resizeCanvas();
    setupParticles();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".section");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      sections.forEach((section) =>
        section.classList.add("section--visible"),
      );

      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`site-shell site-shell--${theme}`}>
      <div
        className="background-grid"
        aria-hidden="true"
      />

      <div
        className="background-glow background-glow--one"
        aria-hidden="true"
      />

      <div
        className="background-glow background-glow--two"
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        className="particle-canvas"
        aria-hidden="true"
      />

      <div className="site-content">
        <Navbar
          theme={theme}
          onToggleTheme={() => {
            setTheme((current) =>
              current === "dark" ? "light" : "dark",
            );
          }}
        />

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </main>

        <footer className="footer">
          <p>
            © {new Date().getFullYear()} Daniel Musselwhite
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;