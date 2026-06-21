import { notFound } from "next/navigation";

import { CampaignDetailView, getCampaignDetail } from "@/features/campaigns";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const campaign = getCampaignDetail(campaignId);

  if (!campaign) {
    notFound();
  }

  return <CampaignDetailView campaign={campaign} />;
}
