import React from 'react';

const Footer = () => (
  <footer className="pt-24 pb-12 px-6 border-t border-[var(--color-gray-soft)] bg-[var(--color-primary-white)]">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 text-left">
        <div>
          <span className="text-3xl font-black tracking-tighter text-[var(--color-primary-black)] font-poppins mb-6 block">Aasra</span>
          <p className="text-[var(--color-gray-mid)] max-w-xs font-medium leading-relaxed">
            Ensuring no senior feels alone, helpless, or forgotten. A community-driven companion platform.
          </p>
        </div>
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gray-mid)] mb-8 font-inter">Links</h5>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary-black)]/70">
            <li className="hover:text-[var(--color-accent-orange)] transition-colors cursor-pointer">Services</li>
            <li className="hover:text-[var(--color-accent-orange)] transition-colors cursor-pointer">Contact Us</li>
            <li className="hover:text-[var(--color-accent-orange)] transition-colors cursor-pointer">Privacy</li>
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gray-mid)] mb-8 font-inter">Connect</h5>
          <ul className="space-y-4 text-xs font-bold text-[var(--color-primary-black)]/70">
            <li className="hover:text-[var(--color-accent-orange)] transition-colors cursor-pointer">hello@aasra.com</li>
            <li className="hover:text-[var(--color-accent-orange)] transition-colors cursor-pointer">+91 98765 43210</li>
            <li>Mumbai, Maharashtra</li>
          </ul>
        </div>
      </div>
      <div className="pt-12 border-t border-[var(--color-gray-soft)] flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-gray-mid)] gap-6 font-inter">
        <span>© Aasra 2026</span>
        <span>Mumbai - 400001</span>
      </div>
    </div>
  </footer>
);

export default Footer;
