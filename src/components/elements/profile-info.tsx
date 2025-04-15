"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { userService } from "@/services/api";
import { Loader } from "@/components/ui/loader";

interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

export default function ProfileInfo() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await userService.getProfile();

        if (error) {
          setError(error);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <p>Error loading profile: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No profile data available
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
          {profile.avatarUrl ? (
            <div className="mb-4 sm:mb-0">
              <Image
                src={profile.avatarUrl}
                alt="Profile avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 sm:mb-0 dark:bg-gray-700">
              <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                {profile.name?.charAt(0) || profile.email?.charAt(0) || "?"}
              </span>
            </div>
          )}

          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {profile.name || "User"}
            </h3>
            {profile.email && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {profile.email}
              </p>
            )}
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              User ID: <span className="font-mono">{profile.id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
