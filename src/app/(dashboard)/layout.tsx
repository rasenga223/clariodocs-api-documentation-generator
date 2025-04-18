"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/provider/auth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content until we've confirmed the user is authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="grid h-screen w-screen overflow-hidden md:grid-cols-[auto_1fr] md:[&>*:nth-child(2)]:col-start-2">
      <Sidebar />
      <main className="flex flex-col h-full w-full bg-zinc-100/80 dark:bg-[#0b0b0b]/60 backdrop-blur-xl overflow-hidden">
        <div className="relative flex-1 max-h-full min-h-0 overflow-hidden">
          <div className="relative h-full p-2">
            <div 
              className="relative h-full p-2 overflow-y-auto border rounded-3xl border-border/40 bg-background"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(200, 200, 200, 0.3) transparent',
              }}
            >
              <style jsx global>{`
                /* For Webkit browsers (Chrome, Safari) */
                ::-webkit-scrollbar {
                  width: 8px;
                  height: 8px;
                }
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background-color: rgba(200, 200, 200, 0.3);
                  border-radius: 20px;
                  border: 2px solid transparent;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(180, 180, 180, 0.5);
                }
                
                /* For Firefox */
                * {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(200, 200, 200, 0.3) transparent;
                }
              `}</style>
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
