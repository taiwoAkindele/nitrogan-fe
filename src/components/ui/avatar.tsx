import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, getInitials } from "@/lib/utils";

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-bold",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-20 text-3xl",
      },
      shape: {
        square: "rounded",
        rounded: "rounded-lg",
        xl: "rounded-xl",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "rounded",
    },
  }
);

interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** Explicit initials to render. Falls back to deriving them from `name`. */
  initials?: string;
  /** Source name used to derive initials when `initials` is not provided. */
  name?: string;
}

export function Avatar({
  initials,
  name,
  size,
  shape,
  className,
  ...props
}: AvatarProps) {
  const text = initials ?? getInitials(name ?? "", 1);

  return (
    <span
      data-slot="avatar"
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      {text}
    </span>
  );
}

export { avatarVariants };
