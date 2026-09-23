import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';

// Hooks
import { useReadMode } from './hooks/useReadMode';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SettingsModal from './components/SettingsModal';

// Pages
import ServicesPage from './pages/ServicesPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import ContactPage from './pages/ContactPage';
import SeniorHub from './pages/SeniorHub';
import VolunteerHub from './pages/VolunteerHub';

export default function App() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [config, setConfig] = useState({
    textSize: 'normal',
    highContrast: false,
    language: 'english',
    readMode: false
  });

  // Enable text size scaling by directly altering HTML base size
  useEffect(() => {
    // If High Contrast is enabled, force minimum 24px (xl) size
    const sizeMap = { normal: '16px', large: '20px', xl: '24px' };
    const effectiveSize = config.highContrast ? '24px' : sizeMap[config.textSize];
    document.documentElement.style.fontSize = effectiveSize;
  }, [config.textSize, config.highContrast]);

  // Hook handles TTS functionality when Read Mode is active
  useReadMode(config.readMode);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const baseSize = config.textSize === 'normal' ? 16 : config.textSize === 'large' ? 20 : 24;

  // We only show Navbar/Footer on public/marketing pages
  const isPublicRoute = location.pathname === '/' || location.pathname === '/contact-us';

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-300 ${config.highContrast ? 'high-contrast bg-[#000] text-[#ffeb3b] font-inter' : 'bg-[var(--color-primary-white)] text-[var(--color-primary-black)] font-inter'}`}
      style={{ '--base-size': `${baseSize}px` }}
    >
      {isPublicRoute && <Navbar openSettings={() => setIsSettingsOpen(true)} />}

      <main className={`flex-grow relative ${isPublicRoute ? 'pt-28 md:pt-32' : ''}`}>
        {!config.highContrast && (
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--color-accent-orange)_0%,_transparent_25%),_radial-gradient(circle_at_bottom_left,_var(--color-primary-black)_0%,_transparent_30%)] mix-blend-multiply opacity-10"></div>
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/senior-hub" element={<ProtectedRoute><SeniorHub /></ProtectedRoute>} />
            <Route path="/volunteer-hub" element={<ProtectedRoute><VolunteerHub /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>

      {isPublicRoute && <Footer />}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        setConfig={setConfig}
      />
    </div>
  );
}
