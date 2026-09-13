import { useEffect, useRef } from "react";

/** Decorative particles: bounded cost, pointer interaction, and no motion when requested. */
export default function ParticleBackground({ theme }: { theme: "dark" | "light" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0, height = 0, frame = 0, lastTime = 0;
    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const rgb = theme === "dark" ? "110,231,209" : "15,135,113";

    function resize() {
      width = innerWidth; height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas!.width = width * ratio; canvas!.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(75, Math.max(20, Math.round(width * height / 18000))) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      }));
      restart();
    }
    function draw(time: number) {
      const delta = Math.min((time - lastTime) / 16.67 || 1, 2);
      lastTime = time;
      context!.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        if (!motion.matches) {
          p.x += p.vx * delta; p.y += p.vy * delta;
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 150) { p.x += dx / distance * delta; p.y += dy / distance * delta; }
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          p.x = Math.max(0, Math.min(width, p.x)); p.y = Math.max(0, Math.min(height, p.y));
        }
        context!.beginPath(); context!.fillStyle = `rgba(${rgb},.65)`;
        context!.arc(p.x, p.y, 1.8, 0, Math.PI * 2); context!.fill();
        particles.slice(i + 1).forEach(q => {
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance > 130) return;
          context!.beginPath(); context!.strokeStyle = `rgba(${rgb},${(1 - distance / 130) * .24})`;
          context!.moveTo(p.x, p.y); context!.lineTo(q.x, q.y); context!.stroke();
        });
      });
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function restart() { cancelAnimationFrame(frame); lastTime = 0; if (!document.hidden) frame = requestAnimationFrame(draw); }
    function move(event: PointerEvent) { if (event.pointerType === "mouse") { pointer.x = event.clientX; pointer.y = event.clientY; } }
    function reset() { pointer.x = -1000; pointer.y = -1000; }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
