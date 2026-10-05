import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { processTask } from "./function";
import { syncRepoCodebaseFunction } from "@/features/repo-sync/server/repo-sync-functions";
import { reviewPullRequest } from "@/features/reviews/server/review-pr-functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, syncRepoCodebaseFunction, reviewPullRequest],
});
