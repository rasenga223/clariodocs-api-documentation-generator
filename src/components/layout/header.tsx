"use client";

import { useState, useEffect } from "react";
import { Link } from "@/components/ui/link";
import { useAuth } from "@/provider/auth";

export const Header = () => {
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user name from metadata if available
  const userName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <header className="fixed top-4 z-100 mx-auto grid w-full grid-cols-3 justify-items-center gap-16 rounded-full px-4 py-2">
      <nav>
        <menu className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((item) => (
            <li key={item}>Links</li>
          ))}
        </menu>
      </nav>

      <h1>Clario</h1>

      {user ? (
        <Link
          aria-labelledby={`${userName} Dashboard`}
          href="/dashboard"
          className="flex items-center justify-center gap-4"
        >
          <figure className="flex aspect-square w-8 items-center justify-center rounded-full bg-emerald-500 font-medium text-zinc-950">
            {userName.charAt(0).toUpperCase()}
          </figure>
          <p id={`${userName} Dashboard`}>{userName}</p>
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/login" variant={"primary"}>
            Sign In
          </Link>
          <Link href="/docs" variant={"outline"}>
            Learn More
          </Link>
        </div>
      )}
    </header>
  );
};
