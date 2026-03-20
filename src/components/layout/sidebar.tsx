"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Lightbulb,
  BarChart3,
  Settings,
  Rocket,
} from "lucide-react";
import { useTenant } from "@/lib/tenant/context";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "" },
  { label: "Sales Inbox", icon: Inbox, href: "/leads" },
  { label: "Prospects", icon: Users, href: "/workspace" },
  { label: "Intelligence", icon: Lightbulb, href: "/strategy" },
  { label: "Reports", icon: BarChart3, href: "/integrations" },
];

export function Sidebar() {
  const { tenantId } = useTenant();
  const pathname = usePathname();
  const basePath = `/org/${tenantId}`;

  return (
    <div className="flex h-full w-full flex-col bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Rocket className="size-4" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Nitrogan</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const fullPath = `${basePath}${href}`;
          const isActive =
            href === ""
              ? pathname === basePath
              : pathname.startsWith(fullPath);

          return (
            <Link
              key={label}
              href={fullPath}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? "border-l-2 border-primary bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Alex Rivera</p>
            <p className="truncate text-xs text-muted-foreground">
              Enterprise Sales
            </p>
          </div>
          <Settings className="size-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
