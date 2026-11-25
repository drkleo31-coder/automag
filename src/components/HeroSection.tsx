import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, MapPin, MessageCircle } from 'lucide-react';
import {
  BUSINESS_CITY,
  HERO_CAR_IMAGE_PATH,
  WHATSAPP_URL,
  computePointerParallax,
} from '../utils/automag';
import { HeroAtmosphereCanvas } from './HeroAtmosphereCanvas';
import { BrandLogo } from './BrandLogo';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [cursorGlow, setCursorGlow] = useState({ x: 58, y: 46 });
  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.15]);
  const lightLayerY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const rimLayerY = useTransform(scrollYProgress, [0, 1], ['0%', '26%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -32]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    setPointerOffset(
      computePointerParallax(
        e.clientX - rect.left,
        e.clientY - rect.top,
        rect.width,
        rect.height,
        12
      )
    );
    setCursorGlow({
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setPointerOffset({ x: 0, y: 0 });
        setCursorGlow({ x: 58, y: 46 });
      }}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-[#050507] pb-14 pt-28 sm:items-center sm:pb-20 sm:pt-32"
    >
      {/* Layer 1: Background Automotive Studio Scene with Scroll & Pointer Parallax */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: bgY, scale: bgScale }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-out"
          style={
            shouldReduceMotion
              ? undefined
              : { transform: `translate3d(${-pointerOffset.x}px, ${-pointerOffset.y}px, 0)` }
          }
        >
          {!imgError ? (
            <img
              src={HERO_CAR_IMAGE_PATH}
              alt="Veículo esportivo escuro sob iluminação vermelha de estúdio na Auto Mag"
              className="h-full w-full object-cover object-center opacity-85"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_60%_45%,rgba(225,6,0,0.28),#050507_70%)]" />
          )}
        </div>

        {/* Measured Contrast Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/95 via-[#050507]/72 to-[#050507]/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/75" />

        {/* Subtle Animated Studio Reflection Sweep */}
        <div className="absolute inset-0 overflow-hidden opacity-35">
          <div className="animate-specular-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#E10600]/20 to-transparent" />
        </div>
      </motion.div>

      {/* Layer 2: Independent Depth Lighting Planes reacting to scroll & cursor */}
      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { y: lightLayerY }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(460px circle at ${cursorGlow.x}% ${cursorGlow.y}%, rgba(225, 6, 0, 0.16), transparent 68%)`,
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { y: rimLayerY }}
        className="pointer-events-none absolute inset-x-0 top-[22%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Layer 3: Canvas Atmosphere Particles */}
      <HeroAtmosphereCanvas />

      {/* Layer 4: Main Hero Content */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          {/* Animated Logo Reveal */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-6 inline-block"
          >
            <BrandLogo size="hero" />
          </motion.div>

          {/* Clean unboxed location kicker */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wider text-zinc-300 sm:text-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-[#E10600]" aria-hidden="true" />
            <span>{BUSINESS_CITY}</span>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <span className="text-zinc-400">Estética Automotiva</span>
          </motion.div>

          {/* Impactful Display Headline */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ textWrap: 'balance' }}
          >
            Cuidado, brilho e atenção em cada detalhe.
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            Lavagem simples, completa ou com cera, higienização de bancos e polimentos para cuidar
            da aparência do seu veículo.
          </motion.p>

          {/* Primary Action & Secondary Anchor */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex min-h-[48px] items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#E10600] px-6 py-3 text-sm font-semibold tracking-wide text-white whitespace-nowrap shadow-[0_0_28px_rgba(225,6,0,0.35)] transition-all duration-150 hover:bg-[#ff1a14] active:scale-[0.98]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[320%]"
              />
              <MessageCircle className="relative h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative">Agendar pelo WhatsApp</span>
            </a>

            <a
              href="#transformacao"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 whitespace-nowrap backdrop-blur-sm transition-colors duration-150 hover:border-white/35 hover:bg-white/10 hover:text-white"
            >
              <span>Ver transformação</span>
              <ArrowDown className="h-4 w-4 text-[#E10600]" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
