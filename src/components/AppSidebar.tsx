import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Building2, GraduationCap, LayoutGrid } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "./CompanyLogo";

const items = [
  { title: "Company Intelligence", url: "/company/intelligence", icon: Building2 },
  { title: "Skill Intelligence", url: "/company/skills", icon: GraduationCap },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { selected, profile } = useCompany();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-[color:var(--color-app-sidebar-border)]">
        <div className="flex items-center gap-2 px-2 py-2">
          <CompanyLogo
            name={selected?.companyName ?? "?"}
            logoUrl={selected?.logoUrl}
            websiteUrl={profile?.website_url}
            size={28}
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="font-heading text-sm font-semibold leading-tight text-foreground truncate">
              {selected?.companyName ?? "No company selected"}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">SVCE · Hub</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[color:var(--color-app-sidebar-border)]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate({ to: "/" })}>
              <LayoutGrid className="h-4 w-4" />
              <span>All Companies</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}