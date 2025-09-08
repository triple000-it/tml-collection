'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session (only if Supabase is configured)
    const getInitialSession = async () => {
      console.log('AuthContext: getInitialSession called');
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        console.log('Demo mode: Skipping initial session check');
        setLoading(false);
        return;
      }
      
      console.log('AuthContext: Getting session from Supabase...');
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        console.log('AuthContext: Session result', { session: session?.user?.email, error });
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('AuthContext: Error getting session', error);
        // Set user to null if session check fails
        setSession(null);
        setUser(null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes (only if Supabase is configured)
    let subscription: any = null;
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url') {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Handle user creation in our custom users table
          if (event === 'SIGNED_IN' && session?.user) {
            await handleUserSignIn(session.user);
          }
        }
      );
      subscription = sub;
    } else {
      console.log('Demo mode: Skipping auth state change listener');
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleUserSignIn = async (user: User) => {
    try {
      // Skip database operations if Supabase is not configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        console.log('Demo mode: Skipping database operations for user:', user.email);
        return;
      }

      // Check if user exists in our custom users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      // If there's an RLS policy error, skip database operations
      if (checkError && (checkError.code === '42P17' || checkError.message?.includes('infinite recursion'))) {
        console.warn('RLS policy error detected, skipping user table operations for:', user.email);
        return;
      }

      if (!existingUser && !checkError) {
        // Create user in our custom users table
        const { error } = await supabase
          .from('users')
          .insert({
            email: user.email,
            password_hash: '', // We don't store password hash in our table since Supabase handles it
            role: 'user',
            status: 'active',
            username: user.email?.split('@')[0],
            email_verified: user.email_confirmed_at ? true : false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          // If it's an RLS policy error, just log a warning instead of error
          if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
            console.warn('RLS policy error: Cannot create user in custom table for:', user.email);
          } else {
            console.error('Error creating user in custom table:', error);
          }
        } else {
          // Create initial points record
          const { data: newUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (newUser) {
            await supabase
              .from('user_points')
              .insert({
                user_id: newUser.id,
                total_points: 100, // Starting points
                available_points: 100,
                is_vip: false,
                vip_level: 0
              });
          }
        }
      } else if (existingUser) {
        // Update last login
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError && (updateError.code === '42P17' || updateError.message?.includes('infinite recursion'))) {
          console.warn('RLS policy error: Cannot update user login time for:', user.email);
        }
      }
    } catch (error) {
      console.error('Error handling user sign in:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        return { error: { message: 'Demo mode: Registration is disabled. Use admin@tmlcollect.com to login.' } };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, using demo mode');
        // For demo purposes, allow login with any password for admin emails
        const adminEmails = ['admin@tmlcollect.com', 'admin@example.com', 'info@000-it.com', 'admin@tmlcollections.com'];
        if (adminEmails.includes(email.toLowerCase())) {
          // Simulate successful login for admin emails
          const mockUser = {
            id: 'demo-admin',
            email: email,
            user_metadata: { role: 'admin' },
            email_confirmed_at: new Date().toISOString()
          } as any;
          
          // Set user and session directly without triggering auth state change
          setUser(mockUser);
          setSession({ user: mockUser } as any);
          setLoading(false);
          
          console.log('Demo mode: Admin login successful for', email);
          return { error: null };
        } else {
          return { error: { message: 'Demo mode: Only admin emails are allowed. Use: admin@tmlcollect.com' } };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Handle specific error cases
      if (error) {
        if (error.message.includes('email not confirmed')) {
          return { 
            error: { 
              message: 'Please check your email and click the confirmation link before signing in. If you don\'t see the email, check your spam folder.' 
            } 
          };
        } else if (error.message.includes('Invalid login credentials')) {
          return { 
            error: { 
              message: 'Invalid email or password. Please check your credentials and try again.' 
            } 
          };
        } else if (error.message.includes('Email address') && error.message.includes('invalid')) {
          return { 
            error: { 
              message: 'Please enter a valid email address.' 
            } 
          };
        }
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase.auth.updateUser(updates);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
