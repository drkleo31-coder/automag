import { useEffect, useState } from 'react';
import { BRAND_NAME, BRAND_SUBTITLE, LOGO_ASSET_PATH } from '../utils/automag';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'hero';
  className?: string;
}

interface ProcessedLogo {
  src: string;
  aspectRatio: number;
}

let cachedLogo: ProcessedLogo | null = null;
let processingPromise: Promise<ProcessedLogo | null> | null = null;

function processTransparentLogo(): Promise<ProcessedLogo | null> {
  if (cachedLogo) return Promise.resolve(cachedLogo);
  if (processingPromise) return processingPromise;

  processingPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) {
          resolve(null);
          return;
        }

        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = w;
        srcCanvas.height = h;
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
        if (!srcCtx) {
          resolve(null);
          return;
        }

        srcCtx.drawImage(img, 0, 0);
        const imageData = srcCtx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let minX = w;
        let minY = h;
        let maxX = -1;
        let maxY = -1;

        const blackCut = 18;
        const edgeCeiling = 72;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const lum = Math.max(r, g, b);

            if (lum <= blackCut) {
              data[idx + 3] = 0;
            } else {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              if (lum < edgeCeiling) {
                const t = (lum - blackCut) / (edgeCeiling - blackCut);
                data[idx] = Math.min(255, Math.round(r / t));
                data[idx + 1] = Math.min(255, Math.round(g / t));
                data[idx + 2] = Math.min(255, Math.round(b / t));
                data[idx + 3] = Math.round(t * 255);
              }
            }
          }
        }

        if (maxX <= minX || maxY <= minY) {
          resolve(null);
          return;
        }

        srcCtx.putImageData(imageData, 0, 0);

        const pad = 6;
        const cropX = Math.max(0, minX - pad);
        const cropY = Math.max(0, minY - pad);
        const cropW = Math.min(w - cropX, maxX - minX + 1 + pad * 2);
        const cropH = Math.min(h - cropY, maxY - minY + 1 + pad * 2);

        const outCanvas = document.createElement('canvas');
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) {
          resolve(null);
          return;
        }

        outCtx.drawImage(srcCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        const dataUrl = outCanvas.toDataURL('image/png');
        cachedLogo = {
          src: dataUrl,
          aspectRatio: cropW / cropH,
        };
        resolve(cachedLogo);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = LOGO_ASSET_PATH;
  });

  return processingPromise;
}

const WIDTH_CLASSES: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'w-32 sm:w-36',
  md: 'w-44 sm:w-48',
  hero: 'w-60 sm:w-76 md:w-[360px]',
};

export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const [processed, setProcessed] = useState<ProcessedLogo | null>(cachedLogo);

  useEffect(() => {
    let active = true;
    if (!cachedLogo) {
      void processTransparentLogo().then((result) => {
        if (active && result) {
          setProcessed(result);
        }
      });
    }
    return () => {
      active = false;
    };
  }, []);

  if (processed) {
    return (
      <div
        style={{ aspectRatio: String(processed.aspectRatio) }}
        className={`relative select-none ${WIDTH_CLASSES[size]} ${className}`}
      >
        <img
          src={processed.src}
          alt={`${BRAND_NAME} — ${BRAND_SUBTITLE}`}
          className="h-full w-full object-contain object-left drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[4.4/1] overflow-hidden mix-blend-lighten select-none ${WIDTH_CLASSES[size]} ${className}`}
    >
      <img
        src={LOGO_ASSET_PATH}
        alt={`${BRAND_NAME} — ${BRAND_SUBTITLE}`}
        className="h-full w-full scale-[1.14] object-cover object-center"
        referrerPolicy="no-referrer"
        draggable={false}
      />
    </div>
  );
}
