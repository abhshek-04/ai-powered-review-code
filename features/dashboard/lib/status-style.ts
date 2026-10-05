import { cn } from "@/lib/utils";

/** Background, border, and text colors for inline status badges. */
export const statusBadgeClass = {
  success: "border-primary/30 bg-primary/10 text-primary",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  neutral: "border-border bg-muted/60 text-muted-foreground",
} as const;

/** Button variants for primary actions like "Install" or "Disconnect". */
export const statusButtonClass = {
  success: "",
  danger:
    "border-red-500/40 bg-transparent text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:border-red-500/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10",
  warning:
    "border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 dark:text-amber-400",
} as const;

/**
 * Builds a complete className string for a small status badge pill.
 *
 * @param tone - Semantic color from `statusBadgeClass` keys.
 * @param className - Optional extra classes (e.g. `gap-1` when an icon is inside).
 * @returns A merged Tailwind class string ready for a `<span>`.
 */
export function statusBadge(
  tone: keyof typeof statusBadgeClass,
  className?: string
) {
  return cn(
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize leading-4",
    statusBadgeClass[tone],
    className
  );
}
