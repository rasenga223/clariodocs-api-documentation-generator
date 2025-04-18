"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;

        // Redirect to dashboard after successful authentication
        router.push("/dashboard");
      } catch (error) {
        console.error("Error during auth callback:", error);
        router.push("/login?error=Authentication failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader />
        <h2 className="text-xl font-medium">Completing authentication...</h2>
      </div>
    </div>
  );
}
