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
  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPointerOffset(
      computePointerParallax(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height, 12)
    );
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointerOffset({ x: 0, y: 0 })}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-[#050507] pb-14 pt-28 sm:items-center sm:pb-20 sm:pt-32"
    >
      {/* Background Automotive Studio Scene with Scroll & Pointer Parallax */}
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/95 via-[#050507]/70 to-[#050507]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/75" />

        {/* Subtle Animated Studio Reflection Sweep */}
        <div className="absolute inset-0 overflow-hidden opacity-35">
          <div className="animate-specular-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#E10600]/20 to-transparent" />
        </div>
      </motion.div>

      {/* Canvas Atmosphere Particles */}
      <HeroAtmosphereCanvas />

      {/* Main Hero Content */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: contentOpacity }}
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
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-400">Estética Automotiva</span>
          </motion.div>

          {/* Impactful Display Headline */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ textWrap: 'balance' }}
          >
            Cuidado técnico, brilho profundo e acabamento de estúdio.
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            Da lavagem detalhada à higienização de bancos e polimentos técnicos, cada etapa valoriza
            os reflexos, a pintura e o conforto do seu veículo.
          </motion.p>

          {/* Primary Action & Secondary Anchor */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex min-h-[48px] items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#E10600] px-6 py-3 text-sm font-semibold tracking-wide text-white whitespace-nowrap transition-all duration-150 hover:bg-[#ff1a14] active:scale-[0.98] shadow-[0_0_28px_rgba(225,6,0,0.35)]"
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
