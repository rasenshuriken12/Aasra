import React, { useState } from 'react';
import { Sidebar, BottomNav } from './Navigation.jsx';
import { AlertTriangle, X, Phone, Stethoscope, Flame, UserX, Megaphone, MapPin, Users, Timer, Navigation as NavIcon } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const SOSOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(231,76,60,0.08)] backdrop-blur-sm flex items-center justify-center p-5 z-[200]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white rounded-lg p-8 w-full max-w-[520px] shadow-[0_12px_40px_rgba(231,76,60,0.25)] border-3 border-[#E74C3C]"
      >
        <h2 className="text-[#E74C3C] font-poppins text-2xl mb-4 text-center flex items-center justify-center gap-2.5 font-bold">
          <AlertTriangle className="w-7 h-7" /> Emergency Mode
        </h2>
        
        <div className="bg-[#FEF2F2] p-4 rounded-sm mb-4">
          <div className="font-bold text-[#E74C3C] mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Sending SOS Alert...
          </div>
          <div className="text-sm mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Gomti Nagar, Lucknow
          </div>
          <div className="text-sm mb-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> Notifying: 3 volunteers, Family
          </div>
          <div className="font-semibold text-warm-orange mt-1.5 flex items-center gap-2">
            <Timer className="w-4 h-4" /> Estimated response: 3-5 minutes
          </div>
        </div>

        <div className="font-semibold mb-2 text-[15px]">What is happening?</div>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { icon: Stethoscope, label: 'Medical' },
            { icon: AlertTriangle, label: 'Fall or Injury' },
            { icon: Flame, label: 'Fire' },
            { icon: UserX, label: 'Suspicious Person' },
            { icon: Megaphone, label: 'Feeling Unsafe' },
            { icon: Phone, label: 'Call Family' }
          ].map((opt) => (
            <button key={opt.label} className="p-3.5 bg-[#FEF2F2] rounded-sm border-2 border-[#FECDD3] text-[15px] cursor-pointer text-center font-semibold transition-all flex items-center justify-center gap-2 hover:border-[#E74C3C]">
              <opt.icon className="w-5 h-5 text-[#E74C3C]" /> {opt.label}
            </button>
          ))}
        </div>

        <div className="w-full h-[100px] bg-gradient-to-br from-[#E8D5F5] to-[#D8F3DC] rounded-md flex flex-col items-center justify-center relative mb-3">
            <NavIcon className="w-8 h-8 opacity-60 mb-1" />
            <div className="text-sm">Live Responders</div>
        </div>

        <p className="text-sm text-gray-500 mb-3 text-center">Stay calm. Help is on the way.</p>
        
        <button className="w-full min-h-[50px] bg-[#E74C3C] text-white rounded-pill font-semibold text-[15px] mb-2 flex items-center justify-center gap-2 hover:bg-[#C0392B]">
          <Phone className="w-5 h-5" /> Call Family Now
        </button>
        <button onClick={onClose} className="w-full min-h-[50px] bg-gray-100 text-gray-500 rounded-pill font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-200">
          <X className="w-5 h-5" /> Cancel SOS
        </button>
      </motion.div>
    </div>
  );
};

const AppShell = ({ children, activeScreen, setScreen }) => {
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-white text-deep-navy">
      {/* Desktop Layout */}
      <Sidebar activeScreen={activeScreen} setScreen={setScreen} />
      
      {/* Mobile Layout */}
      <div className="md:hidden pt-4 px-4 pb-24">
        {children}
      </div>

      {/* Main Content Area (Desktop) */}
      <main className={clsx(
        "md:ml-[260px] min-h-screen p-8 md:p-10 transition-all",
        "hidden md:block"
      )}>
        <div className="max-w-[960px] mx-auto">
          {children}
        </div>
      </main>

      <BottomNav activeScreen={activeScreen} setScreen={setScreen} />

      {/* SOS Button (FAB) */}
      <button 
        onClick={() => setIsSOSOpen(true)}
        className="fixed bottom-[30px] right-[30px] w-16 h-16 bg-gradient-to-br from-[#E74C3C] to-[#C0392B] text-white rounded-full shadow-[0_6px_20px_rgba(231,76,60,0.4)] z-[90] flex items-center justify-center animate-pulse hover:scale-110 active:scale-95 transition-transform"
      >
        <AlertTriangle className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {isSOSOpen && <SOSOverlay isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default AppShell;
