import { DecorativeSquare } from "@/components/elements/decorative-square";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  return (
    <header className="relative flex items-center justify-between border-b px-4 py-4">
      <DecorativeSquare className="-bottom-px -left-px w-2 border-b border-l" />
      <h2> Dashboard Header</h2>

      <div className="flex gap-2">
        <Button variant={"ghost"}>Log in</Button>
        <Button>Sign Up</Button>
      </div>
    </header>
  );
};
