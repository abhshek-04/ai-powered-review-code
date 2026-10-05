import type { Metadata } from "next";
import Link from "next/link";
import { GithubLogoIcon } from "@phosphor-icons/react/ssr";

import {
  DashboardContent,
  DashboardHeader,
} from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getInstallationStatus } from "@/features/github/server/installation";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { requireAuth } from "@/features/auth/actions";
import { RepoList } from "@/features/dashboard/components/repo-list";

export const metadata: Metadata = {
  title: "Repositories",
};

function ReposNotConnected() {
  return (
    <Empty className="rounded-xl border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GithubLogoIcon />
        </EmptyMedia>
        <EmptyTitle>Connect GitHub to see repositories</EmptyTitle>
        <EmptyDescription>
          Install the GitHub App first. Your repositories will appear here once
          access is granted.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link href={DASHBOARD_ROUTES.github} />}>
          Go to GitHub App
        </Button>
      </EmptyContent>
    </Empty>
  );
}

/**
 * Repositories list page with GitHub connection guard.
 *
 * @returns Header plus either connect prompt or interactive repo table.
 */
export default async function DashboardReposPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Repositories"
        description="All public and private repositories available to the GitHub App."
      />
      <DashboardContent>
        {installation.connected ? <RepoList /> : <ReposNotConnected />}
      </DashboardContent>
    </>
  );
}
