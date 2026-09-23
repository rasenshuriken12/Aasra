import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setIsAuthenticated(!!session);
          if (!session) {
            navigate('/auth', { replace: true });
          }
        }
      } catch (err) {
        console.error('Auth Check Error:', err);
        if (isMounted) {
          setIsAuthenticated(false);
          navigate('/auth', { replace: true });
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(!!session);
        if (!session) {
          navigate('/auth', { replace: true });
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // While checking auth, or if we know they aren't auth'd (redirect is firing)
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary-white)] relative z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[var(--color-accent-orange)] w-10 h-10" />
          <p className="text-sm font-bold text-[var(--color-gray-mid)] tracking-widest uppercase">Verifying Access...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
