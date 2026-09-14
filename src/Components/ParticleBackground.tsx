import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number };

/** A persistent particle field, independent of mobile browser chrome and theme changes. */
export default function ParticleBackground({ theme }: { theme: "dark" | "light" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rgbRef = useRef("");
  const repaintRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    rgbRef.current = theme === "dark" ? "110,231,209" : "15,135,113";
    repaintRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0, height = 0, boundsWidth = 0, boundsHeight = 0;
    let frame = 0, lastTime = 0;
    const particles: Particle[] = [];

    function paint() {
      context!.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        context!.beginPath(); context!.fillStyle = `rgba(${rgbRef.current},.65)`;
        context!.arc(p.x, p.y, 1.8, 0, Math.PI * 2); context!.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance > 130) continue;
          context!.beginPath(); context!.strokeStyle = `rgba(${rgbRef.current},${(1 - distance / 130) * .24})`;
          context!.moveTo(p.x, p.y); context!.lineTo(q.x, q.y); context!.stroke();
        }
      });
    }

    function resize() {
      // Measure the stable CSS surface, not innerHeight (which changes as phone chrome moves).
      const rect = canvas!.getBoundingClientRect();
      const nextWidth = Math.round(rect.width), nextHeight = Math.round(rect.height);
      if (!nextWidth || !nextHeight) return;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.round(nextWidth * ratio), pixelHeight = Math.round(nextHeight * ratio);
      if (width === nextWidth && height === nextHeight &&
          canvas!.width === pixelWidth && canvas!.height === pixelHeight) return;
      width = nextWidth; height = nextHeight;
      // Keep world coordinates on shrink: offscreen particles can return naturally.
      boundsWidth = Math.max(boundsWidth, width);
      boundsHeight = Math.max(boundsHeight, height);
      canvas!.width = pixelWidth; canvas!.height = pixelHeight;
      context!.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
      if (!particles.length) {
        const count = Math.min(75, Math.max(20, Math.round(width * height / 18000)));
        for (let i = 0; i < count; i++) particles.push({
          x: Math.random() * width, y: Math.random() * height,
          vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
        });
      }
      // Canvas resizing clears the bitmap. Repaint synchronously without advancing time.
      paint();
    }

    function draw(time: number) {
      const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 0;
      lastTime = time;
      if (!motion.matches) particles.forEach(p => {
        p.x += p.vx * delta; p.y += p.vy * delta;
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 150) { p.x += dx / distance * delta; p.y += dy / distance * delta; }
        if (p.x < 0 || p.x > boundsWidth) p.vx *= -1;
        if (p.y < 0 || p.y > boundsHeight) p.vy *= -1;
        p.x = Math.max(0, Math.min(boundsWidth, p.x));
        p.y = Math.max(0, Math.min(boundsHeight, p.y));
      });
      paint();
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function restart() {
      cancelAnimationFrame(frame); lastTime = 0;
      if (!document.hidden) {
        paint();
        if (!motion.matches) frame = requestAnimationFrame(draw);
      }
    }
    function move(event: PointerEvent) {
      if (event.pointerType === "mouse") { pointer.x = event.clientX; pointer.y = event.clientY; }
    }
    function reset() { pointer.x = -1000; pointer.y = -1000; }
    repaintRef.current = paint;
    resize();
    restart();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      repaintRef.current = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
