import type { Metadata } from "next";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { requireAuth } from "@/features/auth/actions";
import {
  DashboardContent,
  DashboardHeader,
} from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

export const metadata: Metadata = {
  title: "Settings",
};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 border-b py-8 first:pt-2 last:border-b-0 md:grid-cols-[240px_1fr] md:gap-10">
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-xl border bg-card p-5">{children}</div>
    </section>
  );
}

export default async function DashboardSettingsPage() {
  const { user } = await requireAuth();
  const initials = (user.name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <>
      <DashboardHeader
        title="Settings"
        description="Manage your account and preferences."
      />
      <DashboardContent className="gap-0">
        <SettingsSection
          title="Profile"
          description="Your profile is synced from your GitHub account."
        >
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {user.image ? <AvatarImage src={user.image} alt={user.name ?? ""} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Appearance"
          description="Choose how Chai looks on this device."
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Light, dark, or match your system.</p>
            </div>
            <ModeToggle className="border" />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Integrations"
          description="Connected services used to review your code."
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">GitHub App</p>
              <p className="text-xs text-muted-foreground">
                Manage repository access and installation.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={DASHBOARD_ROUTES.github} />}
            >
              Manage
            </Button>
          </div>
        </SettingsSection>
      </DashboardContent>
    </>
  );
}
