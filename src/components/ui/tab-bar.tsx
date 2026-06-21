"use client";

import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabBarProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /**
   * `segmented` — equal-width tabs filling the bar (e.g. inbox status tabs).
   * `underline` — left-aligned tabs with count pills (e.g. dashboard filters).
   */
  variant?: "segmented" | "underline";
  className?: string;
}

export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  variant = "underline",
  className,
}: TabBarProps<T>) {
  if (variant === "segmented") {
    return (
      <div className={cn("flex border-b border-border", className)}>
        {tabs.map((tab) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                "flex-1 border-b-2 py-4 text-xs font-bold transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.count ? ` (${tab.count})` : ""}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-8 overflow-x-auto border-b border-border",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex items-center gap-2 border-b-2 pb-4 text-sm font-bold transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
