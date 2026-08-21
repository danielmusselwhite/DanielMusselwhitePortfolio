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

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("portfolio-theme") === "light"
    ? "light"
    : "dark";
}

function getViewportCentre() {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(getViewportCentre());
  const glowRef = useRef(getViewportCentre());
  const themeRef = useRef(theme);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme", theme);
    document.documentElement.style.colorScheme = theme;
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    const loader = document.getElementById("boot-loader");

    let secondFrameId = 0;
    let removalTimerId = 0;

    const removeLoader = () => {
      loader?.remove();
    };

    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        html.classList.add("app-ready");

        if (loader) {
          loader.addEventListener("transitionend", removeLoader, {
            once: true,
          });

          // Fallback for browsers that skip transitionend.
          removalTimerId = window.setTimeout(removeLoader, 900);
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      window.clearTimeout(removalTimerId);
      loader?.removeEventListener("transitionend", removeLoader);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
    };

    const resetPointer = () => {
      pointerRef.current.x = window.innerWidth / 2;
      pointerRef.current.y = window.innerHeight / 2;
    };

    let pointerListenerAttached = false;

    const attachPointerListener = () => {
      if (!finePointer.matches || pointerListenerAttached) {
        return;
      }

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      pointerListenerAttached = true;
    };

    const detachPointerListener = () => {
      if (!pointerListenerAttached) {
        return;
      }

      window.removeEventListener("pointermove", handlePointerMove);
      pointerListenerAttached = false;
    };

    const handlePointerCapabilityChange = () => {
      if (finePointer.matches) {
        attachPointerListener();
      } else {
        detachPointerListener();
        resetPointer();
      }
    };

    attachPointerListener();
    window.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    finePointer.addEventListener("change", handlePointerCapabilityChange);

    return () => {
      detachPointerListener();
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      finePointer.removeEventListener(
        "change",
        handlePointerCapabilityChange,
      );
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true });

    if (!ctx) {
      return undefined;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointer = window.matchMedia("(pointer: fine)");
    const mobileViewport = window.matchMedia("(max-width: 768px)");

    let animationFrameId: number | null = null;
    let resizeFrameId: number | null = null;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let running = !document.hidden;
    let lastFrameTime = 0;

    const initialArea = width * height;
    const particleCount = Math.max(
      20,
      Math.min(900, Math.round(initialArea / 20000)),
    );

    const getFrameInterval = () => {
      if (reducedMotion.matches) {
        return 1000 / 15;
      }

      return mobileViewport.matches ? 1000 / 30 : 1000 / 60;
    };

    const setupParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.8 + 0.2,
      }));
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      // Decorative canvases do not need full phone DPR. A DPR of 3 can turn a
      // 390x844 viewport into a roughly 1170x2532 canvas every frame.
      const ratio = mobileViewport.matches
        ? 1
        : Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      if (!finePointer.matches) {
        pointerRef.current.x = width / 2;
        pointerRef.current.y = height / 2;
      }

      glowRef.current.x = pointerRef.current.x;
      glowRef.current.y = pointerRef.current.y;
    };

    const requestNextFrame = () => {
      if (!running || animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    const draw = (timestamp: number) => {
      animationFrameId = null;

      if (!running) {
        return;
      }

      const frameInterval = getFrameInterval();

      if (timestamp - lastFrameTime < frameInterval) {
        requestNextFrame();
        return;
      }

      lastFrameTime = timestamp;

      glowRef.current.x +=
        (pointerRef.current.x - glowRef.current.x) * 0.08;
      glowRef.current.y +=
        (pointerRef.current.y - glowRef.current.y) * 0.08;

      // The CSS cursor glow is useful on desktop, but touch devices do not have
      // a continuously moving cursor. Leave it centred on coarse-pointer devices.
      document.documentElement.style.setProperty(
        "--pointer-x",
        `${glowRef.current.x}px`,
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        `${glowRef.current.y}px`,
      );

      ctx.clearRect(0, 0, width, height);

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

        if (finePointer.matches && distance < 180) {
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

      const glowSize = mobileViewport.matches ? 105 : 140;
      const glowGradient = ctx.createRadialGradient(
        glowRef.current.x,
        glowRef.current.y,
        0,
        glowRef.current.x,
        glowRef.current.y,
        glowSize,
      );

      glowGradient.addColorStop(0, `rgba(${particleRgb}, 0.22)`);
      glowGradient.addColorStop(0.5, `rgba(${particleRgb}, 0.08)`);
      glowGradient.addColorStop(1, `rgba(${particleRgb}, 0)`);

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

      requestNextFrame();
    };

    const handleResize = () => {
      if (resizeFrameId !== null) {
        return;
      }

      resizeFrameId = window.requestAnimationFrame(() => {
        resizeFrameId = null;
        resizeCanvas();
      });
    };

    const handleVisibilityChange = () => {
      running = !document.hidden;

      if (!running) {
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      lastFrameTime = 0;
      requestNextFrame();
    };

    const handlePointerCapabilityChange = () => {
      if (!finePointer.matches) {
        pointerRef.current.x = width / 2;
        pointerRef.current.y = height / 2;
      }
    };

    resizeCanvas();
    setupParticles();
    requestNextFrame();

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    finePointer.addEventListener("change", handlePointerCapabilityChange);

    return () => {
      running = false;

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
      }

      window.removeEventListener("resize", handleResize);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      finePointer.removeEventListener(
        "change",
        handlePointerCapabilityChange,
      );
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
      <div className="background-grid" aria-hidden="true" />

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
          <p>© {new Date().getFullYear()} Daniel Musselwhite</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
