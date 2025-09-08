'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { isAdminEmail } from '@/lib/constants';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('AdminGuard: checkAdminStatus called', { loading, user: user?.email });
      
      if (loading) {
        console.log('AdminGuard: Still loading, returning');
        return;
      }

      if (!user) {
        console.log('AdminGuard: No user, redirecting to login');
        router.push('/login');
        return;
      }

      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log('AdminGuard: Timeout reached, setting checkingAdmin to false');
        setCheckingAdmin(false);
      }, 10000); // 10 second timeout

      try {
        // Check if user is admin by email
        const isEmailAdmin = isAdminEmail(user.email);
        console.log('AdminGuard: Email admin check', { email: user.email, isEmailAdmin });

        if (isEmailAdmin) {
          console.log('AdminGuard: User is admin by email, setting admin true');
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // Skip database check if Supabase is not configured (demo mode)
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
            process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') || 
            process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
          console.log('Demo mode: Skipping database admin check, using email-only verification');
          setIsAdmin(isEmailAdmin);
          setCheckingAdmin(false);
          return;
        }

        console.log('AdminGuard: Checking database for admin role');
        // Check if user has admin role in database
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single();

        console.log('AdminGuard: Database query result', { userData, error });

        if (error) {
          console.error('Error checking admin status:', error);
          // If database check fails, fall back to email check
          setIsAdmin(isEmailAdmin);
        } else {
          setIsAdmin(userData?.role === 'admin' || isEmailAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        console.log('AdminGuard: Setting checkingAdmin to false');
        clearTimeout(timeoutId);
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, loading, router]);

  useEffect(() => {
    if (!checkingAdmin && isAdmin === false) {
      router.push('/');
    }
  }, [isAdmin, checkingAdmin, router]);

  if (loading || checkingAdmin) {
    console.log('AdminGuard: Showing loading state', { loading, checkingAdmin, user: user?.email, isAdmin });
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking admin privileges...</p>
          <p className="text-gray-400 text-sm mt-2">Loading: {loading ? 'true' : 'false'}, Checking: {checkingAdmin ? 'true' : 'false'}</p>
          <p className="text-gray-500 text-xs mt-1">User: {user?.email || 'None'}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // TEMPORARY: For testing, show a test admin dashboard
    if (process.env.NODE_ENV === 'development') {
      console.log('AdminGuard: Development mode - showing test admin dashboard');
      return (
        <div className="min-h-screen bg-black p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard (Test Mode)</h1>
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Debug Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">Loading: {loading ? 'true' : 'false'}</p>
                <p className="text-gray-300">Checking Admin: {checkingAdmin ? 'true' : 'false'}</p>
                <p className="text-gray-300">User: None</p>
                <p className="text-gray-300">Is Admin: {isAdmin ? 'true' : 'false'}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/login')}
                  className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors mr-4"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
