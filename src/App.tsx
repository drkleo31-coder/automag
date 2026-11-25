import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { StudioBackdrop } from './components/StudioBackdrop';
import { HeroSection } from './components/HeroSection';
import { TransformationSection } from './components/TransformationSection';
import { ServicesSection } from './components/ServicesSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507] text-zinc-100">
      <StudioBackdrop />

      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <TransformationSection />
        <ServicesSection />
        <LocationSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
