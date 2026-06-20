import { ShieldCheck, MailMinus, Gauge } from "lucide-react";

const GUARDRAILS = [
  {
    icon: MailMinus,
    title: "One-click opt-out",
    description: "Every send includes an unsubscribe link; opt-outs suppress instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Suppression list",
    description: "Existing customers and do-not-contact domains are filtered before sending.",
  },
  {
    icon: Gauge,
    title: "Send caps & throttling",
    description: "Daily per-mailbox limits protect your sending-domain reputation.",
  },
];

export function ComplianceGuardrails() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {GUARDRAILS.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="rounded-xl border border-border bg-muted/30 p-4"
        >
          <Icon className="mb-2 size-5 text-primary" />
          <p className="mb-1 text-sm font-bold text-foreground">{title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}
