import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Eye, Languages, Volume2 } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, config, setConfig }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[var(--color-primary-black)]/30 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--color-primary-white)] w-full max-w-sm rounded-[2.5rem] shadow-2xl shadow-[var(--color-primary-black)]/10 border border-[var(--color-accent-orange)]/10 flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-[var(--color-gray-soft)] flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--color-primary-black)] font-instrument">Settings</h3>
              <button onClick={onClose} className="p-2 hover:bg-[var(--color-gray-soft)] rounded-full transition-colors text-[var(--color-gray-mid)] hover:text-[var(--color-accent-orange)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-10 pb-12 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-gray-mid)]">
                  <Type size={12} /> Text Size
                </div>
                <div className="flex bg-[var(--color-gray-soft)] p-1 rounded-xl">
                  {['normal', 'large', 'xl'].map((size) => (
                    <button 
                      key={size} 
                      onClick={() => setConfig({...config, textSize: size})} 
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase transition-all ${config.textSize === size ? 'bg-[var(--color-primary-black)] text-[var(--color-primary-white)] shadow-md' : 'text-[var(--color-gray-mid)] hover:text-[var(--color-primary-black)]'}`}
                    >
                      {size === 'xl' ? 'Extra' : size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-gray-mid)]">
                    <Eye size={12} /> Accessibility
                  </div>
                  <p className="text-sm font-bold text-[var(--color-primary-black)] font-inter">High Contrast</p>
                </div>
                <button 
                  onClick={() => setConfig({...config, highContrast: !config.highContrast})} 
                  className={`w-12 h-7 rounded-full relative transition-colors border ${config.highContrast ? 'bg-[var(--color-accent-orange)] border-[var(--color-accent-orange)]' : 'bg-[var(--color-gray-soft)] border-[var(--color-gray-mid)]/20'}`}
                >
                  <motion.div 
                    animate={{ x: config.highContrast ? 20 : 4 }} 
                    className={`absolute top-1 w-5 h-5 rounded-full shadow-sm ${config.highContrast ? 'bg-white' : 'bg-[var(--color-gray-mid)]'}`} 
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-gray-mid)]">
                    <Volume2 size={12} /> Audio
                  </div>
                  <p className="text-sm font-bold text-[var(--color-primary-black)] font-inter">Read Mode</p>
                </div>
                <button 
                  onClick={() => setConfig({...config, readMode: !config.readMode})} 
                  className={`w-12 h-7 rounded-full relative transition-colors border ${config.readMode ? 'bg-[var(--color-primary-black)] border-[var(--color-primary-black)]' : 'bg-[var(--color-gray-soft)] border-[var(--color-gray-mid)]/20'}`}
                >
                  <motion.div 
                    animate={{ x: config.readMode ? 20 : 4 }} 
                    className={`absolute top-1 w-5 h-5 rounded-full shadow-sm ${config.readMode ? 'bg-white' : 'bg-[var(--color-gray-mid)]'}`} 
                  />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-gray-mid)]">
                  <Languages size={12} /> Language
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['English', 'Hindi', 'Marathi'].map((label) => (
                    <button 
                      key={label} 
                      onClick={() => setConfig({...config, language: label.toLowerCase()})} 
                      className={`py-3 rounded-xl border-2 text-[9px] font-bold uppercase tracking-widest transition-all ${config.language === label.toLowerCase() ? 'bg-[var(--color-primary-black)] border-[var(--color-primary-black)] text-[var(--color-primary-white)] shadow-sm' : 'bg-transparent border-[var(--color-gray-soft)] text-[var(--color-gray-mid)] hover:border-[var(--color-gray-mid)]/30 hover:text-[var(--color-primary-black)]'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
