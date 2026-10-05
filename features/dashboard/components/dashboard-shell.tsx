import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { UserMenuUser } from "@/features/auth/components/user-menu";
import type { UsageSummary } from "@/features/billing/server/usage";

type DashboardShellProps = {
  children: React.ReactNode;
  user: UserMenuUser;
  plan?: string;
  /** Usage for the sidebar upgrade card; `null` hides the card (Pro users). */
  upgradeUsage?: UsageSummary | null;
};

export function DashboardShell({
  children,
  user,
  plan,
  upgradeUsage = null,
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar user={user} plan={plan} upgradeUsage={upgradeUsage} />
        <SidebarInset className="min-h-svh">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
