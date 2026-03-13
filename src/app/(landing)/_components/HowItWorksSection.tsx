import { Radar, Brain, Zap } from "lucide-react";

const steps = [
  {
    icon: Radar,
    title: "Capture Market Signals",
    description:
      "We monitor millions of real-time data points across the web, from hiring trends to tech stack shifts.",
  },
  {
    icon: Brain,
    title: "AI Transformation",
    description:
      "Our engine filters and categorizes raw data, matching it against your specific ICP and buyer personas.",
  },
  {
    icon: Zap,
    title: "Actionable Leads",
    description:
      "Receive high-intent, verified leads directly into your CRM with pre-written outreach context.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How Nitrogan Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our proprietary engine moves at the speed of the market, turning noise into signals and
            signals into revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary transition-all duration-300">
                <Icon className="text-primary group-hover:text-primary-foreground size-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
