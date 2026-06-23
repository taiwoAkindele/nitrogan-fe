import type { ProspectDetail as MockDetail, Signal } from "../types";
import type { ProspectDetail as ApiDetail, ProspectListItem } from "../types/api";

// Deterministic avatar tint so a company keeps the same colour across renders.
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function avatarColor(seed: string): string {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initial(name: string): string {
  return (name.trim()[0] ?? "?").toUpperCase();
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

/** API list item → the mock `ProspectDetail` the inbox UI renders (no children). */
export function toListProspect(p: ProspectListItem): MockDetail {
  return {
    id: p.id,
    companyName: p.companyName,
    companyInitial: initial(p.companyName),
    avatarColor: avatarColor(p.id),
    industry: p.industry,
    employeeRange: p.employeeRange,
    intentLabel: p.intentLabel,
    signalCount: 0,
    signalSummary: p.description,
    timestamp: relativeTime(p.createdAt),
    status: p.status,
    description: p.description,
    location: p.location,
    websiteUrl: p.websiteUrl,
    employeeCount: p.employeeCount,
    intentScore: p.intentScore,
    signals: [],
    personas: [],
    firmographics: [],
    feedback: undefined,
  };
}

/** API detail → the mock `ProspectDetail`, including signals/personas/firmographics. */
export function toFullProspect(p: ApiDetail): MockDetail {
  return {
    ...toListProspect(p),
    signalCount: p.signals.length,
    signals: p.signals.map(
      (s): Signal => ({
        id: s.id,
        type: s.type as Signal["type"],
        title: s.title,
        description: s.description,
        scoreContribution: s.scoreContribution,
        outreachAngle: s.outreachAngle,
      }),
    ),
    personas: p.personas,
    firmographics: p.firmographics.map((f) => ({
      label: f.label,
      value: f.value,
      highlight: f.highlight,
    })),
    feedback: p.feedback ?? undefined,
  };
}
