import { CampaignDetailView, buildDraftCampaign } from "@/features/campaigns";

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ icp?: string }>;
}) {
  const { icp } = await searchParams;
  const campaign = buildDraftCampaign(icp ?? "");

  return <CampaignDetailView campaign={campaign} />;
}
