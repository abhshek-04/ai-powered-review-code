import type { Metadata } from "next";
import { ShieldCheckIcon } from "@phosphor-icons/react/ssr";

import { GithubSignInForm } from "@/features/auth/components/github-sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Chai Review with your GitHub account.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with GitHub to review and manage your code.
        </p>
      </div>

      <GithubSignInForm callbackUrl={callbackUrl} />

      <div className="flex gap-3 rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          We only request the permissions needed to identify your account. You
          can revoke access anytime from your GitHub settings.
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
