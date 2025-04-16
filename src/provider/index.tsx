import { AuthProvider } from "./auth";
import { SidebarProvider } from "./sidebar";
import { ThemeProvider } from "./theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
};
