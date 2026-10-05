import Link from "next/link";
import {
  ArrowRightIcon,
  ChatCircleTextIcon,
  CheckCircleIcon,
  DatabaseIcon,
  GitPullRequestIcon,
  GithubLogoIcon,
  LightningIcon,
  LockIcon,
  ShieldCheckIcon,
  SparkleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";

import { Logo, LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { getServerSession } from "@/features/auth/actions";
import { SIGN_IN_PATH } from "@/features/auth/utils";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

const FEATURES = [
  {
    icon: DatabaseIcon,
    title: "Codebase-aware context",
    description:
      "Repositories are indexed into a vector store, so every review understands how a change fits the rest of your code.",
  },
  {
    icon: ChatCircleTextIcon,
    title: "Comments where you work",
    description:
      "Feedback lands directly on the pull request as a GitHub comment. No new tool for your team to learn.",
  },
  {
    icon: LightningIcon,
    title: "Reviews in seconds",
    description:
      "Webhooks trigger a review the moment a PR is opened, so authors get feedback before a human even looks.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Catches the subtle stuff",
    description:
      "Logic errors, unsafe input handling, missing edge cases and performance traps — not just lint nits.",
  },
  {
    icon: LockIcon,
    title: "Private repos supported",
    description:
      "Install the GitHub App on exactly the repositories you choose. Revoke access any time from GitHub.",
  },
  {
    icon: SparkleIcon,
    title: "Actionable suggestions",
    description:
      "Every finding comes with a clear explanation and a concrete fix, ranked by severity.",
  },
] as const;

const STEPS = [
  {
    title: "Install the GitHub App",
    description: "Sign in with GitHub and grant access to the repositories you want reviewed.",
  },
  {
    title: "Sync your codebase",
    description: "Index a repository once so reviews have full project context.",
  },
  {
    title: "Open a pull request",
    description: "Chai reviews the diff and posts its findings as a comment automatically.",
  },
] as const;

export default async function Home() {
  const session = await getServerSession();
  const primaryHref = session ? DASHBOARD_ROUTES.overview : SIGN_IN_PATH;
  const primaryLabel = session ? "Go to dashboard" : "Get started free";

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader signedIn={Boolean(session)} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-grid mask-radial-fade opacity-60" />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary" />
              AI pull request reviews for GitHub
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold text-gradient sm:text-6xl sm:leading-[1.05]">
              Ship better code with a reviewer that knows your codebase
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Chai reads every pull request with context from your entire
              repository and posts precise, actionable feedback right on GitHub.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 px-5"
                nativeButton={false}
                render={<Link href={primaryHref} />}
              >
                {session ? null : <GithubLogoIcon />}
                {primaryLabel}
                <ArrowRightIcon />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5"
                nativeButton={false}
                render={<a href="#how-it-works" />}
              >
                See how it works
              </Button>
            </div>

            <ReviewPreview />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <SectionHeading
              eyebrow="Features"
              title="Everything a great reviewer does"
              description="Without the wait, and without the review fatigue."
            />
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-background p-6 transition-colors hover:bg-muted/40">
                  <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <h3 className="mt-4 text-sm font-medium">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <SectionHeading
              eyebrow="How it works"
              title="Set up in under two minutes"
              description="Three steps from sign-in to your first automated review."
            />
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative rounded-xl border bg-card p-6">
                  <span className="font-mono text-xs text-primary">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-sm font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t">
          <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-24">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-48 max-w-2xl rounded-full bg-primary/10 blur-[100px]" />
            <h2 className="relative text-3xl font-semibold sm:text-4xl">
              Your next PR deserves a second pair of eyes
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">
              Connect GitHub and get your first AI review today.
            </p>
            <Button
              size="lg"
              className="relative mt-8 h-11 px-5"
              nativeButton={false}
              render={<Link href={primaryHref} />}
            >
              {primaryLabel}
              <ArrowRightIcon />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <LogoMark className="size-5" />
            <span>© {new Date().getFullYear()} Chai Review</span>
          </div>
          <nav className="flex gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how-it-works" className="hover:text-foreground">How it works</a>
            <Link href={SIGN_IN_PATH} className="hover:text-foreground">Sign in</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Chai Review home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <ModeToggle />
          {signedIn ? (
            <Button size="sm" nativeButton={false} render={<Link href={DASHBOARD_ROUTES.overview} />}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" nativeButton={false} render={<Link href={SIGN_IN_PATH} />}>
                Sign in
              </Button>
              <Button size="sm" nativeButton={false} render={<Link href={SIGN_IN_PATH} />}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
  );
}

/** Static mock of a PR review comment, shown in the hero. */
function ReviewPreview() {
  return (
    <div className="relative mt-16 w-full max-w-4xl text-left">
      <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/30 via-border to-transparent" />
      <div className="relative overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
          <GitPullRequestIcon className="size-4 text-primary" />
          <span className="truncate text-sm font-medium">feat: add rate limiting to auth endpoints</span>
          <span className="ml-auto hidden font-mono text-xs text-muted-foreground sm:inline">#142</span>
        </div>

        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <pre className="overflow-x-auto border-b p-4 font-mono text-[12.5px] leading-6 md:border-r md:border-b-0">
            <code>
              <span className="block text-muted-foreground">  export async function login(req) {"{"}</span>
              <span className="block bg-red-500/10 text-red-600 dark:text-red-400">-   const user = await db.find(req.body.email)</span>
              <span className="block bg-primary/10 text-primary">+   const ip = req.headers[&quot;x-forwarded-for&quot;]</span>
              <span className="block bg-primary/10 text-primary">+   await limiter.consume(ip)</span>
              <span className="block bg-primary/10 text-primary">+   const user = await db.find(req.body.email)</span>
              <span className="block text-muted-foreground">    if (!user) return unauthorized()</span>
              <span className="block text-muted-foreground">  {"}"}</span>
            </code>
          </pre>

          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <LogoMark className="size-5" />
              <span className="text-sm font-medium">chai-review</span>
              <span className="rounded-full border px-1.5 py-px text-[10px] text-muted-foreground">bot</span>
            </div>
            <ReviewFinding
              tone="warning"
              title="Spoofable client IP"
              body="x-forwarded-for can be set by the client. Use the trusted proxy IP so attackers can't bypass the limiter."
            />
            <ReviewFinding
              tone="success"
              title="Limiter placed before DB lookup"
              body="Good call — this prevents user-enumeration timing attacks."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewFinding({
  tone,
  title,
  body,
}: {
  tone: "warning" | "success";
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border bg-background/50 p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        {tone === "success" ? (
          <CheckCircleIcon className="size-4 text-primary" />
        ) : (
          <WarningCircleIcon className="size-4 text-amber-500" />
        )}
        {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
