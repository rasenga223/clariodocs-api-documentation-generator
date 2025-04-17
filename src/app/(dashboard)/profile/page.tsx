"use client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileEditForm } from "@/components/elements/profile-edit-form";
import { ProfileDisplay } from "@/components/elements/profile-display";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/provider/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.user_name ||
    user.email ||
    "there";
  const userEmail = user.email;
  const userPhone = user.user_metadata?.phone || "";

  return (
    <div className="flex flex-col h-full p-6">
      <div className="w-full max-w-screen-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your account information
          </p>
        </div>
        
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
              toast.success("Profile updated successfully!");
            }}
          />
        ) : (
          <ProfileDisplay
            user={{ ...user, email: user.email || "" }}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
}
