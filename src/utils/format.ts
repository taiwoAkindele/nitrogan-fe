import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat().format(num);
}

export function formatPercent(num: number) {
  return new Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: 1,
  }).format(num / 100);
}
