import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import {
  SEAT_LEATHER_IMAGE_PATH,
  TRANSFORM_CAR_IMAGE_PATH,
  clampSliderPercentage,
  stepSliderPercentage,
} from '../utils/automag';

interface BeforeAfterComparisonProps {
  variant: 'car' | 'seat';
  ariaLabel: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectClassName?: string;
  initialPosition?: number;
}

export function BeforeAfterComparison({
  variant,
  ariaLabel,
  beforeLabel = 'Antes',
  afterLabel = 'Depois',
  aspectClassName = 'aspect-[16/9]',
  initialPosition = 50,
}: BeforeAfterComparisonProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageSrc = variant === 'car' ? TRANSFORM_CAR_IMAGE_PATH : SEAT_LEATHER_IMAGE_PATH;
  const imageAlt =
    variant === 'car'
      ? 'Composição ilustrativa comparando veículo antes e depois do detalhamento automotivo'
      : 'Composição ilustrativa comparando banco automotivo antes e depois da higienização';

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(clampSliderPercentage(clientX, rect.left, rect.width));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = stepSliderPercentage(position, e.key, 5);
    if (next !== position) {
      e.preventDefault();
      setPosition(next);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% revelado`}
        data-testid={`before-after-${variant}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0E] select-none touch-none cursor-ew-resize ${aspectClassName}`}
      >
        {/* AFTER LAYER (Clean, glossy, specular finish) */}
        <div className="absolute inset-0">
          {!imgError ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              draggable={false}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-center brightness-105 contrast-110 saturate-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-[#0c0c10] to-[#1a0505]" />
          )}

          {/* Glossy studio sheen & water-beading shimmer on the clean side */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(255,255,255,0.12),transparent_55%)]"
          />
          {variant === 'car' && (
            <svg
              aria-hidden="true"
              viewBox="0 0 800 450"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Crisp hydrophobic water beads & specular star glints */}
              <circle cx="520" cy="210" r="2.5" fill="#ffffff" fillOpacity="0.85" />
              <circle cx="565" cy="226" r="1.8" fill="#ffffff" fillOpacity="0.7" />
              <circle cx="610" cy="202" r="2.2" fill="#ffffff" fillOpacity="0.8" />
              <circle cx="485" cy="238" r="2" fill="#ffffff" fillOpacity="0.65" />
              <circle cx="655" cy="234" r="2.4" fill="#ffffff" fillOpacity="0.75" />
              <path
                d="M540 164 L544 176 L556 180 L544 184 L540 196 L536 184 L524 180 L536 176 Z"
                fill="#ffffff"
                fillOpacity="0.85"
              />
            </svg>
          )}
        </div>

        {/* BEFORE LAYER (Clipped by horizontal divider position) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {!imgError ? (
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center brightness-[0.68] contrast-[0.82] sepia-[0.28] saturate-[0.55]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-stone-800 via-stone-900 to-black" />
          )}

          {/* Road dust / haze veil */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a2f24]/65 via-[#4b3e30]/28 to-[#1f1c18]/45" />

          {variant === 'car' ? (
            /* Procedural road mud splatters, dust specks & swirl haze overlay */
            <svg
              viewBox="0 0 800 450"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <radialGradient id="mudGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4c3826" stopOpacity="0.82" />
                  <stop offset="70%" stopColor="#352619" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#261b12" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Lower rocker panel & wheel arch mud splatter */}
              <ellipse cx="220" cy="312" rx="135" ry="38" fill="url(#mudGrad)" />
              <ellipse cx="385" cy="306" rx="145" ry="30" fill="url(#mudGrad)" />
              <ellipse cx="145" cy="292" rx="75" ry="26" fill="url(#mudGrad)" />
              <circle cx="178" cy="275" r="7" fill="#4f3b28" fillOpacity="0.7" />
              <circle cx="242" cy="268" r="5" fill="#4f3b28" fillOpacity="0.65" />
              <circle cx="310" cy="285" r="8" fill="#4f3b28" fillOpacity="0.6" />
              <circle cx="356" cy="272" r="4" fill="#4f3b28" fillOpacity="0.7" />
              {/* Fine swirl marks & dust specks on hood */}
              <g stroke="#d4c7b4" strokeOpacity="0.22" strokeWidth="1" fill="none">
                <circle cx="260" cy="205" r="24" strokeDasharray="8 6" />
                <circle cx="260" cy="205" r="16" strokeDasharray="5 7" />
                <circle cx="340" cy="195" r="20" strokeDasharray="7 5" />
              </g>
              <g fill="#cfc1ae" fillOpacity="0.28">
                <circle cx="195" cy="182" r="1.5" />
                <circle cx="235" cy="168" r="1.2" />
                <circle cx="290" cy="176" r="1.6" />
                <circle cx="328" cy="212" r="1.4" />
                <circle cx="165" cy="230" r="1.8" />
                <circle cx="412" cy="242" r="1.5" />
              </g>
            </svg>
          ) : (
            /* Seat stains, grime & matte dust film overlay */
            <svg
              viewBox="0 0 800 600"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <radialGradient id="stainGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#5e4934" stopOpacity="0.72" />
                  <stop offset="65%" stopColor="#463626" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#2e2318" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="440" cy="360" rx="115" ry="80" fill="url(#stainGrad)" />
              <ellipse cx="380" cy="460" rx="135" ry="70" fill="url(#stainGrad)" />
              <ellipse cx="500" cy="240" rx="70" ry="50" fill="url(#stainGrad)" />
              {/* Dust specks in seat perforations */}
              <g fill="#cbbda8" fillOpacity="0.28">
                <circle cx="390" cy="340" r="2.2" />
                <circle cx="425" cy="380" r="1.8" />
                <circle cx="465" cy="355" r="2.5" />
                <circle cx="410" cy="435" r="2.1" />
                <circle cx="475" cy="415" r="1.9" />
              </g>
            </svg>
          )}
        </div>

        {/* Corner Labels (static unboxed editorial labels, not pills) */}
        <div className="pointer-events-none absolute left-3.5 top-3.5 z-10 rounded bg-black/70 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-200 backdrop-blur-sm">
          {beforeLabel}
        </div>
        <div className="pointer-events-none absolute right-3.5 top-3.5 z-10 rounded bg-[#E10600]/85 px-2.5 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
          {afterLabel}
        </div>

        {/* Vertical Laser Divider Line & Handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-[2px] -translate-x-1/2 bg-gradient-to-b from-white/70 via-[#E10600] to-white/70 shadow-[0_0_14px_rgba(225,6,0,0.85)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[#0A0A0E]/90 text-white shadow-[0_0_24px_rgba(225,6,0,0.65)] backdrop-blur-md transition-transform duration-150">
            <MoveHorizontal className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Controls & Illustrative Disclosure Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <span>Composição visual ilustrativa · Arraste para comparar</span>
        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0C0C10] p-1">
          <button
            type="button"
            onClick={() => setPosition(88)}
            className={`min-h-[36px] rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              position >= 75 ? 'bg-[#E10600] text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            Ver Antes
          </button>
          <button
            type="button"
            onClick={() => setPosition(50)}
            className={`min-h-[36px] rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors tabular-nums ${
              position > 25 && position < 75
                ? 'bg-white/15 text-white'
                : 'text-zinc-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            50 / 50
          </button>
          <button
            type="button"
            onClick={() => setPosition(12)}
            className={`min-h-[36px] rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              position <= 25 ? 'bg-[#E10600] text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            Ver Depois
          </button>
        </div>
      </div>
    </div>
  );
}
