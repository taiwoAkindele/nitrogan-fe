import { Mail } from "lucide-react";
import type { Persona } from "../types";

interface PersonaListProps {
  personas: Persona[];
}

export function PersonaList({ personas }: PersonaListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Key Personas
      </h3>
      <div className="space-y-4">
        {personas.map((persona) => (
          <div key={persona.id} className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
              {persona.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{persona.name}</p>
              <p className="text-xs text-muted-foreground">{persona.role}</p>
            </div>
            <Mail className="size-4 text-muted-foreground" />
          </div>
        ))}
        <button className="w-full rounded-lg border border-primary/20 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5">
          View All {personas.length} Contacts
        </button>
      </div>
    </div>
  );
}
