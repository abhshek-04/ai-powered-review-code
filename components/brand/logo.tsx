import { cn } from "@/lib/utils";

/** Square brand mark: a review "check" inside code brackets. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[62%]">
        <path
          d="M7 6 2.5 12 7 18M17 6l4.5 6-4.5 6"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <path
          d="m8.5 12.5 2.5 2.5 4.5-5.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Mark + wordmark. Hide the wordmark by passing `showWordmark={false}`. */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-tight">
          PR<span className="text-muted-foreground font-medium"> Reviewer</span>
        </span>
      ) : null}
    </span>
  );
}
