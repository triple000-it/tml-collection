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
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSignIn = async (user: User) => {
    try {
      // Skip database operations if Supabase is not configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        return;
      }

      // Check if user exists in our custom users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!existingUser) {
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
          console.error('Error creating user in custom table:', error);
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
      } else {
        // Update last login
        await supabase
          .from('users')
          .update({ 
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);
      }
    } catch (error) {
      console.error('Error handling user sign in:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        return { error: { message: 'Authentication not configured. Please set up Supabase environment variables.' } };
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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        return { error: { message: 'Authentication not configured. Please set up Supabase environment variables.' } };
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
