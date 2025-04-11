import React from "react";
import Image from "next/image";

interface ProfileAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ userAvatar, userName }) => {
  return (
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
  );
};
