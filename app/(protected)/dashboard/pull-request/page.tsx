import type { Metadata } from "next";
import Link from "next/link";
import { GitPullRequestIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DashboardContent,
  DashboardHeader,
} from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

export const metadata: Metadata = {
  title: "Pull requests",
};

export default function DashboardPullRequestsPage() {
  return (
    <>
      <DashboardHeader
        title="Pull requests"
        description="Pull requests reviewed by PR Reviewer across your repositories."
      />
      <DashboardContent>
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GitPullRequestIcon />
            </EmptyMedia>
            <EmptyTitle>Review history is coming soon</EmptyTitle>
            <EmptyDescription>
              Reviews are already posted as comments on each pull request in
              GitHub. A searchable history will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={DASHBOARD_ROUTES.repos} />}
            >
              View repositories
            </Button>
          </EmptyContent>
        </Empty>
      </DashboardContent>
    </>
  );
}
