import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../utils/automag';
import { BeforeAfterComparison } from './BeforeAfterComparison';

export function TransformationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const stageY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section
      id="transformacao"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-[#050507] py-20 sm:py-28"
    >
      {/* Subtle Crimson Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.12)_0%,transparent_70%)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-6 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-wider text-[#E10600]">
              Experiência de transformação
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              Da poeira da estrada ao reflexo de estúdio.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
              Arraste o divisor horizontalmente para comparar o contraste entre uma carroceria
              opaca pelo uso diário e a profundidade de brilho após o cuidado técnico.
            </p>
          </div>
        </div>

        <motion.div style={shouldReduceMotion ? undefined : { y: stageY }}>
          <BeforeAfterComparison
            variant="car"
            ariaLabel="Comparação interativa de antes e depois do veículo"
            beforeLabel="Antes · Uso diário"
            afterLabel="Depois · Brilho Auto Mag"
            aspectClassName="aspect-[16/10] sm:aspect-[16/9]"
          />
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-sm text-zinc-300">
            Quer devolver o brilho e a limpeza ao seu carro?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E10600]/50 bg-[#E10600]/10 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#E10600]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Agendar transformação</span>
          </a>
        </div>
      </div>
    </section>
  );
}
