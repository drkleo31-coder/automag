export interface ServiceItem {
  id: 'lavagem-simples' | 'lavagem-completa' | 'lavagem-com-cera' | 'higienizacao-de-bancos' | 'polimentos';
  index: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  interactionType: 'water' | 'zones' | 'wax' | 'seats' | 'polish';
}

export const BRAND_NAME = 'AUTO MAG';
export const BRAND_SUBTITLE = 'Estética Automotiva';
export const LOGO_ASSET_PATH = '/assets/aistudio/IMG_5612_1ec3a818.png';
export const HERO_CAR_IMAGE_PATH = '/src/assets/images/hero_car_crimson_1795563597105.jpg';
export const TRANSFORM_CAR_IMAGE_PATH = '/src/assets/images/transform_car_studio_1795563596629.jpg';
export const SEAT_LEATHER_IMAGE_PATH = '/src/assets/images/seat_leather_studio_1795563597561.jpg';

export const WHATSAPP_PHONE_DIGITS = '5519999233874';
export const WHATSAPP_PHONE_DISPLAY = '(19) 99923-3874';
export const WHATSAPP_DEFAULT_MESSAGE =
  'Olá! Conheci a Auto Mag pelo site e gostaria de agendar um serviço.';

export const BUSINESS_ADDRESS =
  'R. José Baroni – Parque Clayton Malaman, Pirassununga – SP, 13635-211, Brasil';

export const BUSINESS_CITY = 'Pirassununga – SP';

export function buildWhatsAppUrl(
  phoneDigits: string = WHATSAPP_PHONE_DIGITS,
  message: string = WHATSAPP_DEFAULT_MESSAGE
): string {
  const cleanDigits = phoneDigits.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanDigits}?text=${encodedMessage}`;
}

export function buildGoogleMapsDirectionsUrl(address: string = BUSINESS_ADDRESS): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function buildGoogleMapsEmbedUrl(address: string = BUSINESS_ADDRESS): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export const WHATSAPP_URL = buildWhatsAppUrl();
export const GOOGLE_MAPS_DIRECTIONS_URL = buildGoogleMapsDirectionsUrl();
export const GOOGLE_MAPS_EMBED_URL = buildGoogleMapsEmbedUrl();

export function clampSliderPercentage(
  clientX: number,
  rectLeft: number,
  rectWidth: number
): number {
  if (!Number.isFinite(clientX) || !Number.isFinite(rectLeft) || !Number.isFinite(rectWidth) || rectWidth <= 0) {
    return 50;
  }
  const raw = ((clientX - rectLeft) / rectWidth) * 100;
  const clamped = Math.max(0, Math.min(100, raw));
  return Math.round(clamped * 10) / 10;
}

export function stepSliderPercentage(current: number, key: string, step: number = 5): number {
  const safeCurrent = Number.isFinite(current) ? Math.max(0, Math.min(100, current)) : 50;
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return Math.max(0, safeCurrent - step);
    case 'ArrowRight':
    case 'ArrowUp':
      return Math.min(100, safeCurrent + step);
    case 'Home':
      return 0;
    case 'End':
      return 100;
    default:
      return safeCurrent;
  }
}

export function computePointerParallax(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
  maxOffset: number = 14
): { x: number; y: number } {
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return { x: 0, y: 0 };
  }
  const normX = (clientX / viewportWidth - 0.5) * 2;
  const normY = (clientY / viewportHeight - 0.5) * 2;
  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));
  return {
    x: Math.round(clampedX * maxOffset * 100) / 100,
    y: Math.round(clampedY * maxOffset * 100) / 100,
  };
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'lavagem-simples',
    index: '01',
    title: 'Lavagem simples',
    subtitle: 'Manutenção externa essencial',
    description:
      'Limpeza cuidadosa da carroceria, vidros e rodas com remoção segura da sujeira superficial, preservando o acabamento da pintura no dia a dia.',
    highlights: ['Pré-lavagem técnica', 'Limpeza de rodas', 'Secagem com microfibra'],
    interactionType: 'water',
  },
  {
    id: 'lavagem-completa',
    index: '02',
    title: 'Lavagem completa',
    subtitle: 'Cuidado integral externo e interno',
    description:
      'Tratamento minucioso da parte externa somado à limpeza detalhada da cabine, painel, console, tapetes e caixas de roda para devolver a sensação de carro bem cuidado.',
    highlights: ['Carroceria e vãos de porta', 'Aspiração e acabamento interno', 'Caixas de roda e vidros'],
    interactionType: 'zones',
  },
  {
    id: 'lavagem-com-cera',
    index: '03',
    title: 'Lavagem com cera',
    subtitle: 'Brilho intenso e toque acetinado',
    description:
      'Une a limpeza completa da lataria à aplicação de cera protetora de alto brilho, realçando a profundidade da cor e facilitando a repelência à água.',
    highlights: ['Realce de brilho na pintura', 'Camada protetora hidrofóbica', 'Acabamento uniforme'],
    interactionType: 'wax',
  },
  {
    id: 'higienizacao-de-bancos',
    index: '04',
    title: 'Higienização de bancos',
    subtitle: 'Limpeza profunda do estofamento',
    description:
      'Remoção criteriosa de manchas, resíduos impregnados e odores em bancos de tecido ou couro, renovando o conforto visual e o toque original do interior.',
    highlights: ['Extração de sujidades', 'Cuidado específico por material', 'Renovação visual da cabine'],
    interactionType: 'seats',
  },
  {
    id: 'polimentos',
    index: '05',
    title: 'Polimentos',
    subtitle: 'Correção e nivelamento de verniz',
    description:
      'Processo técnico voltado à redução de micro-riscos, marcas de lavagem e opacidade do verniz, recuperando a nitidez dos reflexos e o espelhamento da pintura.',
    highlights: ['Redução de hologramas e riscos leves', 'Restauração da nitidez de reflexo', 'Acabamento de estúdio'],
    interactionType: 'polish',
  },
];
