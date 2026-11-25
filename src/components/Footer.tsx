import { MapPin, MessageCircle } from 'lucide-react';
import {
  BRAND_NAME,
  BRAND_SUBTITLE,
  BUSINESS_ADDRESS,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_URL,
} from '../utils/automag';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040406] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div className="space-y-3">
          <BrandLogo size="md" />
          <div>
            <p className="text-sm font-semibold text-white">
              {BRAND_NAME} — {BRAND_SUBTITLE}
            </p>
            <p className="mt-1 flex items-start gap-2 text-xs leading-relaxed text-zinc-400">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E10600]" aria-hidden="true" />
              <span>{BUSINESS_ADDRESS}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#E10600] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#ff1a14]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Agendar pelo WhatsApp · {WHATSAPP_PHONE_DISPLAY}</span>
          </a>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {BRAND_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
