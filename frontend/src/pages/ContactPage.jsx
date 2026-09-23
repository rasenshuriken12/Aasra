import React from 'react';
import { ShieldCheck, Heart, Users, ArrowRight, UserPlus, FileCheck, CheckCircle2 } from 'lucide-react';

const subtleJaliPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20L0 0h40L20 20zM0 40h40L20 20 0 40z' fill='%2316A34A' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`
};

const ContactPage = () => {
  const steps = [
    {
      icon: <UserPlus size={24} className="text-green-600" />,
      title: "1. Create Your Profile",
      description: "Sign up securely. Seniors can input their generic care preferences, while student volunteers submit identity validation paths."
    },
    {
      icon: <FileCheck size={24} className="text-green-600" />,
      title: "2. Real-time Verification",
      description: "Our platform validates accounts immediately, ensuring an absolute safe, trusted circle for everyone involved."
    },
    {
      icon: <CheckCircle2 size={24} className="text-green-600" />,
      title: "3. Post or Accept Tasks",
      description: "Seniors broadcast simple local errands. Volunteers track the dashboard stream live to accept and bridge the gap."
    }
  ];

  const services = [
    { title: "Essential Delivery", desc: "Timely drops for prescription medicine, groceries, and vital daily household requirements." },
    { title: "Technical Support", desc: "Patient smartphone management setup, online utility billing walkthroughs, and device tutorials." },
    { title: "Companion Visits", desc: "Empathetic check-ins, outdoor walk escorts, and meaningful intergenerational conversations." }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-primary-white)] text-[var(--color-primary-black)] pb-32 font-inter relative overflow-hidden">
      {/* Background Consistency Jali Grid */}
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" style={subtleJaliPattern}></div>

      {/* Page Header Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 text-center relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full text-green-700 font-bold text-xs uppercase tracking-widest">
          <Heart size={14} fill="currentColor" /> About Aasra
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-poppins tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-800 max-w-3xl mx-auto leading-tight">
          Bridging Generations, Building Community
        </h1>
        <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Aasra links senior citizens looking for minor daily help with enthusiastic student volunteers to foster safety, connection, and mutual support.
        </p>
      </header>

      {/* Main Container Core Section */}
      <main className="max-w-5xl mx-auto px-6 mt-16 md:mt-24 relative z-10 space-y-24">
        
        {/* Split Mission Section showcasing custom curved image alignment */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-3xl font-black font-poppins tracking-tight">Our Mission</h2>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              We recognized a massive guidance gap in urban spaces where senior citizens encounter difficulties managing physical errands, digital landscapes, or finding reliable home companionship. 
              Our elderly citizens often need nothing more than a listening ear to talk to, a little love to brighten their day, and the reassuring comfort of community support and care. Aasra is designed to be exactly that—a trusted companion and a vibrant community hub that connects seniors with student volunteers eager to make a positive impact.
            </p>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              By utilizing real-time software orchestration, Aasra mobilizes verified student volunteers to earn social credits while actively improving community welfare networks.
            </p>
            <div className="flex gap-6 pt-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 uppercase tracking-wider">
                <ShieldCheck className="text-green-600" size={20} /> Safe & Verified
              </div>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 uppercase tracking-wider">
                <Users className="text-green-600" size={20} /> Community Driven
              </div>
            </div>
          </div>
          
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-300">
              <img 
                src="https://cdn.prod.website-files.com/64346b30862d25ed3b9116d2/66cf96ce00efc1dd734a762b_u6521274849_generate_a_cover_for_a_blog_article_Intergenerati.png" 
                alt="Intergenerational Care Bonding"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Dynamic Core Services Breakdown Panels */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black font-poppins tracking-tight text-center">Core Pillars of Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-slate-900/5 hover:border-green-200 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-slate-900">{srv.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Pipeline Section Layout */}
        <section className="bg-gradient-to-br from-green-50/50 to-emerald-50/20 border border-green-100 rounded-[2.5rem] p-10 md:p-14 space-y-12 shadow-sm">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black font-poppins tracking-tight">How It Works</h2>
            <p className="text-sm font-bold text-green-700 uppercase tracking-widest">Getting started takes less than 3 minutes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, idx) => (
              <div key={idx} className="space-y-4 relative bg-white/40 p-6 rounded-2xl border border-white/60">
                <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                  {st.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default ContactPage;