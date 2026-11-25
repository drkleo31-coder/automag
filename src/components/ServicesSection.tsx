import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Droplets, Layers, MessageCircle, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import {
  HERO_CAR_IMAGE_PATH,
  SERVICES,
  ServiceItem,
  WHATSAPP_URL,
  clampInspectionCoordinates,
  stepInspectionCoordinates,
} from '../utils/automag';
import { BeforeAfterComparison } from './BeforeAfterComparison';

function WaterRinseVisual() {
  const [active, setActive] = useState(false);

  return (
    <div
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onClick={() => setActive((prev) => !prev)}
      className="relative h-36 w-full cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0d1118] via-[#09090d] to-[#130608] p-4"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
        <span>Efeito visual · Água</span>
        <span className="shrink-0 whitespace-nowrap text-[#E10600]">
          {active ? 'Movimento ativo' : 'Passe ou toque'}
        </span>
      </div>

      {/* Water Ripples */}
      <div className="relative mt-4 flex h-16 items-center justify-center">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            style={{ animationDelay: `${ring * 0.7}s` }}
            className={`absolute h-12 w-12 rounded-full border ${
              active ? 'animate-water-ripple border-sky-300/50' : 'border-white/15'
            }`}
          />
        ))}
        <div
          className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 ${
            active
              ? 'border-sky-300/60 bg-sky-400/15 text-sky-200'
              : 'border-white/15 bg-white/5 text-zinc-200'
          }`}
        >
          <Droplets className="h-5 w-5" />
        </div>
      </div>

      {/* Animated water sheet bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sky-300/70 to-transparent transition-opacity duration-200 ${
          active ? 'opacity-100' : 'opacity-25'
        }`}
      />
    </div>
  );
}

const COMPLETE_VIEWS = [
  {
    id: 'externa',
    label: 'Externa',
    detail: 'Atendimento voltado ao visual externo do veículo',
  },
  {
    id: 'interna',
    label: 'Interna',
    detail: 'Atenção à apresentação do espaço interno',
  },
  {
    id: 'conjunto',
    label: 'Conjunto',
    detail: 'Cuidado geral reunido em um único serviço',
  },
  {
    id: 'consulta',
    label: 'Detalhes',
    detail: 'Consulte informações e agendamento pelo WhatsApp',
  },
];

function CompleteZonesVisual() {
  const [selectedView, setSelectedView] = useState(COMPLETE_VIEWS[0]);

  return (
    <div className="rounded-lg border border-white/10 bg-[#08080c] p-4">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {COMPLETE_VIEWS.map((view) => {
          const isSelected = selectedView.id === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setSelectedView(view)}
              className={`min-h-[38px] rounded-md px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#E10600] text-white'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {view.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2.5 text-xs text-zinc-300">
        <Layers className="h-4 w-4 shrink-0 text-[#E10600]" aria-hidden="true" />
        <span>{selectedView.detail}</span>
      </div>
    </div>
  );
}

function WaxBeadingVisual() {
  const [waveActive, setWaveActive] = useState(false);

  return (
    <div
      onPointerEnter={() => setWaveActive(true)}
      onPointerLeave={() => setWaveActive(false)}
      onClick={() => setWaveActive((prev) => !prev)}
      className="relative h-36 w-full cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#120608] via-[#09090d] to-[#050507] p-4"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
        <span>Brilho e gotículas</span>
        <span className="shrink-0 whitespace-nowrap text-[#E10600]">
          {waveActive ? 'Brilho realçado' : 'Passe ou toque'}
        </span>
      </div>

      {/* Specular wax sweep */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ${
          waveActive ? 'translate-x-[240%]' : '-translate-x-full'
        }`}
      />

      {/* Hydrophobic beads illustration */}
      <div className="mt-4 flex items-center justify-around">
        {[12, 18, 10, 16, 13].map((size, idx) => (
          <div
            key={idx}
            style={{ width: size * 2, height: size * 2 }}
            className={`relative rounded-full border transition-transform duration-200 ${
              waveActive ? 'scale-110 border-white/50' : 'border-white/25'
            } bg-gradient-to-br from-white/40 via-white/10 to-black/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.45)]`}
          >
            <span className="absolute left-1.5 top-1 h-1.5 w-1.5 rounded-full bg-white/90" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PolishingInspectionVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: 56, y: 48 });
  const currentRef = useRef({ x: 56, y: 48 });
  const rafRef = useRef(0);
  const [coords, setCoords] = useState({ x: 56, y: 48 });
  const [isActive, setIsActive] = useState(false);
  const [imgError, setImgError] = useState(false);

  const applyCssPosition = (x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--beam-x', `${x.toFixed(2)}%`);
    el.style.setProperty('--beam-y', `${y.toFixed(2)}%`);
  };

  useEffect(() => {
    applyCssPosition(56, 48);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scheduleAnimation = () => {
    if (rafRef.current) return;
    const step = () => {
      rafRef.current = 0;
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;

      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        currentRef.current = { ...targetRef.current };
        applyCssPosition(currentRef.current.x, currentRef.current.y);
        return;
      }

      currentRef.current.x += dx * 0.24;
      currentRef.current.y += dy * 0.24;
      applyCssPosition(currentRef.current.x, currentRef.current.y);
      rafRef.current = window.requestAnimationFrame(step);
    };
    rafRef.current = window.requestAnimationFrame(step);
  };

  const updateTarget = (next: { x: number; y: number }, immediate = false) => {
    targetRef.current = next;
    setCoords(next);
    if (immediate) {
      currentRef.current = next;
      applyCssPosition(next.x, next.y);
    } else {
      scheduleAnimation();
    }
  };

  const handlePointerUpdate = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = clampInspectionCoordinates(
      clientX,
      clientY,
      rect.left,
      rect.top,
      rect.width,
      rect.height
    );
    updateTarget(next);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic pointer events without an active browser pointer
    }
    setIsActive(true);
    handlePointerUpdate(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive && e.pointerType === 'touch') return;
    setIsActive(true);
    handlePointerUpdate(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore synthetic pointer events
    }
    setIsActive(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = stepInspectionCoordinates(targetRef.current, e.key, 7);
    if (next.x !== targetRef.current.x || next.y !== targetRef.current.y) {
      e.preventDefault();
      setIsActive(true);
      updateTarget(next);
    }
  };

  return (
    <div
      ref={containerRef}
      role="application"
      tabIndex={0}
      aria-label="Inspeção interativa de brilho da pintura automotiva. Mova o cursor, arraste com o dedo ou use as setas para mover a área circular de inspeção."
      data-testid="polishing-inspector"
      data-x={Math.round(coords.x)}
      data-y={Math.round(coords.y)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => setIsActive(false)}
      onKeyDown={handleKeyDown}
      className="relative h-60 w-full overflow-hidden rounded-xl border border-white/15 bg-[#07070a] cursor-crosshair select-none touch-none transition-colors duration-200 hover:border-[#E10600]/45 sm:h-64"
    >
      {/* Base Layer: Initially Opaque / Matte Car Bodywork Surface */}
      <div className="pointer-events-none absolute inset-0">
        {!imgError ? (
          <img
            src={HERO_CAR_IMAGE_PATH}
            alt="Superfície ilustrativa de lataria automotiva em inspeção de brilho"
            draggable={false}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full scale-[1.28] object-cover object-[64%_54%] brightness-[0.52] contrast-[0.74] saturate-[0.28]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}

        {/* Matte haze & fine micro-swirl texture on uninspected paint */}
        <div className="absolute inset-0 bg-[#141317]/48" />
        <svg
          aria-hidden="true"
          viewBox="0 0 600 260"
          className="absolute inset-0 h-full w-full opacity-45"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="#a1a1aa" strokeOpacity="0.32" strokeWidth="1" fill="none">
            <circle cx="150" cy="115" r="34" strokeDasharray="9 7" />
            <circle cx="150" cy="115" r="21" strokeDasharray="6 7" />
            <circle cx="310" cy="138" r="40" strokeDasharray="11 6" />
            <circle cx="310" cy="138" r="24" strokeDasharray="5 6" />
            <circle cx="460" cy="108" r="36" strokeDasharray="8 6" />
            <path d="M55 68 Q 185 102 295 54" strokeDasharray="4 6" />
            <path d="M295 192 Q 430 158 555 202" strokeDasharray="5 7" />
          </g>
        </svg>
      </div>

      {/* Inspection Reveal Layer: Vivid, Glossy, Specular Crimson Reflections inside Circular Beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage:
            'radial-gradient(circle 104px at var(--beam-x, 56%) var(--beam-y, 48%), #000 0%, #000 72%, rgba(0,0,0,0.45) 88%, transparent 100%)',
          maskImage:
            'radial-gradient(circle 104px at var(--beam-x, 56%) var(--beam-y, 48%), #000 0%, #000 72%, rgba(0,0,0,0.45) 88%, transparent 100%)',
        }}
      >
        {!imgError ? (
          <img
            src={HERO_CAR_IMAGE_PATH}
            alt=""
            draggable={false}
            referrerPolicy="no-referrer"
            className="h-full w-full scale-[1.28] object-cover object-[64%_54%] brightness-[1.22] contrast-[1.3] saturate-[1.35]"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle,rgba(225,6,0,0.35),#09090d)]" />
        )}

        {/* Intense Specular Studio Reflection & Crimson Depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle 105px at var(--beam-x, 56%) var(--beam-y, 48%), rgba(255,255,255,0.22) 0%, rgba(225,6,0,0.24) 44%, transparent 82%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'linear-gradient(125deg, transparent 34%, rgba(255,255,255,0.22) 48%, rgba(225,6,0,0.16) 53%, transparent 66%)',
          }}
        />
      </div>

      {/* Circular Inspection Optical Lens Ring */}
      <div
        aria-hidden="true"
        style={{ left: 'var(--beam-x, 56%)', top: 'var(--beam-y, 48%)' }}
        className={`pointer-events-none absolute flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-transform duration-150 sm:h-48 sm:w-48 ${
          isActive
            ? 'scale-105 border-white/65 shadow-[0_0_32px_rgba(225,6,0,0.55),inset_0_0_24px_rgba(255,255,255,0.14)]'
            : 'border-white/35 shadow-[0_0_22px_rgba(225,6,0,0.38)]'
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E10600]/80 bg-black/45 text-white shadow-[0_0_16px_rgba(225,6,0,0.65)] backdrop-blur-sm">
          <Sun className="h-3.5 w-3.5 text-white" />
        </span>
      </div>

      {/* Top Illustrative Label */}
      <div className="pointer-events-none absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
        Composição visual ilustrativa
      </div>

      {/* Bottom Interactive Hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] text-zinc-200 sm:text-xs">
        <span className="rounded bg-black/75 px-2.5 py-1 backdrop-blur-sm">
          Mova ou arraste para revelar o brilho
        </span>
        <span className="hidden shrink-0 whitespace-nowrap rounded bg-[#E10600]/90 px-2.5 py-1 font-medium text-white sm:inline">
          Luz de inspeção
        </span>
      </div>
    </div>
  );
}

function ServiceIcon({ type }: { type: ServiceItem['interactionType'] }) {
  switch (type) {
    case 'water':
      return <Droplets className="h-5 w-5 text-[#E10600]" aria-hidden="true" />;
    case 'zones':
      return <Layers className="h-5 w-5 text-[#E10600]" aria-hidden="true" />;
    case 'wax':
      return <ShieldCheck className="h-5 w-5 text-[#E10600]" aria-hidden="true" />;
    case 'seats':
      return <Sparkles className="h-5 w-5 text-[#E10600]" aria-hidden="true" />;
    case 'polish':
      return <Sun className="h-5 w-5 text-[#E10600]" aria-hidden="true" />;
  }
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const standardServices = SERVICES.slice(0, 3);
  const seatService = SERVICES[3];
  const polishService = SERVICES[4];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerParallaxY = useTransform(scrollYProgress, [0, 0.5], [18, 0]);

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-[#08080B] py-20 sm:py-28"
    >
      {/* Animated section seam divider */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-[#E10600]/65 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={shouldReduceMotion ? undefined : { y: headerParallaxY }}
          className="max-w-2xl pb-12"
        >
          <p className="text-xs font-semibold tracking-wider text-[#E10600]">
            Serviços especializados
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            Nossos cinco serviços para cuidar do seu veículo.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Escolha o atendimento que melhor se adapta à sua necessidade e agende diretamente pelo
            WhatsApp.
          </p>
        </motion.div>

        {/* Row 1: 3 Wash & Wax Services */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {standardServices.map((service, idx) => (
            <motion.article
              key={service.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.52, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0D0D12] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/25"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E10600]/65 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />

              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-xl font-bold tabular-nums text-[#E10600]">
                    {service.index}.
                  </span>
                  <ServiceIcon type={service.interactionType} />
                </div>

                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-zinc-400">{service.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{service.description}</p>

                <div className="mt-5">
                  {service.interactionType === 'water' && <WaterRinseVisual />}
                  {service.interactionType === 'zones' && <CompleteZonesVisual />}
                  {service.interactionType === 'wax' && <WaxBeadingVisual />}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                  {service.highlights.map((item, i) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      {i > 0 && <span aria-hidden="true">·</span>}
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:border-[#E10600] hover:bg-[#E10600]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Agendar {service.title}</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Row 2: Featured Interactive Services (Higienização de bancos & Polimentos) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 04. Higienização de bancos — Interactive Before & After */}
          <motion.article
            initial={shouldReduceMotion ? false : { opacity: 0, x: -16, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0D0D12] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 lg:col-span-7"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E10600]/65 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />

            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xl font-bold tabular-nums text-[#E10600]">
                  {seatService.index}.
                </span>
                <ServiceIcon type={seatService.interactionType} />
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {seatService.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-zinc-400">{seatService.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {seatService.description}
              </p>

              <div className="mt-5">
                <BeforeAfterComparison
                  variant="seat"
                  ariaLabel="Comparação interativa de antes e depois da higienização de bancos"
                  beforeLabel="Antes · Ilustrativo"
                  afterLabel="Depois · Ilustrativo"
                  aspectClassName="aspect-[4/3] sm:aspect-[16/10]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                {seatService.highlights.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">·</span>}
                    <span>{item}</span>
                  </span>
                ))}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#E10600] px-5 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#ff1a14]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Agendar {seatService.title}</span>
              </a>
            </div>
          </motion.article>

          {/* 05. Polimentos — Exclusive Paint Inspection Light Visualizer */}
          <motion.article
            initial={shouldReduceMotion ? false : { opacity: 0, x: 16, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.58, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0D0D12] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 lg:col-span-5"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E10600]/65 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />

            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xl font-bold tabular-nums text-[#E10600]">
                  {polishService.index}.
                </span>
                <ServiceIcon type={polishService.interactionType} />
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {polishService.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-zinc-400">{polishService.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {polishService.description}
              </p>

              <div className="mt-5">
                <PolishingInspectionVisual />
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                {polishService.highlights.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">·</span>}
                    <span>{item}</span>
                  </span>
                ))}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:border-[#E10600] hover:bg-[#E10600]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Agendar {polishService.title}</span>
              </a>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
