import { TenantProvider } from "@/lib/tenant/context";
import { Sidebar } from "@/components/layout";
import { Topbar } from "@/components/layout";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  return (
    <TenantProvider tenantId={tenantId}>
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 border-r border-border">
          <Sidebar />
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="h-14 shrink-0 border-b border-border bg-card">
            <Topbar />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </TenantProvider>
  );
}
