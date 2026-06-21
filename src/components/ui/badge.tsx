import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Status/intent colors live here once, instead of being scattered across
// feature components or (worse) stored as class strings in mock data.
const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-muted-foreground",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-500",
        high: "border-green-500/20 bg-green-500/10 text-green-500",
        medium: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
      },
      shape: {
        // `tag` has no border width, so the tone's border color is inert.
        tag: "rounded px-2 py-0.5",
        pill: "rounded-full border px-2 py-1",
      },
      uppercase: {
        true: "uppercase tracking-wider",
        false: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      shape: "tag",
      uppercase: false,
    },
  }
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a pulsing status dot (inherits the badge text color). */
  dot?: boolean;
}

export function Badge({
  tone,
  shape,
  uppercase,
  dot,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone, shape, uppercase }), className)}
      {...props}
    >
      {dot && (
        <span className="size-1.5 animate-pulse rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
