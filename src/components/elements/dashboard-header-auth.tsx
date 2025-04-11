"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/auth";
import { DashboardAvatar } from "./dashboard-avatar";

export const DashboardHeaderAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignout = async () => {
    await signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost">
          Log in
        </Button>
        <Button size="sm" className="hover:bg-emerald-500 hover:text-white">
          Sign Up
        </Button>
      </div>
    );
  }

  if (pathname === "/profile") {
    return (
      <Button
        onClick={handleSignout}
        variant="ghost"
        className="text-red-500 hover:!bg-red-400/20 hover:text-red-500"
      >
        Sign out
      </Button>
    );
  }

  const userImage = user.user_metadata?.avatar_url || "";
  const userName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.user_name ||
    user.email ||
    "User";

  return <DashboardAvatar userAvatar={userImage} userName={userName} />;
};
