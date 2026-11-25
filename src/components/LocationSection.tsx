import { useEffect, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import {
  BRAND_NAME,
  BUSINESS_ADDRESS,
  GOOGLE_MAPS_DIRECTIONS_URL,
  GOOGLE_MAPS_EMBED_URL,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_URL,
} from '../utils/automag';

function getMapsApiKey(): string {
  const viteKey = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env?.VITE_GOOGLE_MAPS_API_KEY;
  const globalKey = (globalThis as unknown as { GOOGLE_MAPS_API_KEY?: string })
    .GOOGLE_MAPS_API_KEY;
  return viteKey || globalKey || '';
}

function EmbeddedMapFallback() {
  return (
    <iframe
      title={`Mapa de localização ${BRAND_NAME}`}
      src={GOOGLE_MAPS_EMBED_URL}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-full w-full border-0 grayscale-[20%] contrast-110"
      allowFullScreen
    />
  );
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

function InteractiveGoogleMapCanvas({ onFallbackNeeded }: { onFallbackNeeded: () => void }) {
  const loadingStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [center, setCenter] = useState<LatLngLiteral | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [resolvedAddress, setResolvedAddress] = useState(BUSINESS_ADDRESS);

  useEffect(() => {
    if (
      loadingStatus === APILoadingStatus.FAILED ||
      loadingStatus === APILoadingStatus.AUTH_FAILURE
    ) {
      onFallbackNeeded();
    }
  }, [loadingStatus, onFallbackNeeded]);

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    const resolveBusinessLocation = async () => {
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: BUSINESS_ADDRESS,
          fields: ['location', 'formattedAddress'],
          language: 'pt-BR',
          region: 'br',
          maxResultCount: 1,
        });

        if (cancelled) return;
        const firstPlace = places?.[0];
        if (firstPlace?.location) {
          setCenter({
            lat: firstPlace.location.lat(),
            lng: firstPlace.location.lng(),
          });
          if (firstPlace.formattedAddress) {
            setResolvedAddress(firstPlace.formattedAddress);
          }
        } else {
          onFallbackNeeded();
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('OVER_QUERY_LIMIT')) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          onFallbackNeeded();
        }
      }
    };

    void resolveBusinessLocation();
    return () => {
      cancelled = true;
    };
  }, [placesLib, onFallbackNeeded]);

  if (!center) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0c0c10] text-xs text-zinc-400">
        Carregando mapa interativo...
      </div>
    );
  }

  return (
    <GoogleMap
      mapId="DEMO_MAP_ID"
      renderingType="RASTER"
      colorScheme="DARK"
      defaultCenter={center}
      defaultZoom={16}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapTypeControl={false}
      streetViewControl={false}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      className="h-full w-full"
    >
      <AdvancedMarker
        ref={markerRef}
        position={center}
        title={BRAND_NAME}
        onClick={() => setInfoOpen(true)}
      >
        <Pin background="#E10600" borderColor="#ffffff" glyphColor="#ffffff" scale={1.15} />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)} maxWidth={260}>
          <div className="p-1 text-zinc-900">
            <p className="text-sm font-bold">{BRAND_NAME}</p>
            <p className="mt-1 text-xs leading-snug text-zinc-700">{resolvedAddress}</p>
            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-[#E10600] underline"
            >
              Traçar rota
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export function LocationSection() {
  const apiKey = getMapsApiKey();
  const [useEmbedFallback, setUseEmbedFallback] = useState(!apiKey);

  return (
    <section
      id="localizacao"
      className="relative border-t border-white/10 bg-[#050507] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column: Address & Direct Route / Booking Actions */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0C0C10] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#E10600]">Localização</p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Venha conhecer a Auto Mag em Pirassununga.
              </h2>

              <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#E10600]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-zinc-400">Endereço</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-100">
                      {BUSINESS_ADDRESS}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#E10600]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-zinc-400">WhatsApp para agendamento</p>
                    <p className="mt-1 text-sm font-medium tabular-nums text-zinc-100">
                      {WHATSAPP_PHONE_DISPLAY}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row lg:flex-col">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:border-white/40 hover:bg-white/10"
              >
                <Navigation className="h-4 w-4 text-[#E10600]" aria-hidden="true" />
                <span>Abrir rota no Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#E10600] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#ff1a14]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Agendar pelo WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Integrated Google Maps */}
          <div
            data-testid="automag-map"
            className="h-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#0C0C10] sm:h-[440px] lg:col-span-7 lg:h-auto lg:min-h-[460px]"
          >
            {!useEmbedFallback && apiKey ? (
              <APIProvider apiKey={apiKey} language="pt-BR" region="BR">
                <InteractiveGoogleMapCanvas onFallbackNeeded={() => setUseEmbedFallback(true)} />
              </APIProvider>
            ) : (
              <EmbeddedMapFallback />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
