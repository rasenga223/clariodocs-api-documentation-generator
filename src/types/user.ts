export interface User {
  id: string;
  email?: string;
  user_metadata: {
    name?: string;
    full_name?: string;
    preferred_username?: string;
    user_name?: string;
    avatar_url?: string;
    phone?: string;
  };
}
