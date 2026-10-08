"use client";

import { formatDistanceToNow } from "date-fns";
import {
    ArrowSquareOutIcon,
    ChatCircleTextIcon,
    CheckIcon,
    GithubLogoIcon,
    LockIcon,
    PlugsIcon,
    WebhooksLogoIcon,
} from "@phosphor-icons/react";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
    statusBadge,
    statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { disconnectGithubApp } from "../actions";

type GithubConnectCardProps = {
    userId: string;
    installation: GithubInstallationStatus;
};

const PERMISSIONS = [
    {
        icon: LockIcon,
        title: "Repository access",
        description: "Read code and metadata for the public and private repositories you select.",
    },
    {
        icon: WebhooksLogoIcon,
        title: "Pull request webhooks",
        description: "Get notified when pull requests are opened or updated.",
    },
    {
        icon: ChatCircleTextIcon,
        title: "Review comments",
        description: "Post AI-generated review feedback on your pull requests.",
    },
] as const;

function ConnectedActions() {
    return (
        <form action={disconnectGithubApp}>
            <Button
                type="submit"
                variant="outline"
                className={statusButtonClass.danger}
            >
                <PlugsIcon />
                Disconnect
            </Button>
        </form>
    );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
    return (
        <Button nativeButton={false} render={<a href={installUrl} />}>
            <GithubLogoIcon />
            Install GitHub App
            <ArrowSquareOutIcon className="size-3.5 opacity-70" />
        </Button>
    );
}

export function GithubConnectCard({
    userId,
    installation,
}: GithubConnectCardProps) {
    const { connected, accountLogin, installedAt } = installation;
    // Install URL encodes userId so the callback can associate the installation
    const installUrl = getGithubInstallUrl(userId);

    return (
        <section className="max-w-3xl overflow-hidden rounded-xl border bg-card">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <span
                    className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-lg border",
                        connected
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "bg-muted/50 text-muted-foreground"
                    )}
                >
                    <GithubLogoIcon className="size-6" />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-medium">PR Reviewer GitHub App</h2>
                        <span className={statusBadge(connected ? "success" : "neutral", "normal-case")}>
                            <span
                                className={cn(
                                    "size-1.5 rounded-full",
                                    connected ? "bg-primary" : "bg-muted-foreground"
                                )}
                            />
                            {connected ? "Connected" : "Not connected"}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {connected ? (
                            <>
                                Installed on{" "}
                                <span className="font-medium text-foreground">@{accountLogin}</span>
                                {installedAt
                                    ? ` · ${formatDistanceToNow(new Date(installedAt), { addSuffix: true })}`
                                    : null}
                            </>
                        ) : (
                            "Install the app on your GitHub account or organization to start receiving reviews."
                        )}
                    </p>
                </div>
                <div className="shrink-0">
                    {connected ? (
                        <ConnectedActions />
                    ) : (
                        <DisconnectedActions installUrl={installUrl} />
                    )}
                </div>
            </div>

            <div className="border-t bg-muted/20 px-5 py-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {connected ? "Granted permissions" : "Requested permissions"}
                </p>
                <ul className="grid gap-3 sm:grid-cols-3">
                    {PERMISSIONS.map(({ icon: Icon, title, description }) => (
                        <li key={title} className="flex gap-2.5">
                            <span
                                className={cn(
                                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded",
                                    connected ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {connected ? <CheckIcon weight="bold" className="size-3.5" /> : <Icon className="size-4" />}
                            </span>
                            <div>
                                <p className="text-xs font-medium">{title}</p>
                                <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
