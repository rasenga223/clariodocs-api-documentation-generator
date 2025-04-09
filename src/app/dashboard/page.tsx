'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileInfo from '@/components/ProfileInfo';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the useEffect redirect
  }

  const userName = 
    user.user_metadata.name || 
    user.user_metadata.full_name || 
    user.user_metadata.preferred_username ||
    user.user_metadata.user_name || 
    user.email || 
    'there';

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
          <div className="flex gap-2">
            <Link
              href="/profile"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Profile Settings
            </Link>
            <button
              onClick={signOut}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome, {userName}! 👋</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You&apos;ve successfully logged in to your account.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-medium">Your Profile Information (via API)</h3>
            <ProfileInfo />
          </div>
        </div>
      </div>
    </div>
  );
}