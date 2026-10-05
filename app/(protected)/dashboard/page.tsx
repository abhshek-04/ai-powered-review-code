import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  CheckIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/features/auth/actions";
import {
  DashboardContent,
  DashboardHeader,
} from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { getInstallationStatus } from "@/features/github/server/installation";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Overview",
};

type SetupStep = {
  title: string;
  description: string;
  done: boolean;
  href?: string;
  cta?: string;
};

export default async function DashboardOverviewPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);
  const firstName =
    session.user.name?.trim().split(/\s+/)[0] ||
    session.user.email?.split("@")[0] ||
    "there";

  const steps: SetupStep[] = [
    {
      title: "Install the GitHub App",
      description: installation.connected
        ? `Connected to @${installation.accountLogin}.`
        : "Grant access to the repositories you want reviewed.",
      done: installation.connected,
      href: DASHBOARD_ROUTES.github,
      cta: "Connect",
    },
    {
      title: "Sync a repository",
      description:
        "Index a codebase so reviews have context beyond the diff.",
      done: false,
      href: DASHBOARD_ROUTES.repos,
      cta: "Open repositories",
    },
    {
      title: "Open a pull request",
      description:
        "Chai reviews it automatically and posts its findings on GitHub.",
      done: false,
    },
  ];

  const quickLinks = [
    {
      title: "Repositories",
      description: "Browse and sync repositories",
      href: DASHBOARD_ROUTES.repos,
      icon: GitBranchIcon,
    },
    {
      title: "Pull requests",
      description: "See reviewed pull requests",
      href: DASHBOARD_ROUTES.pullRequest,
      icon: GitPullRequestIcon,
    },
    {
      title: "GitHub App",
      description: "Manage your installation",
      href: DASHBOARD_ROUTES.github,
      icon: GithubLogoIcon,
    },
  ];

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${firstName}`}
        description="Here's how your AI reviewer is set up."
      />
      <DashboardContent>
        <section className="rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 className="text-sm font-medium">Getting started</h2>
              <p className="text-xs text-muted-foreground">
                Complete these steps to receive your first automated review.
              </p>
            </div>
            <span
              className={statusBadge(
                installation.connected ? "success" : "neutral",
                "normal-case"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  installation.connected ? "bg-primary" : "bg-muted-foreground"
                )}
              />
              {installation.connected ? "GitHub connected" : "Not connected"}
            </span>
          </div>
          <ol className="divide-y">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                    step.done
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.done ? <CheckIcon weight="bold" className="size-3.5" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.done && "text-muted-foreground line-through decoration-muted-foreground/40"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {step.href && !step.done ? (
                  <Button
                    size="sm"
                    variant={index === 0 ? "default" : "outline"}
                    nativeButton={false}
                    render={<Link href={step.href} />}
                  >
                    {step.cta}
                    <ArrowRightIcon />
                  </Button>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-hover:text-primary">
                <Icon className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{title}</p>
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </section>

        <section className="flex items-start gap-3 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          <ArrowsClockwiseIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            Tip: re-sync a repository after large refactors so reviews use the
            latest version of your code.
          </p>
        </section>
      </DashboardContent>
    </>
  );
}
