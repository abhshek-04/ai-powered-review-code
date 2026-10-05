"use client";

import React from 'react'
import { useMutation , useQueryClient } from '@tanstack/react-query';
import { githubRepoKeys } from '@/features/github/lib/repos-query';
import { syncRepoCodebase } from '../actions/repo-sync';
import { Button } from '@/components/ui/button';
import { RepoSyncStatus } from '../types';
import { toast } from 'sonner';
import { ArrowsClockwiseIcon, CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { Spinner } from '@/components/ui/spinner';



type SyncRepoButtonProps = {
    repoFullName: string;
    branch: string;
    syncStatus: RepoSyncStatus | null;
  };
  

  function isSyncing(status: RepoSyncStatus | null, mutationPending: boolean) {
    if (mutationPending) {
      return true;
    }
  
    return status === "pending" || status === "syncing";
  }

  
function getButtonLabel(status: RepoSyncStatus | null, mutationPending: boolean) {
    if (isSyncing(status, mutationPending)) {
      return "Syncing…";
    }
  
    if (status === "synced") {
      return "Re-sync";
    }
  
    return "Sync";
  }

const SyncRepoButton = ({repoFullName , branch , syncStatus}:SyncRepoButtonProps) => {
    const queryClient = useQueryClient();

    const syncRepo = useMutation({
        mutationFn:()=>syncRepoCodebase(repoFullName , branch),
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: githubRepoKeys.all });
            toast.success(`Sync started for ${repoFullName}`);
        },
        onError:(error)=>{
            toast.error(`Failed to sync repo ${repoFullName}: ${error.message}`);
        }
    })


    const syncing = isSyncing(syncStatus, syncRepo.isPending);

  return (
    <div className="inline-flex items-center justify-end gap-2.5">
      <SyncStatusIndicator status={syncing ? "syncing" : syncStatus} />
      <Button
        size="sm"
        variant={syncStatus === "synced" ? "ghost" : "outline"}
        disabled={syncing}
        onClick={() => syncRepo.mutate()}
        className="min-w-[84px]"
      >
        {syncing ? <Spinner className="size-3.5" /> : <ArrowsClockwiseIcon />}
        {getButtonLabel(syncStatus, syncRepo.isPending)}
      </Button>
    </div>
  )
}

function SyncStatusIndicator({ status }: { status: RepoSyncStatus | null }) {
  if (status === "synced") {
    return (
      <span className="hidden items-center gap-1 text-xs text-primary sm:inline-flex">
        <CheckCircleIcon weight="fill" className="size-3.5" />
        Indexed
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="hidden items-center gap-1 text-xs text-destructive sm:inline-flex">
        <WarningCircleIcon weight="fill" className="size-3.5" />
        Failed
      </span>
    );
  }

  return null;
}

export default SyncRepoButton
