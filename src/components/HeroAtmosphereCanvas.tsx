import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  radius: number;
  alpha: number;
  isCrimson: boolean;
}

export function HeroAtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const scrollBoostRef = useRef(0);

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
    let lastScrollY = window.scrollY || 0;
    let particles: Particle[] = [];

    const initParticles = () => {
      const count = width < 640 ? 20 : 38;
      particles = Array.from({ length: count }, (_, i) => {
        const depth = 0.45 + (i % 3) * 0.35;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28 * depth,
          vy: (-0.16 - Math.random() * 0.32) * depth,
          depth,
          radius: (0.85 + Math.random() * 1.45) * depth,
          alpha: 0.14 + Math.random() * 0.36,
          isCrimson: i % 3 === 0,
        };
      });
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

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;
      scrollBoostRef.current = Math.max(-2.2, Math.min(2.2, delta * 0.04));
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
    window.addEventListener('scroll', handleScroll, { passive: true });

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      scrollBoostRef.current *= 0.88;
      const pointerDriftX = (pointerRef.current.x - 0.5) * 0.28;
      const pointerDriftY = (pointerRef.current.y - 0.5) * 0.14;

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx + pointerDriftX * p.depth;
          p.y += p.vy + pointerDriftY * p.depth - scrollBoostRef.current * p.depth;

          if (p.y < -12) {
            p.y = height + 12;
            p.x = Math.random() * width;
          } else if (p.y > height + 12) {
            p.y = -12;
          }
          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isCrimson
          ? `rgba(225, 6, 0, ${p.alpha})`
          : `rgba(255, 255, 255, ${p.alpha * 0.62})`;
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
      window.removeEventListener('scroll', handleScroll);
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
