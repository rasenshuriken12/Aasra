import React, { useState } from 'react';
import { Clock, MapPin, Calendar as CalendarIcon, AlertTriangle, Coffee, Check, Star, ChevronDown, Smile, Meh, Frown, X, Heart, Users, Pill, Wrench, Smartphone, Stethoscope, Calendar, Pen, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const subtleJaliPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20L0 0h40L20 20zM0 40h40L20 20 0 40z' fill='%23FF7043' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
};

const SeniorHub = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    date: '',
    timeHour: '9',
    timePeriod: 'AM',
    durationValue: '1',
    durationUnit: 'hours',
    location: 'Home',
    helpRequests: [{ type: 'others', description: '' }]
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isLoadingSavedAddress, setIsLoadingSavedAddress] = useState(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Help options with icons
  const helpOptions = [
    { id: 'companionship', label: 'Companionship', icon: Heart },
    { id: 'walking', label: 'Walking Buddy', icon: Users },
    { id: 'medicine', label: 'Medicine Delivery', icon: Pill },
    { id: 'maintenance', label: 'Home Maintenance', icon: Wrench },
    { id: 'tech', label: 'Tech Assistance', icon: Smartphone },
    { id: 'doctor', label: 'Doctor Visits', icon: Stethoscope },
    { id: 'events', label: 'Events & Travel', icon: Calendar },
    { id: 'others', label: 'Others', icon: Pen }
  ];

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const maxDate = '3000-12-31';

  // Fetch User Data
  React.useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, location_data')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData);

        const { data } = await supabase
          .from('credits')
          .select('remaining_sessions')
          .eq('user_id', user.id)
          .single();

        if (data) setCredits(data.remaining_sessions);
      }
    };
    fetchUserData();
  }, []);

  // Function to fetch saved address from profile
  const fetchSavedAddress = async () => {
    if (!user) return;

    setIsLoadingSavedAddress(true);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('location_data')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Get the address from location_data
      const savedAddress = profileData?.location_data?.address;

      if (savedAddress && savedAddress !== 'Home') {
        setBooking(prev => ({ ...prev, location: savedAddress }));
        alert(`Saved address loaded: ${savedAddress}`);
      } else if (savedAddress === 'Home') {
        setBooking(prev => ({ ...prev, location: 'Home' }));
        alert('Saved address: Home');
      } else {
        alert('No saved address found. Please enter your address manually or use "My Location".');
      }
    } catch (error) {
      console.error('Error fetching saved address:', error);
      alert('Could not fetch saved address. Please try again.');
    } finally {
      setIsLoadingSavedAddress(false);
    }
  };

  const totalSessions = 5;
  const usedSessions = totalSessions - credits;

  const handleSOS = async () => {
    alert("SOS ALERT ACTIVATED!\nNotifying your emergency contacts and Aasra support team immediately.");
    if (user) {
      await supabase.from('sessions').insert({
        senior_id: user.id,
        start_time: new Date().toISOString(),
        duration_hours: 1,
        is_emergency_triggered: true,
        status: 'pending'
      });
    }
  };

  // Geolocation with Google Maps
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );

          const data = await response.json();

          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted_address;
            setBooking(prev => ({ ...prev, location: formattedAddress }));
            alert(`Location found: ${formattedAddress}`);
          } else {
            const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setBooking(prev => ({ ...prev, location: fallbackAddress }));
            alert(`Location captured (coordinates: ${fallbackAddress}). Please verify.`);
          }
        } catch (error) {
          console.error("Geocoding Error:", error);
          const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setBooking(prev => ({ ...prev, location: fallbackAddress }));
          alert(`Location captured (coordinates: ${fallbackAddress}). Please verify.`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve location. Please enter manually.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please enter manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        setLocationError(errorMessage);
        alert(errorMessage);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle help option selection for a specific request
  const handleHelpOptionSelect = (index, optionId) => {
    const newRequests = [...booking.helpRequests];
    newRequests[index].type = optionId;
    setBooking({ ...booking, helpRequests: newRequests });
  };

  // Update description for a specific request
  const updateDescription = (index, description) => {
    const newRequests = [...booking.helpRequests];
    newRequests[index].description = description;
    setBooking({ ...booking, helpRequests: newRequests });
  };

  // Add new help request (max 5)
  const addHelpRequest = () => {
    if (booking.helpRequests.length < 5) {
      setBooking({
        ...booking,
        helpRequests: [...booking.helpRequests, { type: 'others', description: '' }]
      });
    } else {
      alert("Maximum 5 help requests allowed per booking");
    }
  };

  // Delete help request
  const deleteHelpRequest = (index) => {
    if (booking.helpRequests.length > 1) {
      const newRequests = booking.helpRequests.filter((_, i) => i !== index);
      setBooking({ ...booking, helpRequests: newRequests });
    }
  };

  // Get the label for a help option
  const getHelpLabel = (typeId) => {
    const option = helpOptions.find(opt => opt.id === typeId);
    return option ? option.label : 'Others';
  };

  // Format display time
  const formatDisplayTime = () => `${booking.timeHour}:00 ${booking.timePeriod}`;

  // Calculate total hours
  const calculateTotalHours = () => {
    const value = parseInt(booking.durationValue);
    return Math.min(value, 6);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay checkout script.'));
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (requestId, amountInPaise, description) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      throw new Error('Missing Razorpay publishable key. Please set VITE_RAZORPAY_KEY_ID in .env.local');
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Unable to load Razorpay checkout.');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: 'INR',
        name: 'Aasra Care',
        description,
        notes: {
          booking_request_id: requestId || 'unknown'
        },
        handler: function (response) {
          resolve(response);
        },
        modal: {
          escape: true,
          ondismiss: function () {
            reject(new Error('Payment was cancelled.'));
          }
        },
        prefill: {
          name: profile?.full_name || '',
          email: user?.email || '',
          contact: profile?.phone_number || ''
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!booking.date || !booking.timeHour || !booking.timePeriod || !booking.durationValue) {
      alert("Please fill in date, time, and duration");
      return;
    }

    const hasValidTask = booking.helpRequests.some(task => task.description.trim());
    if (!hasValidTask) {
      alert("Please describe what help you need");
      return;
    }

    setIsLoading(true);
    try {
      const hour = parseInt(booking.timeHour, 10);
      const hour24 = booking.timePeriod === 'PM'
        ? (hour === 12 ? 12 : hour + 12)
        : (hour === 12 ? 0 : hour);
      const paddedHour = hour24.toString().padStart(2, '0');
      const startTimeIso = `${booking.date}T${paddedHour}:00:00`;
      const startDate = new Date(startTimeIso);
      if (Number.isNaN(startDate.getTime())) {
        throw new Error(`Invalid booking date/time: ${startTimeIso}`);
      }
      const start_time = startDate.toISOString();
      const duration_hours = calculateTotalHours();

      const formattedHelpRequests = booking.helpRequests
        .filter(task => task.description.trim())
        .map(task => ({
          type: task.type,
          typeLabel: getHelpLabel(task.type),
          description: task.description
        }));

      const serviceDescription = formattedHelpRequests
        .map(req => `${req.typeLabel}: ${req.description}`)
        .join(' | ');
      const serviceType = formattedHelpRequests[0]?.type || 'others';

      let requestId = null;
      if (user) {
        const { data, error } = await supabase.from('service_requests').insert({
          user_id: user.id,
          status: 'pending',
          service_type: serviceType,
          description: serviceDescription,
          scheduled_at: start_time,
          manual_address: booking.location,
          location_mode: 'manual'
        }).select('id').single();

        if (error) throw error;
        requestId = data?.id;
      }

      const amountInPaise = calculateTotalHours() * 100 * 100;
      const paymentDescription = `Aasra service booking for ${booking.durationValue} ${booking.durationUnit}`;

      alert('✅ Booking requested successfully. You will now be redirected to Razorpay to complete payment.');
      await openRazorpayCheckout(requestId, amountInPaise, paymentDescription);
      alert('✅ Payment complete! Your booking is confirmed.');

      setBooking({
        date: '',
        timeHour: '9',
        timePeriod: 'AM',
        durationValue: '1',
        durationUnit: 'hours',
        location: 'Home',
        helpRequests: [{ type: 'others', description: '' }]
      });

      setTimeout(() => setShowFeedback(true), 3000);
    } catch (error) {
      console.error("Booking Error:", error);
      alert(`Failed to create booking. ${error?.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!selectedEmoji) return;
    alert(`Feedback saved! You rated the session: ${selectedEmoji}`);
    setShowFeedback(false);
    setSelectedEmoji(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-white)] text-[var(--color-primary-black)] pb-32 font-inter relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" style={subtleJaliPattern}></div>

      <nav className="bg-white/80 backdrop-blur-md text-[var(--color-primary-black)] p-4 md:p-6 md:px-12 border-b border-[var(--color-gray-soft)] flex flex-col md:flex-row justify-between items-center gap-4 relative z-20">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black font-poppins tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)]">
            Aasra Senior Hub
          </h1>
          {profile && <p className="text-sm font-bold text-gray-500 mt-1">Welcome back, {profile.full_name}</p>}
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent-orange)] hover:text-[var(--color-gray-mid)] transition-colors px-6 py-2 border border-[var(--color-gray-soft)] rounded-full hover:shadow-sm">
          Sign Out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6 mt-12 relative z-10">
        {/* Wallet Component */}
        <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-xl shadow-[var(--color-primary-black)]/5 border border-white/50 mb-12">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-3 text-[var(--color-primary-black)] font-poppins">
            <Coffee className="text-[var(--color-accent-orange)]" size={28} strokeWidth={2.5} />
            Session Wallet
          </h2>
          <p className="text-sm font-medium text-[var(--color-gray-mid)] mb-8">You have {totalSessions - usedSessions} free sessions remaining this month.</p>
          <div className="flex flex-wrap gap-4">
            {[...Array(totalSessions)].map((_, i) => (
              <div key={i} className={`flex-1 min-w-[60px] h-20 rounded-2xl flex items-center justify-center border-2 transition-all ${i < usedSessions ? 'bg-[var(--color-accent-orange)]/10 border-[var(--color-accent-orange)]/30 text-[var(--color-accent-orange)]' : 'bg-white border-[var(--color-gray-soft)] text-[var(--color-gray-soft)] shadow-sm'}`}>
                {i < usedSessions ? <Check size={32} strokeWidth={3} /> : <Star size={24} />}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-xl shadow-[var(--color-primary-black)]/5 border border-white/50 relative overflow-hidden">
          <h2 className="text-3xl font-black mb-8 text-[var(--color-primary-black)] font-poppins">Request a Companion</h2>

          <form onSubmit={handleBookingSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-gray-mid)] ml-2">Select Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)]" size={18} />
                  <input
                    type="date"
                    required
                    min={today}
                    max={maxDate}
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl bg-white border border-[var(--color-gray-soft)] text-sm sm:text-lg font-medium text-[var(--color-primary-black)] outline-none focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 shadow-sm appearance-none cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-2">Available from today onwards</p>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-gray-mid)] ml-2">Select Time</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)]" size={18} />
                    <select
                      required
                      value={booking.timeHour}
                      onChange={(e) => setBooking({ ...booking, timeHour: e.target.value })}
                      className="w-full pl-10 sm:pl-14 pr-8 sm:pr-12 py-3 sm:py-4 rounded-2xl bg-white border border-[var(--color-gray-soft)] text-sm sm:text-lg font-medium text-[var(--color-primary-black)] outline-none focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 shadow-sm appearance-none cursor-pointer"
                    >
                      {booking.timePeriod === 'AM' 
                        ? [6, 7, 8, 9, 10, 11].map(hour => (
                            <option key={hour} value={hour}>{hour}:00</option>
                          ))
                        : [12, 1, 2, 3, 4, 5, 6].map(hour => (
                            <option key={hour} value={hour}>{hour}:00</option>
                          ))
                      }
                    </select>
                    <ChevronDown className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)] pointer-events-none" size={18} />
                  </div>

                  <div className="relative flex-1">
                    <select
                      required
                      value={booking.timePeriod}
                      onChange={(e) => {
                        const newPeriod = e.target.value;
                        const validHour = newPeriod === 'AM' ? '9' : '12';
                        setBooking({ ...booking, timePeriod: newPeriod, timeHour: validHour });
                      }}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white border border-[var(--color-gray-soft)] text-sm sm:text-lg font-medium text-[var(--color-primary-black)] outline-none focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <ChevronDown className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)] pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              {/* Duration Picker */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-gray-mid)] ml-2">Duration (Hours)</label>
                <div className="relative">
                  <Clock className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)]" size={18} />
                  <select
                    required
                    value={booking.durationValue}
                    onChange={(e) => setBooking({ ...booking, durationValue: e.target.value })}
                    className="w-full pl-10 sm:pl-14 pr-8 sm:pr-12 py-3 sm:py-4 rounded-2xl bg-white border border-[var(--color-gray-soft)] text-sm sm:text-lg font-medium text-[var(--color-primary-black)] outline-none focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 shadow-sm appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(h => (
                      <option key={h} value={h}>{h} {h === 1 ? 'Hour' : 'Hours'}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-mid)] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2 mb-1">
                  <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-gray-mid)]">Location</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={fetchSavedAddress} disabled={isLoadingSavedAddress} className="text-xs font-bold text-[var(--color-accent-orange)] uppercase tracking-widest hover:text-[var(--color-accent-saffron)] transition-colors disabled:opacity-50">
                      {isLoadingSavedAddress ? 'Loading...' : 'Saved Address'}
                    </button>
                    <button type="button" onClick={handleGetLocation} disabled={isLocating} className="text-xs font-bold text-[var(--color-accent-orange)] uppercase tracking-widest hover:text-[var(--color-accent-saffron)] transition-colors disabled:opacity-50">
                      {isLocating ? 'Locating...' : 'My Location'}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-orange)]" size={20} />
                  <input
                    type="text"
                    required
                    placeholder="Enter location manually or use 'My Location' button"
                    value={booking.location}
                    onChange={(e) => setBooking({ ...booking, location: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-[var(--color-gray-soft)] text-lg font-medium text-[var(--color-primary-black)] outline-none focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 shadow-sm transition-all"
                  />
                </div>
                {locationError && <p className="text-xs text-red-500 ml-2 mt-1">{locationError}</p>}
              </div>
            </div>

            {/* Help Section - Multiple Requests */}
            <div className="pt-6 border-t border-[var(--color-gray-soft)]">
              <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-gray-mid)] ml-2 mb-4 block">
                What help do you need?
              </label>

              {booking.helpRequests.map((request, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  {/* Help Options Buttons - Horizontal Scrollable */}
                  <div className="overflow-x-auto pb-4 mb-4">
                    <div className="flex gap-3 min-w-max">
                      {helpOptions.map((option) => {
                        const OptionIcon = option.icon;
                        const isSelected = request.type === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleHelpOptionSelect(index, option.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all whitespace-nowrap border-2 ${isSelected
                              ? 'border-[var(--color-accent-orange)] text-[var(--color-accent-orange)] bg-orange-50/50'
                              : 'border-gray-300 text-black hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]'
                              }`}
                          >
                            <OptionIcon size={20} />
                            <span className="font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Box with Dynamic Label */}
                  <div className="relative">
                    <div className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--color-accent-orange)] border border-[var(--color-gray-soft)] z-10">
                      {getHelpLabel(request.type)}
                    </div>
                    <div className="flex gap-3">
                      <textarea
                        rows="3"
                        value={request.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        placeholder={request.type !== 'others'
                          ? `Tell us more about your ${getHelpLabel(request.type).toLowerCase()} request...`
                          : "Please describe what help you need..."}
                        className="flex-1 px-6 pt-8 pb-4 rounded-2xl bg-white border-2 border-[var(--color-gray-soft)] text-lg font-medium text-[var(--color-primary-black)] outline-none focus:border-[var(--color-accent-orange)] focus:ring-2 focus:ring-[var(--color-accent-orange)]/20 shadow-sm transition-all resize-y"
                      />
                      {booking.helpRequests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteHelpRequest(index)}
                          className="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors self-start mt-2"
                          title="Remove this request"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Button - Max 5 */}
              {booking.helpRequests.length < 5 && (
                <button
                  type="button"
                  onClick={addHelpRequest}
                  className="mt-4 flex items-center gap-2 text-sm font-bold text-[var(--color-accent-orange)] uppercase tracking-widest hover:underline transition-colors"
                >
                  <Plus size={18} />
                  Add another help request ({booking.helpRequests.length}/5)
                </button>
              )}

              <p className="text-xs text-gray-500 mt-4 ml-2">
                💡 Tip: Be specific about your needs (e.g., "Need help with morning medicines at 8 AM")
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-saffron)] text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </form>
        </div>
      </div>

      {/* SOS Button */}
      <button
        onClick={handleSOS}
        className="fixed bottom-8 right-8 w-24 h-24 bg-red-600 text-white rounded-full shadow-[0_8px_30px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center hover:bg-red-700 hover:scale-105 active:scale-95 transition-all z-40 border-[6px] border-white/50 group"
      >
        <AlertTriangle size={32} strokeWidth={3} className="mb-1 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-[10px] uppercase tracking-widest">SOS</span>
      </button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--color-primary-black)]/60 backdrop-blur-sm"
              onClick={() => setShowFeedback(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 20 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-lg w-full relative z-10 border border-white/50"
            >
              <button onClick={() => setShowFeedback(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full">
                <X size={24} />
              </button>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-[var(--color-primary-black)] font-poppins mb-4">How was your session?</h2>
                <p className="text-[var(--color-gray-mid)] font-medium">Your feedback helps us keep the community safe and supportive.</p>
              </div>
              <div className="flex justify-between items-center mb-12 gap-4">
                <button onClick={() => setSelectedEmoji('happy')} className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] transition-all border-4 ${selectedEmoji === 'happy' ? 'bg-green-50 border-green-500 text-green-600 scale-110 shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100 hover:scale-105'}`}>
                  <Smile size={64} />
                  <span className="font-bold text-sm uppercase tracking-widest">Great</span>
                </button>
                <button onClick={() => setSelectedEmoji('neutral')} className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] transition-all border-4 ${selectedEmoji === 'neutral' ? 'bg-orange-50 border-orange-500 text-orange-600 scale-110 shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100 hover:scale-105'}`}>
                  <Meh size={64} />
                  <span className="font-bold text-sm uppercase tracking-widest">Okay</span>
                </button>
                <button onClick={() => setSelectedEmoji('sad')} className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] transition-all border-4 ${selectedEmoji === 'sad' ? 'bg-red-50 border-red-500 text-red-600 scale-110 shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100 hover:scale-105'}`}>
                  <Frown size={64} />
                  <span className="font-bold text-sm uppercase tracking-widest">Poor</span>
                </button>
              </div>
              <button onClick={handleFeedbackSubmit} disabled={!selectedEmoji} className="w-full py-5 bg-[var(--color-primary-black)] text-white font-bold uppercase tracking-widest rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Feedback
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeniorHub;