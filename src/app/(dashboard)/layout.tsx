import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
// import { DashboardTab } from "@/components/layout/dashboard-tab";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid md:grid-cols-[auto_1fr] md:[&>*:nth-child(2)]:col-start-2">
      <Sidebar />
      <main className="flex flex-col">
        <DashboardHeader />
        {/* <DashboardTab /> */}
        <div className="scrollbar max-h-[calc(100dvh-3.25rem)] flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
