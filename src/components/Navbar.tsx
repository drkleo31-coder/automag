import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { BRAND_NAME, WHATSAPP_URL } from '../utils/automag';
import { BrandLogo } from './BrandLogo';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#transformacao', label: 'Transformação' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#localizacao', label: 'Localização' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#050507]/90 backdrop-blur-md border-b border-white/10'
          : 'bg-gradient-to-b from-[#050507]/85 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single clean Brand lockup */}
        <a
          href="#inicio"
          aria-label={`${BRAND_NAME} — voltar ao início`}
          className="flex items-center shrink-0 whitespace-nowrap focus-visible:rounded"
        >
          <BrandLogo size="sm" />
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#E10600] after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#E10600] px-4 py-2 text-xs font-semibold tracking-wide text-white whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-[#ff1a14] active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Agendar WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação mobile"
          className="border-t border-white/10 bg-[#050507] px-4 pb-5 pt-3 shadow-2xl md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#E10600] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ff1a14]"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Agendar pelo WhatsApp</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
