import React from 'react';
import { Mic, Check, X } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const VoiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(44,62,80,0.35)] backdrop-blur-sm flex items-center justify-center p-5 z-[150]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-8 w-full max-w-[440px] text-center shadow-lg"
      >
        <div className="mb-4 flex justify-center">
          <Mic className="w-13 h-13 text-warm-orange" />
        </div>
        <div className="font-poppins text-2xl font-bold mb-2">Listening...</div>
        <div className="text-[17px] text-gray-500 mb-5">What do you need help with?</div>
        
        <div className="my-5 h-[30px] flex items-end justify-center gap-1">
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((delay, i) => {
            const heights = [10, 15, 20, 25, 30, 25, 20, 15, 10];
            return (
              <motion.div 
                key={i}
                animate={{ height: [heights[i], heights[i] + 10, heights[i]] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: delay }}
                className="w-1 bg-warm-orange rounded-sm"
                style={{ height: heights[i] }}
              />
            );
          })}
        </div>

        <div className="bg-cream-white p-3 rounded-md mb-4 text-[15px] text-deep-navy">
          "I need someone to take me to the doctor at 3 PM"
        </div>

        <div className="flex flex-col gap-2.5">
          <button onClick={onClose} className="w-full min-h-[50px] bg-warm-orange text-white rounded-pill text-lg font-semibold flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> Confirm
          </button>
          <button onClick={onClose} className="w-full min-h-[50px] bg-white text-deep-navy border-2 border-soft-lavender rounded-pill text-lg font-semibold flex items-center justify-center gap-2">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceModal;
