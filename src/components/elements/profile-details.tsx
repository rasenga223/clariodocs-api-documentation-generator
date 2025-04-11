import { cn } from "@/lib/utils";

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
  const details = [
    { label: "Name", value: userName },
    { label: "Email address", value: userEmail || "Not provided" },
    { label: "Phone number", value: userPhone || "Not provided" },
    { label: "User ID", value: userId },
  ];

  return (
    <dl className="grid flex-1 divide-y rounded-2xl">
      {details.map(({ label, value }, index) => (
        <div
          key={index}
          className="border-b border-zinc-700/50 px-2 py-4 text-zinc-300 last:border-0"
        >
          <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
          <dd
            className={cn(
              label === "User ID"
                ? "font-mono text-zinc-600 dark:text-zinc-400"
                : "text-lg font-medium text-zinc-900 dark:text-zinc-200",
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};
