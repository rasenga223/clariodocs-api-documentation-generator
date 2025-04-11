import { useAuth } from "@/provider/auth";

export const DashboardNotice = () => {
  const { user } = useAuth();

  const userName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name ||
    user?.email ||
    "Demo User";

  return (
    <header className="relative border-b px-4 py-2.5 pb-3 text-sm">
      <div>
        <h2 className="text-lg font-medium">Welcome, {userName}! 👋</h2>
        <p className="text-zinc-600 dark:text-zinc-300">
          {user
            ? "You've successfully logged in to your account."
            : "You're viewing in demo mode."}
        </p>
      </div>
    </header>
  );
};
