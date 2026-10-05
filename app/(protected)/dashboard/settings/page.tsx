import type { Metadata } from "next";

import { requireAuth } from "@/features/auth/actions";
import {
  DashboardContent,
  DashboardHeader,
} from "@/features/dashboard/components/dashboard-header";
import { SettingsContent } from "@/features/dashboard/components/settings-content";
import { getUserSettings } from "@/features/settings/server/get-settings";

export const metadata: Metadata = {
  title: "Settings",
};

type SettingsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function DashboardSettingsPage({ searchParams }: SettingsPageProps) {
  const session = await requireAuth();
  const settings = await getUserSettings(session.user.id);
  const { tab } = await searchParams;

  return (
    <>
      <DashboardHeader
        title="Settings"
        description="Manage your profile and subscription."
      />
      <DashboardContent>
        <SettingsContent
          profile={settings.profile}
          subscription={settings.subscription}
          usage={settings.usage}
          defaultTab={tab === "subscription" ? "subscription" : "profile"}
        />
      </DashboardContent>
    </>
  );
}
