"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Lightbulb,
  Settings,
  Rocket,
} from "lucide-react";
import { useTenant } from "@/lib/tenant/context";
import { cn } from "@/lib/utils";

// Ordered by the product loop: Discover → Review → Act.
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "" },
  { label: "Discovery", icon: Lightbulb, href: "/strategy" },
  { label: "Sales Inbox", icon: Inbox, href: "/leads" },
];

interface SidebarProps {
  /** Force the full icon+label layout regardless of breakpoint (mobile drawer). */
  expanded?: boolean;
  /** Called when a nav link is followed — used to close the mobile drawer. */
  onNavigate?: () => void;
}

// Three display modes:
//  - persistent, large (≥lg): full icon + label
//  - persistent, medium (md–lg): 64px icon rail (labels hidden)
//  - mobile drawer (`expanded`): full icon + label at any width
export function Sidebar({ expanded, onNavigate }: SidebarProps) {
  const { tenantId } = useTenant();
  const pathname = usePathname();
  const basePath = `/org/${tenantId}`;

  // When not expanded, labels/text appear only at lg; below that it's a rail.
  const label = expanded ? "inline" : "hidden lg:inline";
  const meta = expanded ? "block" : "hidden lg:block";
  const center = expanded ? "" : "justify-center lg:justify-start";

  return (
    <div className="flex h-full w-full flex-col bg-card">
      {/* Logo */}
      <div className={cn("flex items-center gap-3", center, expanded ? "p-6" : "p-4 lg:p-6")}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Rocket className="size-4" />
        </div>
        <h2 className={cn("text-xl font-bold tracking-tight", meta)}>Nitrogan</h2>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1", expanded ? "px-3" : "px-2 lg:px-3")}>
        {NAV_ITEMS.map(({ label: text, icon: Icon, href }) => {
          const fullPath = `${basePath}${href}`;
          const isActive =
            href === ""
              ? pathname === basePath
              : pathname.startsWith(fullPath);

          return (
            <Link
              key={text}
              href={fullPath}
              onClick={onNavigate}
              title={text}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                center,
                isActive
                  ? "border-l-2 border-primary bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className={cn("text-sm font-medium", label)}>{text}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={cn("border-t border-border", expanded ? "p-4" : "p-2 lg:p-4")}>
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-2",
            expanded ? "" : "flex-col lg:flex-row"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
            A
          </div>
          <div className={cn("min-w-0 flex-1", meta)}>
            <p className="truncate text-sm font-medium">Alex Rivera</p>
            <p className="truncate text-xs text-muted-foreground">
              Enterprise Sales
            </p>
          </div>
          <Link
            href={`${basePath}/settings`}
            onClick={onNavigate}
            aria-label="Settings"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
