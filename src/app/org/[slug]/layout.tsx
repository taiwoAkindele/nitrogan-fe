import { WorkspaceProvider } from "@/lib/workspace/context";
import { AppShell } from "@/components/layout";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <WorkspaceProvider slug={slug}>
      <AppShell>{children}</AppShell>
    </WorkspaceProvider>
  );
}
