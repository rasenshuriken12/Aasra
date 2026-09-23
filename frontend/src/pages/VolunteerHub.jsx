import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, ShieldCheck, MapPin, Clock, Award, Star, AlertTriangle, Loader2 } from 'lucide-react';

import { supabase } from '../lib/supabase';

const subtleJaliPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20L0 0h40L20 20zM0 40h40L20 20 0 40z' fill='%2316A34A' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
};

const VolunteerHub = () => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'uploaded', 'verified'
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // --- NEW LIVE CORE STATES ---
  const [activeRequests, setActiveRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [stats, setStats] = useState({ sessions: 0, hours: 0, rating: 0 });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const initializeDashboardData = async () => {
      // 1. Get Logged-In User Credentials
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setIsDataLoading(false);
        return;
      }
      setUser(authUser);

      // 2. Fetch Profile details and average rating metrics
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, rating_avg')
        .eq('id', authUser.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // 3. Aggregate historical session contribution numbers
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('duration_hours')
        .eq('volunteer_id', authUser.id)
        .eq('status', 'completed');

      if (sessionsData) {
        const totalSessions = sessionsData.length;
        const totalHours = sessionsData.reduce((acc, curr) => acc + (curr.duration_hours || 0), 0);
        setStats({
          sessions: totalSessions,
          hours: totalHours,
          rating: profileData?.rating_avg || 0
        });
      }

      // 4. Load initial pending senior assistance requests
      const { data: requestRecords, error: requestError } = await supabase
        .from('service_requests')
        .select(`
          id,
          description,
          service_type,
          scheduled_at,
          manual_address,
          user_id
        `)
        .eq('status', 'pending');

      if (requestError) {
        console.error("Error fetching service requests:", requestError);
      }

      if (requestRecords && requestRecords.length > 0) {
        // Manually fetch profiles to avoid foreign key relation errors
        const userIds = [...new Set(requestRecords.map(req => req.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
          
        const profileMap = {};
        if (profilesData) {
          profilesData.forEach(p => {
            profileMap[p.id] = p.full_name;
          });
        }

        // Transform backend payload to align with your card layouts
        const formatted = requestRecords.map(req => ({
          id: req.id,
          name: profileMap[req.user_id] || "Senior Citizen",
          age: 70, // Fallback layout standard
          task: `${req.service_type.replace('_', ' ').toUpperCase()}: ${req.description}`,
          distance: req.manual_address || "Nearby", 
          time: new Date(req.scheduled_at).toLocaleDateString() + ", " + new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senior_id: req.user_id,
          scheduled_at: req.scheduled_at
        }));
        setActiveRequests(formatted);
      }

      // 6. Load accepted requests
      const { data: acceptedRecords, error: acceptedError } = await supabase
        .from('sessions')
        .select(`
          id,
          start_time,
          duration_hours,
          status,
          senior_id
        `)
        .eq('volunteer_id', authUser.id)
        .eq('status', 'confirmed');

      if (acceptedError) {
        console.error("Error fetching accepted sessions:", acceptedError);
      }

      if (acceptedRecords && acceptedRecords.length > 0) {
        // Manually fetch profiles
        const seniorIds = [...new Set(acceptedRecords.map(req => req.senior_id))];
        const { data: seniorProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', seniorIds);
          
        const seniorProfileMap = {};
        if (seniorProfiles) {
          seniorProfiles.forEach(p => {
            seniorProfileMap[p.id] = p.full_name;
          });
        }

        const formattedAccepted = acceptedRecords.map(req => ({
          id: req.id,
          name: seniorProfileMap[req.senior_id] || "Senior Citizen",
          age: 70,
          task: "Companion Session",
          distance: "Nearby",
          duration_hours: req.duration_hours || 1,
          time: new Date(req.start_time).toLocaleDateString() + ", " + new Date(req.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          scheduled_at: req.start_time
        }));
        setAcceptedRequests(formattedAccepted);
      }

      setIsDataLoading(false);

      // 5. Establish real-time persistent WebSocket connection channel
      const realtimeChannel = supabase
        .channel('public-requests-feed')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'service_requests' },
          async (payload) => {
            if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
              // Manually fetch profile for incoming request
              const { data: requesterProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.user_id)
                .single();

              const incomingCard = {
                id: payload.new.id,
                name: requesterProfile?.full_name || "Senior Citizen",
                age: 70,
                task: `${payload.new.service_type.replace('_', ' ').toUpperCase()}: ${payload.new.description}`,
                distance: payload.new.manual_address || "Nearby",
                time: new Date(payload.new.scheduled_at).toLocaleDateString() + ", " + new Date(payload.new.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                senior_id: payload.new.user_id,
                scheduled_at: payload.new.scheduled_at
              };

              setActiveRequests((prev) => [incomingCard, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              if (payload.new.status !== 'pending') {
                // If claimed or updated out of pending, clear from visibility array
                setActiveRequests((prev) => prev.filter(r => r.id !== payload.new.id));
              }
            } else if (payload.eventType === 'DELETE') {
              setActiveRequests((prev) => prev.filter(r => r.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtimeChannel);
      };
    };

    initializeDashboardData();
  }, []);

  const handleIDUpload = () => {
    setVerificationStatus('uploaded');
    setTimeout(() => {
      setVerificationStatus('verified');
      alert("✅ Identity Verification Complete. You are now an approved Aasra Volunteer!");
    }, 2000);
  };

  // --- REAL-TIME TRANSACTION ASSIGNMENT ---
  const handleAcceptRequest = async (selectedCard) => {
    if (!user) return;

    // Time conflict validation
    const newReqStart = new Date(selectedCard.scheduled_at).getTime();
    const newReqDuration = (selectedCard.duration_hours || 1) * 60 * 60 * 1000;
    const newReqEnd = newReqStart + newReqDuration;
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    
    const hasConflict = acceptedRequests.some(accepted => {
      const acceptedStart = new Date(accepted.scheduled_at).getTime();
      const acceptedDuration = (accepted.duration_hours || 1) * 60 * 60 * 1000;
      const acceptedEnd = acceptedStart + acceptedDuration;

      // Conflict exists if the time gap between them is less than 2 hours
      // Meaning: (new request starts before accepted ends + 2h) AND (accepted starts before new request ends + 2h)
      return (newReqStart < acceptedEnd + TWO_HOURS_MS) && (acceptedStart < newReqEnd + TWO_HOURS_MS);
    });

    if (hasConflict) {
      alert("⚠️ Time Conflict: You must leave at least a 2-hour gap between the end of one session and the start of another to account for travel time and extensions.");
      return;
    }

    try {
      setProcessingId(selectedCard.id);

      // Step A: Update the service request record status to accepted
      const { error: patchError } = await supabase
        .from('service_requests')
        .update({ status: 'accepted' })
        .eq('id', selectedCard.id);

      if (patchError) throw patchError;

      // Step B: Initialize a corresponding action log row inside the sessions layout table
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert([
          {
            senior_id: selectedCard.senior_id,
            volunteer_id: user.id,
            start_time: selectedCard.scheduled_at || new Date().toISOString(),
            duration_hours: selectedCard.duration_hours || 1,
            status: 'confirmed'
          }
        ]);

      if (sessionError) throw sessionError;

      // Step C: Remove the row component optimistically from the active state and add to accepted
      setActiveRequests((prev) => prev.filter(item => item.id !== selectedCard.id));
      setAcceptedRequests((prev) => [...prev, {
        id: selectedCard.id, // technically session id in real app, but ok for optimistic UI
        name: selectedCard.name,
        age: selectedCard.age,
        task: selectedCard.task,
        distance: selectedCard.distance,
        duration_hours: selectedCard.duration_hours || 1,
        time: selectedCard.time,
        scheduled_at: selectedCard.scheduled_at
      }]);
      alert(`🎯 Request Accepted! You have successfully committed to assist ${selectedCard.name}.`);

    } catch (err) {
      console.error("Failed executing assignment transaction:", err.message);
      alert(`Could not claim this request: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-700 font-inter">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
        <p className="text-sm font-bold tracking-widest uppercase text-gray-400">Syncing Aasra Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-white)] text-[var(--color-primary-black)] pb-32 font-inter relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" style={subtleJaliPattern}></div>

      {/* Volunteer Navbar */}
      <nav className="bg-white/80 backdrop-blur-md p-4 md:p-6 md:px-12 border-b border-[var(--color-gray-soft)] flex flex-col md:flex-row justify-between items-center gap-4 relative z-20">
        <div className="flex items-center gap-3 text-center md:text-left">
          <ShieldCheck size={32} className="text-green-600 hidden md:block" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-poppins tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">
              Volunteer Hub
            </h1>
            {profile && <p className="text-sm font-bold text-gray-500 mt-1">Hello, {profile.full_name}</p>}
          </div>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} className="text-sm font-bold uppercase tracking-widest text-[var(--color-green-600)] hover:text-gray-mid transition-colors px-6 py-2 border border-[var(--color-gray-soft)] rounded-full hover:shadow-sm">
          Sign Out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6 mt-12 relative z-10 space-y-12">

        {/* Verification Status Banner */}
        {verificationStatus !== 'verified' && (
          <div className="bg-orange-50 border border-orange-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Account Verification Pending</h3>
                <p className="text-sm text-[var(--color-gray-mid)] font-medium max-w-lg">
                  To ensure the safety of our seniors, all volunteers must undergo a strict KYC ID verification process before accepting requests.
                </p>
              </div>
            </div>
            <button
              onClick={handleIDUpload}
              disabled={verificationStatus === 'uploaded'}
              className="w-full md:w-auto px-8 py-4 bg-orange-600 text-white font-bold uppercase text-xs tracking-widest rounded-full hover:bg-orange-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {verificationStatus === 'uploaded' ? (
                <>Verifying ID...</>
              ) : (
                <><Upload size={18} /> Upload Aadhaar/ID</>
              )}
            </button>
          </div>
        )}

        {/* Reputation & Badges Section */}
        <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-xl shadow-[var(--color-primary-black)]/5 border border-white/50">
          <h2 className="text-2xl font-black mb-8 flex items-center justify-center md:justify-start gap-3 text-[var(--color-primary-black)] font-poppins">
            <Award className="text-green-600" size={28} />
            My Reputation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl md:text-4xl font-black text-green-600 mb-2">{stats.sessions}</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Sessions</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl md:text-4xl font-black text-green-600 mb-2">{stats.hours}</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Hours</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="flex text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill="currentColor" 
                    className={`md:w-6 md:h-6 ${i < Math.round(stats.rating) ? "opacity-100" : "opacity-30"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                Rating {stats.rating > 0 ? `(${stats.rating.toFixed(1)})` : ''}
              </span>
            </div>
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-4 md:p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-inner text-gray-500 border border-gray-300 border-dashed">
              <ShieldCheck size={24} className="md:w-8 md:h-8 mb-2 opacity-50" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-70">Badge Locked</span>
            </div>
          </div>
        </div>

        {/* My Accepted Requests */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-[var(--color-primary-black)] font-poppins">Upcoming Commitments</h2>
          </div>

          {acceptedRequests.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium text-lg">You don't have any accepted requests right now.</p>
            </div>
          ) : (
            acceptedRequests.map((req, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-green-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold">{req.name}</h3>
                      <span className="text-xs md:text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{req.age || "Senior"} yrs</span>
                    </div>
                    <p className="text-base md:text-lg font-medium text-gray-700 mb-4">{req.task || "Companion Session"}</p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-green-600 shrink-0" /> <span className="truncate max-w-[200px] sm:max-w-xs">{req.distance || "Nearby"}</span></span>
                      <span className="flex items-center gap-2"><Clock size={16} className="text-green-600 shrink-0" /> {req.time}</span>
                    </div>
                  </div>
                  <span className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-green-50 text-green-700 font-bold uppercase text-xs md:text-sm tracking-widest rounded-full border border-green-200 flex items-center justify-center gap-2 shrink-0">
                    <CheckCircle size={20} /> Confirmed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Requests */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-[var(--color-primary-black)] font-poppins">Local Requests</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wider animate-pulse whitespace-nowrap">
                ● Live Updates
              </span>
              {verificationStatus !== 'verified' && (
                <span className="text-[10px] sm:text-xs font-bold text-orange-600 bg-orange-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-widest whitespace-nowrap">Verification Required</span>
              )}
            </div>
          </div>

          {activeRequests.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium text-lg">No open helper requests found right now.</p>
              <p className="text-xs text-gray-400 mt-2">New postings submitted by senior citizens will populate here in real-time.</p>
            </div>
          ) : (
            activeRequests.map((req) => (
              <div key={req.id} className={`bg-white rounded-[2rem] p-8 border ${verificationStatus === 'verified' ? 'border-green-100 shadow-sm hover:shadow-md transition-shadow' : 'border-gray-200 opacity-60 pointer-events-none filter grayscale'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold truncate w-full">{req.name}</h3>
                      <span className="text-xs md:text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full shrink-0">{req.age} yrs</span>
                    </div>
                    <p className="text-base md:text-lg font-medium text-gray-700 mb-4">{req.task}</p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-green-600 shrink-0" /> <span className="truncate max-w-[200px] sm:max-w-xs">{req.distance}</span></span>
                      <span className="flex items-center gap-2"><Clock size={16} className="text-green-600 shrink-0" /> {req.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAcceptRequest(req)}
                    disabled={processingId === req.id}
                    className="w-full md:w-auto px-6 md:px-10 py-3 md:py-4 bg-green-600 text-white font-bold uppercase text-xs md:text-sm tracking-widest rounded-full hover:bg-green-700 transition-colors shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {processingId === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accept Request'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default VolunteerHub;