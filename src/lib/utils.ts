import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Build avatar initials from a name, e.g. "Sarah Johnson" -> "SJ". */
export function getInitials(name: string, max = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}
