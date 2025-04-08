import { DecorativeSquare } from "@/components/elements/decorative-square";

export const DashboardTab = () => {
  return (
    <header className="relative border-b px-4 py-4">
      <DecorativeSquare className="-top-px -left-px w-2 border-l" />
      <h2>Dashboard Tab</h2>
    </header>
  );
};
