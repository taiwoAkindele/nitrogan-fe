"use client";

import Link from "next/link";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant } from "@/lib/tenant/context";

export function Topbar() {
  const { tenantId } = useTenant();

  return (
    <div className="flex h-full w-full items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search prospects, companies, or signals..."
          className="h-9 bg-muted pl-10 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
        </Button>
        <Link href={`/org/${tenantId}/strategy`}>
          <Button size="sm" className="gap-2 font-bold">
            <Plus className="size-4" />
            New Discovery
          </Button>
        </Link>
      </div>
    </div>
  );
}
