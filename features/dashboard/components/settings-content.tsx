/**
 * Settings page body with Profile and Subscription tabs.
 *
 * Profile fields are read-only (sourced from GitHub). Subscription tab shows
 * plan details, usage, and upgrade/cancel actions via billing components.
 */

"use client";

import { format } from "date-fns";


import { UpgradeButton } from "@/features/billing/components/upgrade-button";

import type { UserSubscription } from "@/features/dashboard/lib/types";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsProfile } from "@/features/settings/types";
import type { UsageSummary } from "@/features/billing/server/usage";
import { statusBadge } from "../lib/status-style";
import { CancelSubscriptionButton } from "@/features/billing/components/cancel-subscription-button";
import { getDisplayName, getInitials } from "@/features/auth/components/user-menu";
import { CheckIcon } from "@phosphor-icons/react";

type SettingsContentProps = {
  profile: SettingsProfile;
  subscription: UserSubscription;
  usage: UsageSummary;
  defaultTab?: "profile" | "subscription";
};

/**
 * Formats a renewal ISO date for display, or returns null when absent.
 *
 * @param renewsAt - Subscription renewal timestamp or null.
 * @returns Formatted date like "June 12, 2026", or null.
 */
function formatRenewalDate(renewsAt: string | null): string | null {
  if (!renewsAt) {
    return null;
  }

  return format(new Date(renewsAt), "MMMM d, yyyy");
}

/**
 * Maps subscription status enum to a lowercase label for the UI.
 *
 * @param status - `active`, `trialing`, or `canceled`.
 * @returns Display string for the status line.
 */
function getSubscriptionStatusLabel(status: UserSubscription["status"]): string {
  if (status === "active") {
    return "active";
  }

  if (status === "trialing") {
    return "trialing";
  }

  return "canceled";
}

/**
 * Profile tab — avatar, read-only name/email, member since date.
 *
 * @param profile - User profile from GitHub OAuth.
 * @returns Profile card content.
 */
function ProfileTab({ profile }: { profile: SettingsProfile }) {
  const displayName = getDisplayName(profile);
  const initials = getInitials(profile);
  const memberSince = format(new Date(profile.memberSince), "MMMM d, yyyy");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Account information from your GitHub sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {profile.image ? (
              <AvatarImage src={profile.image} alt={displayName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" defaultValue={profile.name} readOnly />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={profile.email}
              readOnly
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Profile details are managed by GitHub. Update them in your GitHub
          account settings.
        </p>
      </CardFooter>
    </Card>
  );
}

/**
 * Builds the monthly usage summary line for the subscription tab.
 *
 * @param usage - Review count used and optional monthly limit.
 * @returns Sentence describing current usage.
 */
function getUsageText(usage: UsageSummary): string {
  if (usage.limit === null) {
    return `${usage.used} reviews used this month (unlimited)`;
  }

  return `${usage.used} / ${usage.limit} reviews used this month`;
}

/**
 * Subscription tab — plan card, usage, feature list, billing actions.
 *
 * @param subscription - Current plan and billing status.
 * @param usage - Monthly AI review usage counts.
 * @returns Subscription management card.
 */
function SubscriptionTab({
  subscription,
  usage,
}: {
  subscription: UserSubscription;
  usage: UsageSummary;
}) {
  const planDetails = PLAN_DETAILS[subscription.plan];
  const renewalDate = formatRenewalDate(subscription.renewsAt);
  const statusLabel = getSubscriptionStatusLabel(subscription.status);

  const isPro = subscription.plan === "pro";
  const isCanceled = subscription.status === "canceled";

  let badgeTone: "success" | "neutral" | "warning" = isPro ? "success" : "neutral";
  if (isCanceled) {
    badgeTone = "warning";
  }

  const usagePercent =
    usage.limit === null ? 100 : Math.min(100, Math.round((usage.used / usage.limit) * 100));

  return (
    <div className="space-y-4">
      <Card className={cn(isPro && !isCanceled && "ring-primary/30")}>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>
            Manage your plan and billing for AI code reviews.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4",
              isPro && !isCanceled ? "border-primary/30 bg-primary/5" : "bg-muted/30"
            )}
          >
            <div className="space-y-0.5">
              <p className="text-base font-semibold">{planDetails.label} plan</p>
              <p className="text-xs text-muted-foreground">
                Status: <span className="capitalize text-foreground">{statusLabel}</span>
                {renewalDate ? ` · ${isCanceled ? "Ends" : "Renews"} ${renewalDate}` : null}
              </p>
            </div>
            <span className={statusBadge(badgeTone)}>{planDetails.label}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Reviews this month</span>
              <span className="tabular-nums text-muted-foreground">{getUsageText(usage)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  usagePercent >= 100 && usage.limit !== null ? "bg-amber-500" : "bg-primary"
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {planDetails.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckIcon weight="bold" className="size-3.5 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {subscription.plan === "free" ? <UpgradeButton /> : null}
          {subscription.plan === "pro" ? (
            <CancelSubscriptionButton disabled={isCanceled} />
          ) : null}
        </CardFooter>
      </Card>

      {subscription.plan === "free" ? (
        <Card className="ring-primary/30">
          <CardHeader>
            <CardTitle>{PLAN_DETAILS.pro.label}</CardTitle>
            <CardDescription>Everything you need for a busy team.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {PLAN_DETAILS.pro.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon weight="bold" className="size-3.5 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

/**
 * Settings page with tabbed Profile and Subscription sections.
 *
 * @param profile - User profile data from the server.
 * @param subscription - Billing subscription state.
 * @param usage - Monthly review usage summary.
 * @returns Tabbed settings UI below `DashboardHeader`.
 */
export function SettingsContent({
  profile,
  subscription,
  usage,
  defaultTab = "profile",
}: SettingsContentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Tabs defaultValue={defaultTab} className="w-full max-w-2xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <ProfileTab profile={profile} />
        </TabsContent>

        <TabsContent value="subscription" className="mt-6 space-y-6">
          <SubscriptionTab subscription={subscription} usage={usage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}