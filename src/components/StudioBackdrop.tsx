import { useEffect, useRef } from 'react';

/**
 * Ambient studio lighting backdrop:
 * - Subtle crimson reflection following cursor movement smoothly (lerped via on-demand rAF)
 * - Depth light planes with independent scroll parallax
 * - Zero React re-renders during scroll/pointer interaction and zero idle rAF ticks
 */
export function StudioBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const topLightRef = useRef<HTMLDivElement | null>(null);
  const sideLightRef = useRef<HTMLDivElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let targetX = 50;
    let targetY = 30;
    let currentX = 50;
    let currentY = 30;
    let currentScroll = window.scrollY || 0;
    let targetScroll = currentScroll;
    let rafId = 0;

    const applyStyles = () => {
      root.style.setProperty('--spot-x', `${currentX.toFixed(2)}%`);
      root.style.setProperty('--spot-y', `${currentY.toFixed(2)}%`);

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));

      if (topLightRef.current) {
        const yOffset = -progress * 110;
        const xOffset = Math.sin(progress * Math.PI) * 32;
        topLightRef.current.style.transform = `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0)`;
        topLightRef.current.style.opacity = String((0.11 + Math.sin(progress * Math.PI) * 0.05).toFixed(3));
      }

      if (sideLightRef.current) {
        const yOffset = progress * 90;
        const xOffset = -Math.cos(progress * Math.PI) * 28;
        sideLightRef.current.style.transform = `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0)`;
      }

      if (beamRef.current) {
        const yOffset = -progress * 70;
        beamRef.current.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0) rotate(-14deg)`;
      }
    };

    const tick = () => {
      rafId = 0;
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const ds = targetScroll - currentScroll;

      currentX += dx * 0.16;
      currentY += dy * 0.16;
      currentScroll += ds * 0.28;

      applyStyles();

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(ds) > 0.8) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentX = targetX;
        currentY = targetY;
        currentScroll = targetScroll;
        applyStyles();
      }
    };

    const scheduleTick = () => {
      if (!rafId && !reducedMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion || !finePointer) return;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      targetX = Math.max(0, Math.min(100, (e.clientX / vw) * 100));
      targetY = Math.max(0, Math.min(100, (e.clientY / vh) * 100));
      scheduleTick();
    };

    const handleScroll = () => {
      if (reducedMotion) return;
      targetScroll = window.scrollY || 0;
      scheduleTick();
    };

    applyStyles();

    if (!reducedMotion) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-testid="studio-backdrop"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {/* Layer 1: Scroll-reactive upper crimson studio dome */}
      <div
        ref={topLightRef}
        className="absolute -right-28 -top-32 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.32)_0%,rgba(225,6,0,0.05)_46%,transparent_72%)] opacity-[0.07]"
      />

      {/* Layer 2: Independent counter-moving lower cool metallic ambient wash */}
      <div
        ref={sideLightRef}
        className="absolute -bottom-32 -left-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.035)_0%,rgba(225,6,0,0.04)_48%,transparent_74%)]"
      />

      {/* Layer 3: Subtle cursor-following crimson studio reflection */}
      <div
        className="hidden md:block absolute inset-0"
        style={{
          background:
            'radial-gradient(480px circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(225, 6, 0, 0.065), rgba(225, 6, 0, 0.015) 45%, transparent 72%)',
        }}
      />

      {/* Layer 4: Architectural diagonal studio light strip moving independently on scroll */}
      <div
        ref={beamRef}
        className="absolute left-1/4 top-[38%] h-px w-[65vw] bg-gradient-to-r from-transparent via-[#E10600]/15 to-transparent"
      />
    </div>
  );
}
