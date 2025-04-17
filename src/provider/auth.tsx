"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase, UserData, getUser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signInWithDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<{ error: Error | null }>;
}

// Create a default value for the context
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  signInWithGitHub: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signInWithDemo: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => ({ error: null }),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Helper function to ensure user exists in public.users table
async function ensureUserInPublicTable(userData: UserData) {
  if (!userData || !userData.id) return;
  
  // Check if user already exists in public.users table
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userData.id)
    .single();
    
  // If there's no existing user or an error (indicating no match), create the user
  if (!existingUser || fetchError) {
    // Create user in public.users table with only id and email
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        created_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('Error creating user in public table:', insertError);
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        
        // Create user in public table if they don't exist
        if (userData) {
          await ensureUserInPublicTable(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = session.user as UserData;
          setUser(userData);
          
          // Ensure the user exists in public.users on auth state change
          // This handles first logins and subsequent logins
          await ensureUserInPublicTable(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
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
      console.error("Error signing in with email:", error);
      return { error: new Error("Failed to sign in with email") };
    }
  };

  const signInWithDemo = async () => {
    try {
      // Sign in with a demo account
      const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@example.com',
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'demo123',
      });
      
      if (error) throw error;
      
      // Create demo user in public table if needed
      if (data.user) {
        await ensureUserInPublicTable(data.user as UserData);
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with demo account:", error);
      toast.error("Failed to sign in with demo account");
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
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
      
      // Update the user in the public.users table as well
      if (updatedUser) {
        const { error: updatePublicError } = await supabase
          .from('users')
          .update({
            full_name: updatedUser.user_metadata?.name || updatedUser.user_metadata?.full_name,
            email: updatedUser.email,
            ...(phone !== undefined && { phone })
          })
          .eq('id', updatedUser.id);
          
        if (updatePublicError) {
          console.error('Error updating public user profile:', updatePublicError);
        }
      }

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
    signInWithDemo,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
