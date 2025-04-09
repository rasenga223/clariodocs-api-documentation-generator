'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, UserData, getUser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<{ error: Error | null }>;
}

// Create a default value for the context
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  signInWithGitHub: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  updateUserProfile: async () => ({ error: null }),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as UserData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const signInWithEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      console.error('Error signing in with email:', error);
      return { error: new Error('Failed to sign in with email') };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserProfile = async ({ name, email, phone }: { name?: string; email?: string; phone?: string }) => {
    try {
      // Update user metadata
      if (name || phone !== undefined) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            ...(name && { name }),
            ...(phone !== undefined && { phone }),
          },
        });

        if (metadataError) {
          throw metadataError;
        }
      }

      // Update email separately if provided
      if (email && email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });

        if (emailError) {
          throw emailError;
        }
      }

      // Refresh user data
      const updatedUser = await getUser();
      setUser(updatedUser);

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error instanceof Error ? error : new Error('Failed to update profile') };
    }
  };

  const value = {
    user,
    loading,
    signInWithGitHub,
    signInWithEmail,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}