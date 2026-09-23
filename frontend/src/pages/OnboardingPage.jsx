import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, MapPin, HeartPulse, Users, Loader2, CheckCircle, Plus, Trash2, Info } from 'lucide-react';

const subtleJaliPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20L0 0h40L20 20zM0 40h40L20 20 0 40z' fill='%23FF7043' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') || 'senior';

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [user, setUser] = useState(null);

  // Common State
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    age: '',
    email: '',

    // Senior Specific
    live_alone: false,
    health_issues: [],
    other_health_issue: '',
    has_emergency_contacts: false,
    emergency_contacts: [{ name: '', phone: '', email: '' }],
    additional_info: '',

    // Volunteer Specific
    occupation: ''
  });

  const healthOptions = ['Diabetes', 'Blood Pressure', 'Mobility Issues', 'Vision Impairment', 'Hearing Impairment'];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);

      // Check if user is already onboarded
      const { data: profile } = await supabase.from('profiles').select('location_data, full_name, phone_number').eq('id', user.id).single();

      if (profile && profile.location_data) {
        // Already onboarded, skip this page
        navigate(role === 'volunteer' ? '/volunteer-hub' : '/senior-hub');
        return;
      }

      // Smart Auto-filling from Auth Provider (Google OAuth or Phone OTP)
      if (user.user_metadata && user.user_metadata.full_name) {
        setFormData(prev => ({ ...prev, full_name: user.user_metadata.full_name }));
      }
      if (user.email) {
        setFormData(prev => ({ ...prev, email: user.email }));
      }
      if (user.age) {
        setFormData(prev => ({ ...prev, age: user.age }));
      }
      if (user.phone) {
        const phoneDigits = user.phone.replace(/\D/g, '').slice(-10);
        setFormData(prev => ({ ...prev, phone_number: phoneDigits }));
      }

      setIsCheckingProfile(false);
    };
    fetchUser();
  }, [navigate, role]);

  const handleCheckboxChange = (issue) => {
    setFormData(prev => {
      const current = prev.health_issues;
      if (current.includes(issue)) {
        return { ...prev, health_issues: current.filter(i => i !== issue) };
      } else {
        return { ...prev, health_issues: [...current, issue] };
      }
    });
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: [...prev.emergency_contacts, { name: '', phone: '', email: '' }]
    }));
  };

  const updateEmergencyContact = (index, field, value) => {
    setFormData(prev => {
      const newContacts = [...prev.emergency_contacts];
      newContacts[index][field] = value;
      return { ...prev, emergency_contacts: newContacts };
    });
  };

  const removeEmergencyContact = (index) => {
    if (formData.emergency_contacts.length === 1) return;
    setFormData(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const extra_data = role === 'senior' ? {
        age: formData.age,
        email: formData.email,
        address: formData.address,  // This is the saved address
        live_alone: formData.live_alone,
        health_issues: [...formData.health_issues, formData.other_health_issue].filter(Boolean),
        emergency_contacts: formData.has_emergency_contacts ? formData.emergency_contacts : [],
        additional_info: formData.additional_info
      } : {
        age: formData.age,
        email: formData.email,
        address: formData.address,  // This is the saved address for volunteers too
        occupation: formData.occupation
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: role,
          location_data: extra_data  // Address is stored here
        });

      if (error) throw error;

      alert("Profile Created Successfully!");
      navigate(role === 'volunteer' ? '/volunteer-hub' : '/senior-hub');
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || isCheckingProfile) return <div className="min-h-screen bg-[var(--color-primary-white)] flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-accent-orange)] w-8 h-8" /></div>;

  const isSenior = role === 'senior';

  return (
    <div className="min-h-screen bg-[var(--color-primary-white)] flex flex-col font-inter p-6 md:p-12 items-center relative pb-32">
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" style={subtleJaliPattern}></div>

      <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white w-full max-w-2xl relative z-10">

        <div className="text-center mb-10">
          <span className={`inline-block px-4 py-1.5 rounded-full ${isSenior ? 'bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] border-[var(--color-accent-orange)]/20' : 'bg-green-500/10 text-green-600 border-green-500/20'} text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border shadow-sm`}>
            {isSenior ? 'Senior Profile' : 'Volunteer Profile'}
          </span>
          <h2 className="text-3xl font-black mb-2 text-[var(--color-primary-black)] font-poppins">Complete Your Profile</h2>
          <p className="text-[var(--color-gray-mid)] font-medium">Just a few details before we get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* General Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><User size={20} /> Personal Details</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
              <input required type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none transition-all" placeholder="E.g. Ramesh Sharma" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Age</label>
                <input required type="number" min="18" max="120" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none transition-all" placeholder="Age" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                <input required type="tel" maxLength={10} value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value.replace(/\D/g, '') })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none transition-all" placeholder="10-digit number" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email (Optional)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none transition-all" placeholder="Email" />
              </div>
            </div>

            {/* Address Field - This will be saved to profile */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Address</label>
              <p className="text-xs text-gray-500 mb-1">This address will be saved and can be used for future bookings</p>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none transition-all"
                placeholder="Your residential address"
              />
            </div>

            {!isSenior && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Occupation / Studies</label>
                <input required type="text" value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-green-500 outline-none transition-all" placeholder="E.g. Computer Science Student, Teacher" />
              </div>
            )}
          </div>

          {/* Senior Specific Information */}
          {isSenior && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><HeartPulse size={20} /> Health & Living</h3>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:border-[var(--color-accent-orange)] transition-colors">
                  <input type="checkbox" checked={formData.live_alone} onChange={e => setFormData({ ...formData, live_alone: e.target.checked })} className="w-5 h-5 accent-[var(--color-accent-orange)]" />
                  <span className="font-medium text-gray-700">I currently live alone</span>
                </label>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Known Health Issues (Select all that apply)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {healthOptions.map(issue => (
                      <label key={issue} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:border-[var(--color-accent-orange)]">
                        <input type="checkbox" checked={formData.health_issues.includes(issue)} onChange={() => handleCheckboxChange(issue)} className="w-4 h-4 accent-[var(--color-accent-orange)]" />
                        <span className="text-sm font-medium text-gray-700">{issue}</span>
                      </label>
                    ))}
                  </div>
                  <input type="text" value={formData.other_health_issue} onChange={e => setFormData({ ...formData, other_health_issue: e.target.value })} className="w-full px-5 py-3 mt-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none text-sm" placeholder="Other health issues..." />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><Users size={20} /> Emergency Contacts</h3>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:border-[var(--color-accent-orange)] transition-colors">
                  <input type="checkbox" checked={formData.has_emergency_contacts} onChange={e => setFormData({ ...formData, has_emergency_contacts: e.target.checked })} className="w-5 h-5 accent-[var(--color-accent-orange)]" />
                  <span className="font-medium text-gray-700">I have emergency contacts (e.g., son/daughter)</span>
                </label>

                {formData.has_emergency_contacts && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    {formData.emergency_contacts.map((contact, index) => (
                      <div key={index} className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-4 relative">
                        {formData.emergency_contacts.length > 1 && (
                          <button type="button" onClick={() => removeEmergencyContact(index)} className="absolute top-4 right-4 text-orange-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        )}
                        <input required type="text" value={contact.name} onChange={e => updateEmergencyContact(index, 'name', e.target.value)} className="w-full pr-10 px-4 py-3 rounded-xl bg-white border border-orange-200 outline-none text-sm" placeholder="Contact Full Name" />
                        <div className="grid grid-cols-2 gap-4">
                          <input required type="tel" maxLength={10} value={contact.phone} onChange={e => updateEmergencyContact(index, 'phone', e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl bg-white border border-orange-200 outline-none text-sm" placeholder="Phone Number" />
                          <input type="email" value={contact.email} onChange={e => updateEmergencyContact(index, 'email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-orange-200 outline-none text-sm" placeholder="Email (Optional)" />
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={addEmergencyContact} className="w-full py-3 border-2 border-dashed border-orange-200 rounded-2xl text-orange-600 font-bold text-sm uppercase tracking-widest hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-center gap-2">
                      <Plus size={16} /> Add Another Contact
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><Info size={20} /> Additional Information</h3>
                <p className="text-sm text-[var(--color-gray-mid)]">Is there anything else you want our volunteers to know to better assist you?</p>
                <textarea
                  rows={3}
                  value={formData.additional_info}
                  onChange={e => setFormData({ ...formData, additional_info: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[var(--color-accent-orange)] outline-none transition-all"
                  placeholder="Preferences, special instructions, languages spoken, etc."
                />
              </div>

            </div>
          )}

          <button
            disabled={isLoading}
            className={`w-full py-5 text-white font-bold uppercase tracking-widest rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 ${isSenior ? 'bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)]' : 'bg-gradient-to-r from-green-500 to-green-600'}`}
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle size={20} /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;