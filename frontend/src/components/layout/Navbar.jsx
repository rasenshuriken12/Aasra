import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  LogIn
} from 'lucide-react';

const Navbar = ({ activePage, setActivePage, openSettings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', id: '/' },
    { name: 'Contact Us', id: '/contact-us' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40" 
            onClick={() => setIsMenuOpen(false)} 
          />
        )}
      </AnimatePresence>

      <nav className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6">
        <div className={`max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-6 md:px-10 py-3 flex items-center justify-between shadow-lg shadow-[var(--color-primary-black)]/5 transition-all duration-500 ${scrolled ? 'py-2 bg-white/90 shadow-xl' : ''}`}>
          
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('home')}>
            <span className="text-xl md:text-2xl font-black tracking-tight text-[var(--color-primary-black)] font-poppins">Aasra</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => handleNavClick(item.id)} 
                className={`text-lg font-bold uppercase tracking-widest transition-all relative py-1 ${location.pathname === item.id ? 'text-[var(--color-accent-orange)]' : 'text-gray-600 hover:text-[var(--color-primary-black)]'}`}
              >
                {item.name}
                {location.pathname === item.id && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={openSettings} 
              className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-[#0f172a] hover:text-[#c2410c] transition-colors px-4"
            >
              <SettingsIcon size={20} /> Settings
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white text-lg font-bold uppercase tracking-widest rounded-[1.5rem] shadow-[0_6px_0_0_#020617] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#020617] active:translate-y-[6px] active:shadow-none transition-all font-instrument border-2 border-[#0f172a]"
            >
              <LogIn size={20} /> Sign In
            </button>
          </div>

          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.span animate={isMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }} className="w-6 h-0.5 bg-[var(--color-primary-black)] block absolute" />
            <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-0.5 bg-[var(--color-primary-black)] block absolute" />
            <motion.span animate={isMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }} className="w-6 h-0.5 bg-[var(--color-primary-black)] block absolute" />
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -10, scale: 0.98 }} 
              className="absolute top-full left-4 right-4 mt-4 p-8 bg-white/95 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-8 text-center">
                {navItems.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleNavClick(item.id)} 
                    className={`text-xl font-black uppercase tracking-widest ${location.pathname === item.id ? 'text-[var(--color-accent-orange)]' : 'text-gray-600'}`}
                  >
                    {item.name}
                  </button>
                ))}
                <div className="h-px bg-gray-200 my-4" />
                <button 
                  onClick={() => { openSettings(); setIsMenuOpen(false); }}
                  className="flex items-center justify-center gap-3 text-xl font-bold uppercase tracking-widest text-[#0f172a]"
                >
                  <SettingsIcon size={24} /> Settings
                </button>
                <button 
                  onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                  className="w-full py-6 bg-[#0f172a] text-white text-xl font-bold uppercase tracking-widest rounded-[1.5rem] shadow-[0_6px_0_0_#020617] flex items-center justify-center gap-4 mt-4"
                >
                  <LogIn size={24} /> Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
