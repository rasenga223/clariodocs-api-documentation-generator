import { ProfileHeader } from "./profile-header";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileDetails } from "./profile-details";
import { User } from "@/types/user";

interface ProfileDisplayProps {
  user: User;
  onEdit: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  user,
  onEdit,
}) => {
  const userName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.user_name ||
    user.email ||
    "there";

  const userAvatar = user.user_metadata?.avatar_url;
  const userEmail = user.email || "";
  const userPhone = user.user_metadata?.phone || "";

  return (
    <div className="mx-auto max-w-xl">
      <ProfileHeader onEdit={onEdit} />
      <div className="mt-4 min-h-80 space-y-2 rounded-md border bg-zinc-900 p-2 pb-0">
        <ProfileAvatar userAvatar={userAvatar} userName={userName} />
        <ProfileDetails
          userName={userName}
          userEmail={userEmail}
          userPhone={userPhone}
          userId={user.id}
        />
      </div>
    </div>
  );
};
