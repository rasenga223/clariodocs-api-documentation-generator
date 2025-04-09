'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileInfo from '@/components/ProfileInfo';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Comment out the redirect for demonstration purposes
  /*
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Remove the check that prevents rendering if user is null
  /*
  if (!user) {
    return null; // This will be handled by the useEffect redirect
  }
  */

  // Use a default username if user is not available
  const userName = 
    user?.user_metadata?.name || 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name || 
    user?.email || 
    'Demo User';

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
          {user ? (
            <button
              onClick={signOut}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome, {userName}! 👋</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {user ? "You've successfully logged in to your account." : "You're viewing in demo mode."}
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-6 shadow-sm dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">API Documentation Generator</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Upload your API specification file and create beautiful documentation in seconds.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/api-doc-generator/upload-method" 
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Create Documentation
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-purple-50 p-6 shadow-sm dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300">Need a Sample API File?</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Download a sample OpenAPI/Swagger file to test our documentation generator.
            </p>
            <div className="mt-4">
              <Link href="/download-sample" 
                className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Download Sample File
              </Link>
            </div>
          </div>

          {user && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-medium">Your Profile Information (via API)</h3>
              <ProfileInfo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}