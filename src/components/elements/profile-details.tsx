import React from "react";

interface ProfileDetailsProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: string;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  userName,
  userEmail,
  userPhone,
  userId,
}) => {
  return (
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
            {userId}
          </dd>
        </div>
      </dl>
    </div>
  );
};
