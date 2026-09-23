import React from 'react';
import { Home, HandHelping, Navigation, Pill, Users, ShieldCheck, User, Volume2, AlertTriangle, Mic } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ activeScreen, setScreen }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'help', icon: HandHelping, label: 'Request Help' },
    { id: 'tracking', icon: Navigation, label: 'Active Request' },
    { id: 'medicines', icon: Pill, label: 'Medicines' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'safety', icon: ShieldCheck, label: 'Safety Map' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white shadow-[4px_0_20px_rgba(44,62,80,0.06)] flex flex-col z-[100] p-6 hidden md:flex">
      <div className="flex items-center gap-3 mb-8 px-3">
        <div className="w-9 h-9 border-2 border-soft-lavender rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-warm-orange rounded-full" />
        </div>
        <span className="font-poppins font-bold text-2xl bg-gradient-to-br from-warm-orange to-soft-lavender bg-clip-text text-transparent">
          AASRA
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3.5 rounded-sm font-semibold transition-all text-left text-gray-500",
              activeScreen === item.id 
                ? "bg-gradient-to-br from-[rgba(255,140,66,0.12)] to-[rgba(197,185,224,0.12)] text-warm-orange font-bold" 
                : "hover:bg-cream-white hover:text-deep-navy"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-3 p-4 bg-cream-white rounded-md mt-auto">
        <div className="w-12 h-12 bg-gradient-to-br from-soft-lavender to-warm-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
          R
        </div>
        <div>
          <div className="font-bold text-base text-deep-navy">Rajesh Kumar</div>
          <div className="text-[13px] text-gray-400">Trust Score: 4.8</div>
        </div>
      </div>
    </aside>
  );
};

const BottomNav = ({ activeScreen, setScreen }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'help', icon: HandHelping, label: 'Help' },
    { id: 'community', icon: Users, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white flex justify-around py-2 pb-4 shadow-[0_-4px_20px_rgba(44,62,80,0.08)] border-t border-gray-100 z-10 md:hidden">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-2 py-1 transition-all text-[11px]",
            activeScreen === item.id ? "text-warm-orange" : "text-gray-400"
          )}
        >
          <item.icon className="w-5.5 h-5.5" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export { Sidebar, BottomNav };
