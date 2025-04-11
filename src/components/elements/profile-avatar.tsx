import Image from "next/image";

interface ProfileAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  userAvatar,
  userName,
}) => {
  return (
    <div className="flex aspect-video size-full items-center justify-center overflow-visible border border-zinc-800 bg-zinc-950">
      {userAvatar ? (
        <figure className="shadow-aura relative h-32 w-32 overflow-visible">
          <Image
            src={userAvatar || "/placeholder.svg"}
            alt="User avatar"
            fill
            className="relative z-10 rounded-full object-cover"
          />
        </figure>
      ) : (
        <div className="relative">
          <div className="shadow-aura relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-zinc-800 text-4xl font-medium text-zinc-300">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
