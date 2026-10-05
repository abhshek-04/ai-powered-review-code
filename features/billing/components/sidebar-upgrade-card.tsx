"use client";

import type { UsageSummary } from "@/features/billing/server/usage";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { cn } from "@/lib/utils";

type SidebarUpgradeCardProps = {
  usage: UsageSummary;
};

/**
 * "Upgrade to Pro" card shown in the sidebar footer for Free users.
 * Hidden when the sidebar is collapsed to icons.
 */
export function SidebarUpgradeCard({ usage }: SidebarUpgradeCardProps) {
  const limit = usage.limit ?? 0;
  const percent = limit > 0 ? Math.min(100, Math.round((usage.used / limit) * 100)) : 0;
  const limitReached = limit > 0 && usage.used >= limit;

  return (
    <div className="relative overflow-hidden rounded-lg border border-sidebar-border bg-background/60 p-3 group-data-[collapsible=icon]:hidden">
      <div className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-primary/20 blur-2xl" />

      <p className="relative text-[13px] font-medium">
        {limitReached ? "Monthly limit reached" : "Upgrade to Pro"}
      </p>
      <p className="relative mt-0.5 text-[11px] leading-snug text-muted-foreground">
        Unlimited AI reviews and priority support.
      </p>

      {usage.limit !== null ? (
        <div className="relative mt-3 space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Reviews</span>
            <span className="tabular-nums">
              {usage.used} / {usage.limit}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", limitReached ? "bg-amber-500" : "bg-primary")}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      <UpgradeButton size="sm" label="Upgrade" className="relative mt-3 w-full" />
    </div>
  );
}
