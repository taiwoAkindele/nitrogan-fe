import { Mail, Linkedin, Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { PendingMessage, SequenceChannel } from "../types";


const CHANNEL_ICON: Record<SequenceChannel, typeof Mail> = {
  email: Mail,
  linkedin: Linkedin,
};

interface PendingReviewListProps {
  messages: PendingMessage[];
  onApprove: (id: string) => void;
  onSkip: (id: string) => void;
}

export function PendingReviewList({
  messages,
  onApprove,
  onSkip,
}: PendingReviewListProps) {
  if (messages.length === 0) {
    return (
      <EmptyState className="flex-col gap-2">
        <Check className="size-6 text-emerald-500" />
        <span>Queue clear — no messages waiting for review.</span>
      </EmptyState>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((message) => {
        const Icon = CHANNEL_ICON[message.channel];
        return (
          <li
            key={message.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {message.prospectName}
                  <span className="font-normal text-muted-foreground">
                    {" · "}
                    {message.prospectCompany}
                  </span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone="info" shape="pill">
                    <Icon className="size-3" />
                    Step {message.stepOrder}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onSkip(message.id)}
                  aria-label={`Skip message to ${message.prospectName}`}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(message.id)}
                  aria-label={`Approve message to ${message.prospectName}`}
                  className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Check className="size-4" />
                </button>
              </div>
            </div>
            {message.subject && (
              <p className="mb-1 text-sm font-medium text-foreground">
                {message.subject}
              </p>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {message.preview}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
