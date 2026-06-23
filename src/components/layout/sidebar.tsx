"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Lightbulb,
  Settings,
  Rocket,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace/context";
import { useSession, useLogout } from "@/features/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

// Ordered by the product loop: Discover → Review → Act.
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "" },
  { label: "Discovery", icon: Lightbulb, href: "/strategy" },
  { label: "Sales Inbox", icon: Inbox, href: "/leads" },
];

interface SidebarProps {
  /** Force the full icon+label layout regardless of breakpoint (mobile drawer). */
  expanded?: boolean;
  /** Force the 64px icon rail at every breakpoint (focus mode, e.g. the inbox). */
  collapsed?: boolean;
  /** Called when a nav link is followed — used to close the mobile drawer. */
  onNavigate?: () => void;
}

// Display modes:
//  - mobile drawer (`expanded`): full icon + label at any width
//  - focus rail (`collapsed`): 64px icon rail at any width
//  - default: 64px rail at md, full icon + label at lg
export function Sidebar({ expanded, collapsed, onNavigate }: SidebarProps) {
  const { slug } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/org/${slug}`;

  const { data: user } = useSession();
  const logout = useLogout();

  const settingsPath = `${basePath}/settings`;

  const go = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  const handleLogout = () => {
    onNavigate?.();
    logout();
    router.push("/sign-in");
  };

  // `expanded` always wins; `collapsed` forces the rail; otherwise responsive.
  const label = expanded ? "inline" : collapsed ? "hidden" : "hidden lg:inline";
  const meta = expanded ? "block" : collapsed ? "hidden" : "hidden lg:block";
  const center = expanded
    ? ""
    : collapsed
      ? "justify-center"
      : "justify-center lg:justify-start";
  const padLogo = expanded ? "p-6" : collapsed ? "p-4" : "p-4 lg:p-6";
  const padNav = expanded ? "px-3" : collapsed ? "px-2" : "px-2 lg:px-3";
  const padFooter = expanded ? "p-4" : collapsed ? "p-2" : "p-2 lg:p-4";
  const footerDir = expanded ? "" : collapsed ? "flex-col" : "flex-col lg:flex-row";

  return (
    <div className="flex h-full w-full flex-col bg-card">
      {/* Logo */}
      <div className={cn("flex items-center gap-3", center, padLogo)}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Rocket className="size-4" />
        </div>
        <h2 className={cn("text-xl font-bold tracking-tight", meta)}>Nitrogan</h2>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1", padNav)}>
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

      {/* User Profile + account menu (logout lives here) */}
      <div className={cn("border-t border-border", padFooter)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted",
              center,
              footerDir,
            )}
          >
            <Avatar
              initials={getInitials(user?.name ?? "") || "?"}
              size="sm"
              shape="circle"
              className="bg-muted text-muted-foreground"
            />
            <div className={cn("min-w-0 flex-1", meta)}>
              <p className="truncate text-sm font-medium">
                {user?.name ?? "Account"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            {user && (
              <div className="truncate px-1.5 py-1 text-xs font-medium text-muted-foreground">
                {user.email}
              </div>
            )}
            <DropdownMenuItem onClick={() => go(settingsPath)}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                go(`/change-password?next=${encodeURIComponent(settingsPath)}`)
              }
            >
              <KeyRound className="size-4" />
              Change password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
