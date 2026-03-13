import { Radio, UserSearch, Lightbulb, RefreshCw, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Market Signals",
    description:
      "Real-time monitoring of funding rounds, C-suite changes, and new project launches within your target accounts.",
  },
  {
    icon: UserSearch,
    title: "Lead Discovery",
    description:
      "Hyper-accurate contact data matching for the exact stakeholders making purchasing decisions today.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Insights",
    description:
      "Go beyond the 'who' and 'where' to the 'why'. Get the context needed to craft the perfect cold outreach message.",
  },
  {
    icon: RefreshCw,
    title: "CRM Integration",
    description:
      "Native integrations with Salesforce, HubSpot, and Outreach to keep your workflow seamless and fast.",
  },
  {
    icon: Shield,
    title: "Data Privacy",
    description:
      "Fully GDPR and CCPA compliant data sourcing. We prioritize accuracy and ethics in every data point.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Scoring",
    description:
      "AI-driven propensity scores that tell you which accounts are most likely to convert in the next 30 days.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-12 mb-16 items-end justify-between">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            Everything you need to dominate your market
          </h2>
          <p className="text-lg text-muted-foreground">
            Nitrogan combines enterprise-grade data with intuitive automation to give your sales team
            an unfair advantage.
          </p>
        </div>
        <button className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-bold transition-colors">
          Explore All Features
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
          >
            <Icon className="text-primary mb-6 size-10" />
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
