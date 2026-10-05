import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { SidebarUserButton } from "@/features/dashboard/components/sidebar-user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserMenuUser } from "@/features/auth/components/user-menu";
import type { UsageSummary } from "@/features/billing/server/usage";
import { SidebarUpgradeCard } from "@/features/billing/components/sidebar-upgrade-card";

type DashboardSidebarProps = {
  user: UserMenuUser;
  plan?: string;
  upgradeUsage?: UsageSummary | null;
};

export function DashboardSidebar({
  user,
  plan = "Free",
  upgradeUsage = null,
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Chai Review"
              className="hover:bg-transparent active:bg-transparent"
              render={
                <Link href={DASHBOARD_ROUTES.overview}>
                  <LogoMark className="size-6 group-data-[collapsible=icon]:size-5" />
                  <span className="truncate text-[15px] font-semibold tracking-tight">
                    Chai<span className="font-medium text-muted-foreground"> Review</span>
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t border-sidebar-border">
        {upgradeUsage ? <SidebarUpgradeCard usage={upgradeUsage} /> : null}
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
