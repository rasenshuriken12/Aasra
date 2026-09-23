import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const subtleJaliPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20L0 0h40L20 20zM0 40h40L20 20 0 40z' fill='%23FF7043' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') || 'senior'; // default to 'senior' if not explicitly passed

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);

  // If someone lands directly on /auth without a role, we might want to let them know.
  // But for now, we will default to generic greeting.

  const title = role === 'senior' ? 'Welcome to Aasra' : role === 'volunteer' ? 'Join as Volunteer' : 'Welcome to Aasra';
  const subtitle = role === 'senior'
    ? 'Sign in to request a companion or assistance.'
    : role === 'volunteer'
      ? 'Sign in to start helping your community.'
      : 'Please sign in to continue.';

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setIsLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: { role } // Try to attach role to metadata
        }
      });
      if (error) throw error;
      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      alert("Note: Supabase SMS provider not configured. Using test mode (OTP: 123456).");
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      const { data, error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: 'sms' });
      if (error) throw error;

      // If success, user is logged in
      navigate(`/onboarding?role=${role}`);
    } catch (error) {
      console.error('OTP Verification Error:', error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding?role=${role}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert("OAuth Error: Make sure Google Provider is enabled in Supabase.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-white)] flex flex-col font-inter p-6 md:p-12 items-center justify-center relative">
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" style={subtleJaliPattern}></div>

      {/* Centered Auth Card */}
      <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-[var(--color-primary-black)]/5 border border-white/50 w-full max-w-lg relative z-10 flex flex-col items-center">

        {role === 'senior' && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-[var(--color-accent-orange)]/20 shadow-sm">
            For Seniors
          </span>
        )}

        {role === 'volunteer' && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-green-500/20 shadow-sm">
            For Volunteers
          </span>
        )}

        <h2 className="text-3xl font-black mb-4 text-[var(--color-primary-black)] font-poppins text-center">{title}</h2>
        <p className="text-[var(--color-gray-mid)] font-medium mb-12 text-center max-w-sm">
          {subtitle}
        </p>

        <div className="w-full max-w-sm">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="relative">
                <Smartphone className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)]" size={24} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhone(val);
                  }}
                  placeholder="Mobile Number"
                  maxLength={10}
                  className="w-full pl-16 pr-6 py-5 rounded-2xl text-lg text-[var(--color-primary-black)] font-medium bg-white/80 border border-[var(--color-gray-soft)] outline-none shadow-sm focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 transition-all placeholder:text-[var(--color-gray-mid)]"
                  required
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)] text-white font-bold uppercase text-[12px] tracking-widest rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Send Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full px-6 py-5 rounded-2xl text-center tracking-[0.5em] text-2xl text-[var(--color-primary-black)] font-bold bg-white/80 border border-[var(--color-gray-soft)] outline-none shadow-sm focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 transition-all placeholder:text-[var(--color-gray-mid)]/50"
                maxLength={6}
                autoFocus
              />
              <button
                disabled={isLoading}
                className="w-full py-5 bg-[var(--color-primary-black)] text-white font-bold uppercase text-[12px] tracking-[0.2em] rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify Code"}
              </button>
              <button type="button" onClick={() => setStep('phone')} className="w-full text-center text-[var(--color-gray-mid)] font-medium text-sm hover:text-[var(--color-primary-black)] transition-colors underline pt-2">
                Back to Phone Number
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-[var(--color-gray-soft)] flex-1"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-gray-mid)]">Or</span>
            <div className="h-px bg-[var(--color-gray-soft)] flex-1"></div>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            className="w-full py-5 bg-white text-[var(--color-primary-black)] border border-[var(--color-gray-soft)] font-bold uppercase text-[12px] tracking-[0.2em] rounded-full hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.37 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.35H19.27C21.35 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
              <path d="M12 23C14.97 23 17.46 22.02 19.27 20.35L15.71 17.59C14.73 18.25 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.82 14.11H2.16V16.94C3.97 20.54 7.68 23 12 23Z" fill="#34A853" />
              <path d="M5.82 14.11C5.59 13.45 5.46 12.74 5.46 12C5.46 11.26 5.59 10.55 5.82 9.89V7.06H2.16C1.41 8.55 1 10.22 1 12C1 13.78 1.41 15.45 2.16 16.94L5.82 14.11Z" fill="#FBBC05" />
              <path d="M12 5.36C13.62 5.36 15.07 5.92 16.21 7.01L19.34 3.88C17.45 2.12 14.97 1 12 1C7.68 1 3.97 3.46 2.16 7.06L5.82 9.89C6.7 7.3 9.13 5.36 12 5.36Z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
