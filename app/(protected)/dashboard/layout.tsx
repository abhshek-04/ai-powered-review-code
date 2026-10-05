import { requireAuth } from "@/features/auth/actions";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { getUsageSummary } from "@/features/billing/server/usage";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const [subscription, usage] = await Promise.all([
    getUserSubscription(session.user.id),
    getUsageSummary(session.user.id),
  ]);

  return (
    <DashboardShell
      user={session.user}
      plan={PLAN_DETAILS[subscription.plan].label}
      // Free users get the sidebar upgrade card
      upgradeUsage={subscription.plan === "free" ? usage : null}
    >
      {children}
    </DashboardShell>
  );
}
