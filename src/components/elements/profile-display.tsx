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
    <div>
      <ProfileHeader title="Personal Information" onEdit={onEdit} />
      <div className="mt-6 flex flex-col md:flex-row md:items-start md:space-x-6">
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
