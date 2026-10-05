"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    GitBranchIcon,
    GlobeIcon,
    LockIcon,
    MagnifyingGlassIcon,
    StarIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { githubReposInfiniteQuery } from "@/features/github/lib/repos-query";
import { DashboardRepo } from "../lib/types";
import { statusBadge } from "../lib/status-style";
import SyncRepoButton from "@/features/repo-sync/components/sync-repo-button";

type Filter = "all" | "public" | "private";

const COLUMN_COUNT = 6;

/** A few common language colours (GitHub linguist palette). */
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Go: "#00ADD8",
    Rust: "#dea584",
    Java: "#b07219",
    "C#": "#178600",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    HTML: "#e34c26",
    CSS: "#663399",
    Shell: "#89e051",
    Dart: "#00B4AB",
    Vue: "#41b883",
};

export function RepoList() {
    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        isError,
        refetch,
    } = useInfiniteQuery(githubReposInfiniteQuery);

    const loading = isPending && !data;

    const repos = useMemo(() => {
        if (!data) {
            return [];
        }

        const loaded = data.pages.flatMap((page) => page.repos);
        return [...loaded].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [data]);

    const totalCount = data?.pages[0]?.totalCount ?? 0;

    const counts = {
        all: totalCount,
        public: repos.filter((repo) => repo.visibility === "public").length,
        private: repos.filter((repo) => repo.visibility === "private").length,
    };

    const visibleRepos = useMemo(() => {
        const query = search.toLowerCase();

        return repos.filter((repo) => {
            if (filter !== "all" && repo.visibility !== filter) {
                return false;
            }

            if (query && !repo.fullName.toLowerCase().includes(query)) {
                return false;
            }

            return true;
        });
    }, [repos, filter, search]);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (!element || !hasNextPage || isFetchingNextPage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    fetchNextPage();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    let footer: React.ReactNode = null;

    if (isFetchingNextPage) {
        footer = (
            <span className="inline-flex items-center gap-2">
                <Spinner className="size-3.5" />
                Loading more repositories…
            </span>
        );
    } else if (hasNextPage) {
        footer = `Showing ${repos.length} of ${totalCount}`;
    } else if (repos.length > 0) {
        footer = `All ${repos.length} repositories loaded`;
    }

    let rows;

    if (loading) {
        rows = Array.from({ length: 6 }, (_, index) => <RepoRowSkeleton key={index} />);
    } else if (isError) {
        rows = (
            <StateRow>
                <WarningCircleIcon className="size-6 text-destructive" />
                <p className="font-medium text-foreground">Failed to load repositories</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-xs text-primary underline-offset-4 hover:underline"
                >
                    Try again
                </button>
            </StateRow>
        );
    } else if (visibleRepos.length === 0) {
        rows = (
            <StateRow>
                <MagnifyingGlassIcon className="size-6" />
                <p className="font-medium text-foreground">No repositories found</p>
                <p className="text-xs">
                    {search ? "Try a different search term or filter." : "No repositories match this filter."}
                </p>
            </StateRow>
        );
    } else {
        rows = visibleRepos.map((repo) => <RepoRow key={repo.id} repo={repo} />);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Tabs
                    value={filter}
                    onValueChange={(value) => setFilter(value as Filter)}
                >
                    <TabsList>
                        <TabsTrigger value="all">
                            All <Count value={counts.all} />
                        </TabsTrigger>
                        <TabsTrigger value="public">
                            Public <Count value={counts.public} />
                        </TabsTrigger>
                        <TabsTrigger value="private">
                            Private <Count value={counts.private} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <InputGroup className="sm:max-w-xs">
                    <InputGroupAddon>
                        <MagnifyingGlassIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder="Search repositories…"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="pl-4">Repository</TableHead>
                            <TableHead className="hidden md:table-cell">Language</TableHead>
                            <TableHead className="hidden sm:table-cell">Visibility</TableHead>
                            <TableHead className="hidden text-right lg:table-cell">Stars</TableHead>
                            <TableHead className="hidden text-right md:table-cell">Updated</TableHead>
                            <TableHead className="pr-4 text-right">Codebase</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{rows}</TableBody>
                </Table>
            </div>

            <div ref={loadMoreRef} className="py-2 text-center text-xs text-muted-foreground">
                {footer}
            </div>
        </div>
    );
}

function Count({ value }: { value: number }) {
    return (
        <span className="ml-1 rounded-full bg-muted px-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">
            {value}
        </span>
    );
}

function StateRow({ children }: { children: React.ReactNode }) {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMN_COUNT} className="py-16">
                <div className="flex flex-col items-center gap-1.5 text-center text-sm text-muted-foreground">
                    {children}
                </div>
            </TableCell>
        </TableRow>
    );
}

function RepoRowSkeleton() {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell className="pl-4">
                <div className="space-y-1.5 py-0.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-3.5 w-20" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="ml-auto h-3.5 w-8" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="ml-auto h-3.5 w-20" /></TableCell>
            <TableCell className="pr-4"><Skeleton className="ml-auto h-8 w-16" /></TableCell>
        </TableRow>
    );
}

function RepoRow({ repo }: { repo: DashboardRepo }) {
    const isPrivate = repo.visibility === "private";

    return (
        <TableRow>
            <TableCell className="pl-4">
                <div className="flex flex-col py-0.5">
                    <span className="font-medium">{repo.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="truncate">{repo.fullName.split("/")[0]}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <GitBranchIcon className="size-3" />
                        <span className="truncate font-mono text-[11px]">{repo.defaultBranch}</span>
                    </span>
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {repo.language ? (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2.5 rounded-full ring-1 ring-foreground/10"
                            style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "var(--muted-foreground)" }}
                        />
                        {repo.language}
                    </span>
                ) : (
                    <span className="text-muted-foreground/60">—</span>
                )}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
                <span className={statusBadge(isPrivate ? "warning" : "neutral")}>
                    {isPrivate ? <LockIcon className="size-3" /> : <GlobeIcon className="size-3" />}
                    {repo.visibility}
                </span>
            </TableCell>
            <TableCell className="hidden text-right lg:table-cell">
                <span className="inline-flex items-center justify-end gap-1 tabular-nums text-muted-foreground">
                    <StarIcon className="size-3.5" />
                    {repo.stars}
                </span>
            </TableCell>
            <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
            </TableCell>
            <TableCell className="pr-4 text-right">
                <SyncRepoButton
                    repoFullName={repo.fullName}
                    branch={repo.defaultBranch}
                    syncStatus={repo.syncStatus ?? null}
                />
            </TableCell>
        </TableRow>
    );
}
