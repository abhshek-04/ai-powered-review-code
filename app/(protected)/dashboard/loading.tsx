import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Skeleton className="size-7" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-8 sm:px-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </>
  );
}
