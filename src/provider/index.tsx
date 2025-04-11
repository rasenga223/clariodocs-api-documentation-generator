import { SidebarProvider } from "./sidebar";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};
