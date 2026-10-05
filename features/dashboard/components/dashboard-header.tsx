/**
 * Top bar + page intro shown on every dashboard page.
 *
 * The sticky bar holds the sidebar toggle, the page title and the theme
 * toggle; the intro block below it repeats the title as an h1 with the
 * optional description and any page-level actions.
 */

"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  /** Optional actions rendered on the right of the page intro. */
  actions?: React.ReactNode;
};

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <Separator orientation="vertical" className="mr-1 h-4 self-center" />
        <span className="truncate text-sm font-medium">{title}</span>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
    </>
  );
}

/** Standard content container that lines up with the page intro. */
export function DashboardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6", className)}>
      {children}
    </div>
  );
}
