import Link from "next/link";
import {
  ChatCircleTextIcon,
  DatabaseIcon,
  LightningIcon,
} from "@phosphor-icons/react/ssr";

import { Logo } from "@/components/brand/logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { requireUnauth } from "@/features/auth/actions";

const HIGHLIGHTS = [
  {
    icon: LightningIcon,
    text: "Automatic reviews the moment a pull request opens",
  },
  {
    icon: DatabaseIcon,
    text: "Context from your entire codebase, not just the diff",
  },
  {
    icon: ChatCircleTextIcon,
    text: "Feedback posted directly as a GitHub comment",
  },
] as const;

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnauth();

  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden border-r bg-muted/30 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-[420px] rounded-full bg-primary/15 blur-[120px]" />

        <Link href="/" className="relative w-fit" aria-label="PR Reviewer home">
          <Logo />
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Code review that never sleeps.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-background text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} PR Reviewer
        </p>
      </aside>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="lg:invisible" aria-label="PR Reviewer home">
            <Logo />
          </Link>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
