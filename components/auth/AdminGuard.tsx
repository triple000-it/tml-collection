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
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Check if user is admin by email
        const isEmailAdmin = isAdminEmail(user.email);

        if (isEmailAdmin) {
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // Check if user has admin role in database
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single();

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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
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
