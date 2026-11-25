import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Droplets, Layers, MessageCircle, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { SERVICES, ServiceItem, WHATSAPP_URL } from '../utils/automag';
import { BeforeAfterComparison } from './BeforeAfterComparison';

function WaterRinseVisual() {
  const [active, setActive] = useState(false);

  return (
    <div
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onClick={() => setActive((prev) => !prev)}
      className="relative h-36 w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0d1118] via-[#09090d] to-[#130608] p-4"
    >
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Fluxo de água e espuma</span>
        <span className="text-[#E10600]">{active ? 'Enxágue ativo' : 'Passe ou toque'}</span>
      </div>

      {/* Water Ripples */}
      <div className="relative mt-4 flex h-16 items-center justify-center">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            style={{ animationDelay: `${ring * 0.7}s` }}
            className={`absolute h-12 w-12 rounded-full border ${
              active ? 'border-sky-300/50 animate-water-ripple' : 'border-white/15'
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

const COMPLETE_ZONES = [
  { id: 'pintura', label: 'Lataria', detail: 'Pré-lavagem e remoção segura de resíduos da pintura' },
  { id: 'rodas', label: 'Rodas', detail: 'Limpeza detalhada de aros, pneus e caixas de roda' },
  { id: 'vidros', label: 'Vidros', detail: 'Desengorduramento e transparência sem manchas' },
  { id: 'cabine', label: 'Cabine', detail: 'Aspiração minuciosa e cuidado em painel e console' },
];

function CompleteZonesVisual() {
  const [selectedZone, setSelectedZone] = useState(COMPLETE_ZONES[0]);

  return (
    <div className="rounded-lg border border-white/10 bg-[#08080c] p-4">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {COMPLETE_ZONES.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedZone(zone)}
              className={`min-h-[38px] rounded-md px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#E10600] text-white'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2.5 text-xs text-zinc-300">
        <Layers className="h-4 w-4 shrink-0 text-[#E10600]" aria-hidden="true" />
        <span>{selectedZone.detail}</span>
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
      className="relative h-36 w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#120608] via-[#09090d] to-[#050507] p-4"
    >
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Repelência e brilho</span>
        <span className="text-[#E10600]">{waveActive ? 'Proteção ativa' : 'Passe ou toque'}</span>
      </div>

      {/* Specular wax sweep */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ${
          waveActive ? 'translate-x-[240%]' : '-translate-x-full'
        }`}
      />

      {/* Hydrophobic beads */}
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
  const [beamPos, setBeamPos] = useState({ x: 55, y: 50 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setBeamPos({ x, y });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onClick={handlePointerMove}
      className="relative h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-[#07070a] cursor-crosshair select-none touch-none sm:h-64"
    >
      {/* Swirl mark baseline layer */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 260"
        className="absolute inset-0 h-full w-full opacity-55"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#71717a" strokeOpacity="0.45" strokeWidth="1" fill="none">
          <circle cx="130" cy="110" r="36" strokeDasharray="10 7" />
          <circle cx="130" cy="110" r="24" strokeDasharray="7 8" />
          <circle cx="290" cy="145" r="42" strokeDasharray="12 6" />
          <circle cx="290" cy="145" r="28" strokeDasharray="6 6" />
          <circle cx="450" cy="100" r="38" strokeDasharray="9 7" />
          <circle cx="450" cy="100" r="22" strokeDasharray="5 5" />
          <path d="M40 60 Q 170 95 280 50" strokeDasharray="4 6" />
          <path d="M310 195 Q 440 160 560 205" strokeDasharray="5 7" />
        </g>
      </svg>

      {/* Mirror-corrected paint layer revealed inside inspection spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-150"
        style={{
          background: `radial-gradient(circle 130px at ${beamPos.x}% ${beamPos.y}%, rgba(255,255,255,0.16) 0%, rgba(225,6,0,0.22) 38%, rgba(5,5,7,0.94) 68%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: `circle(96px at ${beamPos.x}% ${beamPos.y}%)`,
          background:
            'linear-gradient(135deg, #0b0b10 0%, #191922 45%, #2a090c 72%, #09090d 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle 68px at ${beamPos.x}% ${beamPos.y}%, rgba(255,255,255,0.26), rgba(225,6,0,0.12) 60%, transparent 100%)`,
          }}
        />
      </div>

      {/* Inspection lamp reticle */}
      <div
        aria-hidden="true"
        style={{ left: `${beamPos.x}%`, top: `${beamPos.y}%` }}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E10600]/80 bg-black/40 text-white shadow-[0_0_24px_rgba(225,6,0,0.5)]">
          <Sun className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-xs text-zinc-300">
        <span className="truncate rounded bg-black/75 px-2.5 py-1 backdrop-blur-sm">
          Mova o cursor · luz de inspeção
        </span>
        <span className="hidden shrink-0 whitespace-nowrap rounded bg-[#E10600]/90 px-2.5 py-1 font-medium text-white sm:inline">
          Verniz nivelado
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
  const shouldReduceMotion = useReducedMotion();
  const standardServices = SERVICES.slice(0, 3);
  const seatService = SERVICES[3];
  const polishService = SERVICES[4];

  return (
    <section
      id="servicos"
      className="relative border-t border-white/10 bg-[#08080B] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl pb-12">
          <p className="text-xs font-semibold tracking-wider text-[#E10600]">
            Serviços especializados
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            Cada etapa executada com atenção aos detalhes.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Conheça nossos cinco serviços de estética automotiva e escolha o atendimento ideal para
            a necessidade atual do seu veículo.
          </p>
        </div>

        {/* Row 1: 3 Wash & Protection Services */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {standardServices.map((service, idx) => (
            <motion.article
              key={service.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0D0D12] p-6 transition-colors duration-200 hover:border-white/20"
            >
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
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0D0D12] p-6 transition-colors duration-200 hover:border-white/20 lg:col-span-7"
          >
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
                  beforeLabel="Antes · Impregnado"
                  afterLabel="Depois · Higienizado"
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

          {/* 05. Polimentos — Interactive Inspection Light Visualizer */}
          <motion.article
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0D0D12] p-6 transition-colors duration-200 hover:border-white/20 lg:col-span-5"
          >
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
