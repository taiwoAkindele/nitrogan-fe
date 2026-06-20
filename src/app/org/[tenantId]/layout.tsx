import { TenantProvider } from "@/lib/tenant/context";
import { AppShell } from "@/components/layout";

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
      <AppShell>{children}</AppShell>
    </TenantProvider>
  );
}
