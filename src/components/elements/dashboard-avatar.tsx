import Link from "next/link";
import Image from "next/image";

interface DashboardAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const DashboardAvatar: React.FC<DashboardAvatarProps> = ({
  userAvatar,
  userName,
}) => {
  return (
    <Link href="/profile" aria-labelledby={`${userName} profile`}>
      {userAvatar ? (
        <figure className="relative size-8">
          <Image
            src={userAvatar}
            alt="User avatar"
            fill
            className="rounded-full object-cover"
          />
        </figure>
      ) : (
        <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 font-medium text-zinc-600 dark:bg-emerald-900 dark:text-zinc-100">
          {userName.charAt(0).toUpperCase()}
        </div>
      )}
    </Link>
  );
};
