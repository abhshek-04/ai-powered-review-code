"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GearIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  GithubLogoIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";

import {
  DASHBOARD_NAV_GROUPS,
  type DashboardRoute,
} from "@/features/dashboard/lib/routes";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ICONS = {
  "layout-dashboard": SquaresFourIcon,
  "folder-git-2": GitBranchIcon,
  "git-pull-request": GitPullRequestIcon,
  github: GithubLogoIcon,
  settings: GearIcon,
} as const;

function isNavActive(pathname: string, href: DashboardRoute) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {DASHBOARD_NAV_GROUPS.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = NAV_ICONS[item.icon];
                const active = isNavActive(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      className="text-muted-foreground data-active:text-foreground [&_svg]:text-muted-foreground data-active:[&_svg]:text-primary"
                      render={
                        <Link href={item.href}>
                          <Icon weight={active ? "fill" : "regular"} />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
