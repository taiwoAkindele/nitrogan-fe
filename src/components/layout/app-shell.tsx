"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";

// The responsive app shell:
//  - large (≥lg): full sidebar, except the inbox (collapses to a rail for room)
//  - medium (md–lg): 64px icon rail
//  - small (<md): sidebar hidden → off-canvas drawer + bottom tab bar
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  // The inbox is a focus-heavy 3-pane view; collapse the sidebar to a rail at
  // lg so the prospect detail gets the reclaimed width.
  const pathname = usePathname();
  const collapsed = pathname.includes("/leads");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Persistent sidebar: rail at md, full at lg (rail on the inbox), hidden on small */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border transition-[width] duration-200 md:block md:w-16",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute left-0 top-0 h-full w-64 border-r border-border shadow-xl">
            <Sidebar expanded onNavigate={closeDrawer} />
          </div>
        </div>
      )}

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="h-14 shrink-0 border-b border-border bg-card">
          <Topbar onMenuClick={() => setDrawerOpen(true)} />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
