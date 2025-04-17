import { User } from "@/types/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProfileDisplayProps {
  user: User;
  onEdit: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  user,
  onEdit,
}) => {
  // Use only email for simplicity as requested
  const userEmail = user.email || "";
  
  return (
    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-semibold">Account Information</h2>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="flex items-center justify-center w-20 h-20 text-2xl font-medium rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground ring-2 ring-border/50">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{userEmail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
