import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for user data
export type UserData = {
  id: string;
  email?: string;
  user_metadata: {
    avatar_url?: string;
    email?: string;
    name?: string;
    preferred_username?: string;
    user_name?: string;
    full_name?: string;
  };
};

// Helper to get user from Supabase
export const getUser = async (): Promise<UserData | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user as UserData;
};