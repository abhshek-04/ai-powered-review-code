import { DashboardRepo } from "@/features/dashboard/lib/types";
import { infiniteQueryOptions } from "@tanstack/react-query";


type GithubReposPage = {
    repos: DashboardRepo[];
    totalCount: number;
    page: number;
    hasMore: boolean;
};


export const githubRepoKeys = {
    all: ["github", "repos"] as const,
};

const REPOS_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const SYNC_POLL_INTERVAL = 3000; // 3 seconds


export const githubReposInfiniteQuery = infiniteQueryOptions({
    queryKey: [...githubRepoKeys.all, "list"],
    queryFn: async ({ pageParam }): Promise<GithubReposPage> => {
        const response = await fetch(`/api/github/repos?page=${pageParam}`);

        if (!response.ok) {
            throw new Error("Failed to load repositories");
        }

        return response.json()
    },
    // Poll while any repo sync is in progress so the button leaves "Syncing…" when the job finishes
    refetchInterval: (query) => {
        const syncing = query.state.data?.pages.some((page) =>
            page.repos.some((repo) => repo.syncStatus === "pending" || repo.syncStatus === "syncing")
        );

        return syncing ? SYNC_POLL_INTERVAL : false;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
        if (lastPage.hasMore) {
            return lastPage.page + 1
        }
    },
    staleTime: REPOS_STALE_TIME
})