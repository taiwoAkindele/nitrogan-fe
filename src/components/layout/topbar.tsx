"use client";

import Link from "next/link";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant } from "@/lib/tenant/context";

interface TopbarProps {
  /** Opens the mobile nav drawer; rendered only below md. */
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { tenantId } = useTenant();

  return (
    <div className="flex h-full w-full items-center gap-3 px-4 md:px-6">
      {/* Mobile menu trigger */}
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          <Menu className="size-5" />
        </button>
      )}

      {/* Search — fills on mobile, fixed width on md+ (matches original) */}
      <div className="relative min-w-0 flex-1 md:w-96 md:flex-none">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search prospects, companies, or signals..."
          className="h-9 bg-muted pl-10 text-sm"
        />
      </div>

      {/* Actions — pushed to the far right on md+ */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
        </Button>
        <Link href={`/org/${tenantId}/strategy`}>
          <Button size="sm" className="gap-2 font-bold">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Discovery</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
