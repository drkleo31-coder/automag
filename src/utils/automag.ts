export interface ServiceItem {
  id:
    | 'lavagem-simples'
    | 'lavagem-completa'
    | 'lavagem-com-cera'
    | 'higienizacao-de-bancos'
    | 'polimentos';
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
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(rectLeft) ||
    !Number.isFinite(rectWidth) ||
    rectWidth <= 0
  ) {
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

export interface InspectionPoint {
  x: number;
  y: number;
}

export function clampInspectionCoordinates(
  clientX: number,
  clientY: number,
  rectLeft: number,
  rectTop: number,
  rectWidth: number,
  rectHeight: number
): InspectionPoint {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(clientY) ||
    !Number.isFinite(rectLeft) ||
    !Number.isFinite(rectTop) ||
    !Number.isFinite(rectWidth) ||
    !Number.isFinite(rectHeight) ||
    rectWidth <= 0 ||
    rectHeight <= 0
  ) {
    return { x: 50, y: 50 };
  }
  const rawX = ((clientX - rectLeft) / rectWidth) * 100;
  const rawY = ((clientY - rectTop) / rectHeight) * 100;
  return {
    x: Math.round(Math.max(6, Math.min(94, rawX)) * 10) / 10,
    y: Math.round(Math.max(10, Math.min(90, rawY)) * 10) / 10,
  };
}

export function stepInspectionCoordinates(
  current: InspectionPoint,
  key: string,
  step: number = 6
): InspectionPoint {
  const safeX = Number.isFinite(current.x) ? Math.max(6, Math.min(94, current.x)) : 50;
  const safeY = Number.isFinite(current.y) ? Math.max(10, Math.min(90, current.y)) : 50;
  switch (key) {
    case 'ArrowLeft':
      return { x: Math.max(6, safeX - step), y: safeY };
    case 'ArrowRight':
      return { x: Math.min(94, safeX + step), y: safeY };
    case 'ArrowUp':
      return { x: safeX, y: Math.max(10, safeY - step) };
    case 'ArrowDown':
      return { x: safeX, y: Math.min(90, safeY + step) };
    case 'Home':
      return { x: 50, y: 50 };
    default:
      return { x: safeX, y: safeY };
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
    subtitle: 'Cuidado essencial',
    description:
      'Serviço de lavagem simples para manutenção visual e limpeza prática do veículo no dia a dia.',
    highlights: ['Lavagem simples', 'Cuidado visual', 'Agendamento direto'],
    interactionType: 'water',
  },
  {
    id: 'lavagem-completa',
    index: '02',
    title: 'Lavagem completa',
    subtitle: 'Atendimento completo',
    description:
      'Serviço de lavagem completa pensado para quem busca um cuidado mais abrangente na apresentação do veículo.',
    highlights: ['Lavagem completa', 'Visão geral do veículo', 'Atendimento dedicado'],
    interactionType: 'zones',
  },
  {
    id: 'lavagem-com-cera',
    index: '03',
    title: 'Lavagem com cera',
    subtitle: 'Lavagem e aplicação de cera',
    description:
      'Combina a lavagem do veículo com a aplicação de cera para valorizar o acabamento visual da pintura.',
    highlights: ['Lavagem do veículo', 'Aplicação de cera', 'Realce visual'],
    interactionType: 'wax',
  },
  {
    id: 'higienizacao-de-bancos',
    index: '04',
    title: 'Higienização de bancos',
    subtitle: 'Cuidado para os bancos',
    description:
      'Serviço dedicado à higienização dos bancos do veículo, buscando melhorar a apresentação visual do interior.',
    highlights: ['Higienização de bancos', 'Cuidado com o interior', 'Atendimento sob consulta'],
    interactionType: 'seats',
  },
  {
    id: 'polimentos',
    index: '05',
    title: 'Polimentos',
    subtitle: 'Realce visual da pintura',
    description:
      'Serviço voltado ao polimento automotivo, com foco no acabamento e na valorização dos reflexos da lataria.',
    highlights: ['Polimento automotivo', 'Realce de reflexos', 'Inspeção interativa'],
    interactionType: 'polish',
  },
];
