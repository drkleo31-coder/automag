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

  const stageY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const stageScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.975, 1, 0.99]);
  const titleX = useTransform(scrollYProgress, [0, 0.45], [-14, 0]);

  return (
    <section
      id="transformacao"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-[#050507] py-20 sm:py-28"
    >
      {/* Animated crimson seam transition */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-[#E10600]/80 via-[#E10600]/20 to-transparent"
      />

      {/* Subtle Crimson Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.12)_0%,transparent_70%)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-6 pb-10 lg:grid-cols-12">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={shouldReduceMotion ? undefined : { x: titleX }}
            className="lg:col-span-7"
          >
            <p className="text-xs font-semibold tracking-wider text-[#E10600]">
              Experiência de transformação
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              Da poeira do dia a dia ao brilho renovado.
            </h2>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:justify-self-end"
          >
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
              Arraste o divisor horizontalmente para comparar uma composição ilustrativa entre uma
              carroceria opaca e um acabamento limpo e brilhante.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={shouldReduceMotion ? undefined : { y: stageY, scale: stageScale }}
        >
          <BeforeAfterComparison
            variant="car"
            ariaLabel="Comparação interativa de antes e depois do veículo"
            beforeLabel="Antes · Ilustrativo"
            afterLabel="Depois · Ilustrativo"
            aspectClassName="aspect-[16/10] sm:aspect-[16/9]"
          />
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8"
        >
          <p className="text-sm text-zinc-300">
            Quer agendar um cuidado especial para o seu veículo?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E10600]/50 bg-[#E10600]/10 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#E10600]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Agendar pelo WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
