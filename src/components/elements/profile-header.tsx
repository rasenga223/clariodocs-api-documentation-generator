import React from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  title?: string;
  onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        onClick={onEdit}
        variant={"secondary"}
        className="flex items-center gap-1 rounded-md px-3 py-2"
      >
        <SquarePen />
        Edit profile
      </Button>
    </div>
  );
};
