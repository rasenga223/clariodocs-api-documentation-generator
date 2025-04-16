import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DecorativeSquare } from "@/components/elements/decorative-square";
import { DashboardNotice } from "@/components/elements/dashboard-notice";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen md:grid-cols-[auto_1fr] md:[&>*:nth-child(2)]:col-start-2">
      <Sidebar />
      <main className="flex h-full flex-col">
        <DashboardHeader />
        <DashboardNotice />
        <div className="no-scrollbar md:scrollbar relative max-h-[calc(100dvh-3.25rem)] min-h-0 flex-1 overflow-y-auto">
          <DecorativeSquare className="top-0 left-0 border-t border-l" />
          <DecorativeSquare className="bottom-0 left-0 border-b border-l" />
          <DecorativeSquare className="top-0 right-0 border-t border-r" />
          <DecorativeSquare className="right-0 bottom-0 border-r border-b" />
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
