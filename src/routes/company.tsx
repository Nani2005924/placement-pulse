import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

function AppLayout() {
  const { selected } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      const stored = window.localStorage.getItem("selected-company");
      if (!selected && !stored) navigate({ to: "/" });
    }, 150);
    return () => clearTimeout(t);
  }, [selected, navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-3 sm:px-4">
            <SidebarTrigger />
            <nav className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <span>SVCE Hub</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground truncate max-w-[180px] sm:max-w-none">
                {selected?.companyName ?? "—"}
              </span>
            </nav>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}