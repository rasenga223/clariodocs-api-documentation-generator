import { DecorativeSquare } from "@/components/elements/decorative-square";

export const DashboardHeader = () => {
  return (
    <header className="relative border-b px-4 py-4">
      <DecorativeSquare className="-bottom-px -left-px w-2 border-b border-l" />
      <h2> Dashboard Header</h2>
    </header>
  );
};
