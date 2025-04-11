import { Button } from "@/components/ui/button";

export const DashboardHeaderAuth = () => {
  return (
    <div className="flex gap-2">
      <Button size={"sm"} variant={"ghost"}>
        Log in
      </Button>
      <Button size={"sm"} className="hover:bg-emerald-500 hover:text-white">
        Sign Up
      </Button>
    </div>
  );
};
