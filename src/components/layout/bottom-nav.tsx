"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Lightbulb, Inbox } from "lucide-react";

import { useTenant } from "@/lib/tenant/context";
import { cn } from "@/lib/utils";

// The three primary destinations, thumb-reachable on phones. Secondary
// items (Settings, profile) live in the drawer.
const ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "" },
  { label: "Discovery", icon: Lightbulb, href: "/strategy" },
  { label: "Inbox", icon: Inbox, href: "/leads" },
];

export function BottomNav() {
  const { tenantId } = useTenant();
  const pathname = usePathname();
  const basePath = `/org/${tenantId}`;

  return (
    <nav className="flex h-16 shrink-0 items-stretch border-t border-border bg-card md:hidden">
      {ITEMS.map(({ label, icon: Icon, href }) => {
        const fullPath = `${basePath}${href}`;
        const isActive =
          href === "" ? pathname === basePath : pathname.startsWith(fullPath);

        return (
          <Link
            key={label}
            href={fullPath}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
