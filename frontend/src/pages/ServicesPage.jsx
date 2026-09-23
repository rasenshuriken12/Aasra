import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Clock,
  Car,
  Stethoscope,
  Heart,
  MessageSquare,
  ShoppingBasket,
  Pill,
  Wrench,
  CreditCard,
  ShieldAlert,
  MapPin,
  Accessibility,
  ArrowRight,
  Footprints,
  PartyPopper,
  AlertCircle
} from 'lucide-react';

const subtleJaliPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20L0 0h40L20 20zM0 40h40L20 20 0 40z' fill='%23FF7043' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
};

const Badge = ({ children }) => (
  <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-[var(--color-accent-orange)]/20 shadow-sm">
    {children}
  </span>
);

const SectionHeader = ({ badge, title, subtitle }) => (
  <div className="mb-16 text-center">
    {badge && <Badge>{badge}</Badge>}
    <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary-black)] mb-6 tracking-tight font-poppins relative inline-block">
      {title}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)] rounded-full"></div>
    </h2>
    {subtitle && (
      <p className="text-base text-[var(--color-gray-mid)] max-w-2xl mx-auto leading-relaxed font-medium mt-8">
        {subtitle}
      </p>
    )}
  </div>
);

const ProblemBadge = ({ problem, problemIcon: ProblemIcon }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-9 h-9 rounded-xl bg-[var(--color-accent-orange)]/10 border border-[var(--color-accent-orange)]/20 flex items-center justify-center hover:bg-[var(--color-accent-orange)]/20 transition-all cursor-pointer"
      >
        <ProblemIcon size={16} className="text-[var(--color-accent-orange)]" />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 px-4 py-2.5 bg-[var(--color-primary-black)] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-xl whitespace-nowrap z-20"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={12} className="text-[var(--color-accent-orange)]" />
              {problem}
            </div>
            <div className="absolute -top-1 right-4 w-2 h-2 bg-[var(--color-primary-black)] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const serviceCategories = [
    {
      name: "Daily Help",
      items: [
        { title: "Walking Buddy", desc: "Daily morning/evening walks with a volunteer", icon: Footprints, problem: "Isolation & Loneliness", problemIcon: MessageSquare },
        { title: "Chat with Volunteers", desc: "Video or voice calls when you feel lonely", icon: MessageSquare, problem: "Isolation & Loneliness", problemIcon: Heart },
        { title: "Grocery Shopping", desc: "Volunteer shops from your list, delivers home", icon: ShoppingBasket, problem: "Unable to lift/carry", problemIcon: ShoppingBasket },
        { title: "Medicine Delivery", desc: "Pickup from pharmacy, doorstep delivery", icon: Pill, problem: "Unable to lift/carry", problemIcon: ShoppingBasket },
        { title: "Home Maintenance", desc: "Small repairs, AC filter cleaning, Gardening Help", icon: Wrench, problem: "Home maintenance", problemIcon: Wrench },
        { title: "Bill Payment Assistance", desc: "Help with online payments (electricity, water, mobile)", icon: CreditCard, problem: "Technology gap", problemIcon: Accessibility },
      ]
    },
    {
      name: "Prescheduled Visits",
      items: [
        { title: "Doctor Visits", desc: "Volunteer accompanies you to clinic/hospital", icon: Stethoscope, problem: "Dependency on family", problemIcon: Heart },
        { title: "Travel to Weddings", desc: "Companion for outstation events", icon: Car, problem: "Dependency on family", problemIcon: Heart },
        { title: "Attending Events", desc: "Company for religious, social, or family functions", icon: PartyPopper, problem: "Dependency on family", problemIcon: Heart },
      ]
    }
  ];

  return (
    <div className="pb-32 font-inter text-[var(--color-primary-black)] bg-[var(--color-primary-white)]">
      {/* Aasra Title */}
      <div className="text-center mb-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-[var(--color-primary-black)] font-poppins opacity-90">
          Aasra
        </h1>
      </div>

      {/* About Section */}
      <section className="py-8 px-6 max-w-5xl mx-auto border-b border-[var(--color-gray-soft)] relative">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 bg-white/60 backdrop-blur-3xl p-12 rounded-[2.5rem] border border-white/50 shadow-xl shadow-[var(--color-primary-black)]/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" style={subtleJaliPattern}></div>
          <div className="space-y-6 relative z-10">
            <p className="text-lg font-bold leading-relaxed text-[var(--color-primary-black)]/90">
              Born from the reality that 19,500 Indians turn 60 every day, and traditional family support is fading, AASRA exists to ensure no senior feels alone, helpless, or forgotten.
            </p>
            <p className="text-[var(--color-gray-mid)] font-medium leading-relaxed">
              Our volunteers are students and young professionals — kind, patient, and background-verified through in-person visits. They are not just helpers; they are <span className="text-[var(--color-accent-orange)] font-extrabold">companions who care</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate('/auth?role=senior')}
                className="flex-1 py-4 bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)] text-white font-bold uppercase text-[10px] tracking-widest rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 border border-transparent"
              >
                <span className="text-sm">Seniors</span>
                <span className="text-[10px] opacity-90">I need Help</span>
              </button>
              <button
                onClick={() => navigate('/auth?role=volunteer')}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 border border-transparent"
              >
                <span className="text-sm">Volunteers</span>
                <span className="text-[10px] opacity-90">I want to Help</span>
              </button>
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-[var(--color-gray-soft)] hover:shadow-md transition-shadow">
              <h4 className="font-bold uppercase text-[0.75rem] tracking-widest mb-2 text-[var(--color-primary-black)]">Verified Volunteers</h4>
              <p className="text-xs text-[var(--color-gray-mid)]">In-person visit, document check, reference verification.</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-[var(--color-gray-soft)] hover:shadow-md transition-shadow">
              <h4 className="font-bold uppercase text-[0.75rem] tracking-widest mb-2 text-[var(--color-primary-black)]">Accessibility First</h4>
              <p className="text-xs text-[var(--color-gray-mid)]">Voice navigation, big fonts, high contrast, multi-language.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Our Services */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <SectionHeader title="Our Services" />
        <div className="space-y-20">
          {serviceCategories.map((cat, i) => (
            <div key={i}>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-10 border-l-4 border-[var(--color-accent-orange)] pl-6 text-[var(--color-primary-black)]">{cat.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((item, j) => (
                  <div key={j} className="p-8 bg-white/70 backdrop-blur-lg border border-[var(--color-gray-soft)] rounded-[2rem] hover:border-[var(--color-accent-orange)]/50 hover:shadow-xl shadow-sm transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-orange)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-accent-orange)]/10 transition-colors pointer-events-none"></div>
                    {item.problem && <ProblemBadge problem={item.problem} problemIcon={item.problemIcon} />}
                    <div className="w-12 h-12 bg-white border border-[var(--color-gray-soft)] rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-gradient-to-br group-hover:from-[var(--color-accent-orange)] group-hover:to-[var(--color-accent-saffron)] group-hover:text-white group-hover:border-transparent transition-all">
                      <item.icon size={24} className="text-[var(--color-primary-black)] group-hover:text-white" />
                    </div>
                    <h4 className="font-bold text-[var(--color-primary-black)] mb-2 font-instrument text-xl">{item.title}</h4>
                    <p className="text-xs text-[var(--color-gray-mid)] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 px-6 max-w-5xl mx-auto bg-gradient-to-b from-[var(--color-gray-soft)]/30 to-transparent rounded-[3rem] border border-[var(--color-gray-soft)]">
        <SectionHeader title="Subscription Plans" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-12">
          <div className="relative overflow-hidden p-10 bg-gradient-to-br from-[var(--color-primary-black)] to-[#1E293B] text-[var(--color-primary-white)] rounded-[2rem] flex flex-col items-center text-center shadow-2xl border border-[var(--color-primary-black)]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" style={subtleJaliPattern}></div>
            <div className="relative z-10 w-full flex flex-col items-center">
              <h3 className="font-bold uppercase tracking-widest text-[11px] mb-8 text-[var(--color-gray-mid)]">Monthly Plan</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold font-instrument text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)]">₹2000</span>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[var(--color-gray-mid)]">+ Travel Charges</p>
              </div>
              <ul className="space-y-4 mb-10 text-sm font-bold opacity-90">
                <li>5 sessions/month</li>
                <li className="text-[var(--color-accent-orange)]">1 session FREE</li>
              </ul>
              <button className="w-full py-4 bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)] text-white font-bold uppercase text-[10px] tracking-widest rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">Choose Plan</button>
            </div>
          </div>
          <div className="p-10 bg-white/80 backdrop-blur-xl border border-[var(--color-gray-soft)] rounded-[2rem] flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold uppercase tracking-widest text-[11px] mb-8 text-[var(--color-gray-mid)]">Session Plan</h3>
            <div className="mb-8">
              <span className="text-5xl font-bold font-instrument text-[var(--color-primary-black)]">₹500</span>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[var(--color-gray-mid)]">+ Travel Charges</p>
            </div>
            <ul className="space-y-4 mb-10 text-sm font-bold text-[var(--color-primary-black)]/70">
              <li>Pay per session</li>
              <li>No commitment</li>
            </ul>
            <button className="w-full py-4 bg-[var(--color-gray-soft)] text-[var(--color-primary-black)] font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-[var(--color-primary-black)] hover:text-white transition-colors border border-[var(--color-gray-soft)]">Choose Plan</button>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-12 pb-12">
          <div className="flex items-center gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-[var(--color-gray-soft)] shadow-sm">
            <div className="p-3 rounded-full bg-[var(--color-gray-soft)]">
              <Clock size={20} className="text-[var(--color-primary-black)]" />
            </div>
            <p className="text-xs font-bold text-[var(--color-primary-black)]/80">One session = Up to 1 hour of help</p>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-[var(--color-gray-soft)] shadow-sm">
            <div className="p-3 rounded-full bg-[var(--color-gray-soft)]">
              <Car size={20} className="text-[var(--color-primary-black)]" />
            </div>
            <p className="text-xs font-bold text-[var(--color-primary-black)]/80">Travel: Actual fare or ₹10/km</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
