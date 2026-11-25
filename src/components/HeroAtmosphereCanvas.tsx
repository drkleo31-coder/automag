import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  isCrimson: boolean;
}

export function HeroAtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let isVisible = true;
    let lastDraw = 0;
    let particles: Particle[] = [];

    const initParticles = () => {
      const count = width < 640 ? 18 : 34;
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.4,
        radius: 1 + Math.random() * 1.8,
        alpha: 0.18 + Math.random() * 0.42,
        isCrimson: i % 3 === 0,
      }));
    };

    const resize = () => {
      const dpr = 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (width <= 0 || height <= 0) return;
      pointerRef.current = {
        x: e.clientX / width,
        y: e.clientY / height,
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx + (pointerRef.current.x - 0.5) * 0.25;
          p.y += p.vy;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isCrimson
          ? `rgba(225, 6, 0, ${p.alpha})`
          : `rgba(255, 255, 255, ${p.alpha * 0.65})`;
        ctx.fill();
      }
    };

    const loop = (ts: number) => {
      if (isVisible && document.visibilityState === 'visible' && ts - lastDraw >= 45) {
        lastDraw = ts;
        drawParticles();
      }
      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    drawParticles();
    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="hero-atmosphere-canvas"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
