"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileEditForm } from "@/components/elements/profile-edit-form";
import { Loader } from "@/components/elements/loader";
import { useAuth } from "@/provider/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader />
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
    "there";

  const userAvatar = user.user_metadata.avatar_url;
  const userEmail = user.email;
  const userPhone = user.user_metadata.phone || "";

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Profile Settings</h1>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Dashboard
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
          {isEditing ? (
            <ProfileEditForm
              initialData={{
                name: userName,
                email: userEmail || "",
                phone: userPhone,
              }}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => {
                setIsEditing(false);
                toast("Profile updated successfully!");
              }}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit profile
                </button>
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-start md:space-x-6">
                <div className="mb-6 flex justify-center md:mb-0">
                  <div className="relative h-32 w-32">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt="User avatar"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-4xl font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <dl className="space-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Name
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {userName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email address
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {userEmail || "Not provided"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone number
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {userPhone || "Not provided"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        User ID
                      </dt>
                      <dd className="mt-1 font-mono text-sm text-gray-600 dark:text-gray-400">
                        {user.id}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
