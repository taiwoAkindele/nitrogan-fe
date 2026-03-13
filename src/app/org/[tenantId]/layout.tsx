import { TenantProvider } from "@/lib/tenant/context";

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
      <div className="flex min-h-screen">
        {/* Sidebar placeholder */}
        <aside className="w-64 border-r" />
        <div className="flex-1">
          {/* Topbar placeholder */}
          <header className="h-14 border-b" />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </TenantProvider>
  );
}
