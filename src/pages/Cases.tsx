import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, ChevronRight, Clock, CheckCircle, AlertTriangle, FileText, X } from "lucide-react";
import { useState } from "react";

type CaseStatus = "open" | "investigating" | "resolved" | "monitoring";
type CasePriority = "low" | "medium" | "high" | "critical";

interface CaseItem {
  id: string;
  title: string;
  summary: string;
  status: CaseStatus;
  priority: CasePriority;
  owner: string;
  created: string;
  affectedEntities: string[];
  evidenceCount: number;
  simulationsRun: number;
  decisions: Decision[];
  outcome?: string;
}

interface Decision {
  date: string;
  action: string;
  rationale: string;
  owner: string;
}

const statusConfig: Record<CaseStatus, { label: string; class: string; icon: React.ElementType }> = {
  open: { label: "Open", class: "bg-stress-emerging/10 stress-emerging", icon: AlertTriangle },
  investigating: { label: "Investigating", class: "bg-primary/10 text-primary", icon: Clock },
  resolved: { label: "Resolved", class: "bg-stress-stable/10 stress-stable", icon: CheckCircle },
  monitoring: { label: "Monitoring", class: "bg-stress-systemic/10 stress-systemic", icon: Clock },
};

const priorityBorder: Record<CasePriority, string> = {
  low: "border-l-stress-stable",
  medium: "border-l-stress-emerging",
  high: "border-l-stress-critical",
  critical: "border-l-stress-systemic",
};

const mockCases: CaseItem[] = [
  {
    id: "CASE-001",
    title: "Regional Nurse Burnout Escalation — Nakuru",
    summary: "Systemic burnout detected across 3 facilities. Absenteeism spike of 2.3σ above baseline correlating with manager overload and shift strain.",
    status: "investigating",
    priority: "critical",
    owner: "Dr. A. Kimani",
    created: "2026-03-05",
    affectedEntities: ["Unit Alpha — Nairobi", "Nakuru Central Facility", "Nakuru East Clinic"],
    evidenceCount: 12,
    simulationsRun: 3,
    decisions: [
      { date: "2026-03-08", action: "Initiated deep-dive analysis", rationale: "Burnout index exceeded threshold for 14 consecutive days", owner: "Dr. A. Kimani" },
      { date: "2026-03-12", action: "Requested emergency hiring approval", rationale: "Simulation S-041 shows 15% attrition reduction with 5 additional positions", owner: "B. Okonkwo" },
    ],
    outcome: undefined,
  },
  {
    id: "CASE-002",
    title: "Promotion Stagnation — Lagos Operations",
    summary: "Zero promotions over 2 quarters in Lagos unit. Sentiment decline and internal mobility freeze detected.",
    status: "open",
    priority: "high",
    owner: "C. Mbeki",
    created: "2026-03-10",
    affectedEntities: ["Unit Bravo — Lagos"],
    evidenceCount: 6,
    simulationsRun: 1,
    decisions: [],
    outcome: undefined,
  },
  {
    id: "CASE-003",
    title: "Leadership Vacancy Cascade — Mombasa",
    summary: "Unit Charlie leadership vacancy triggering cascade failure. Fragility score surged to 91 with critical skill attrition.",
    status: "monitoring",
    priority: "critical",
    owner: "D. Achebe",
    created: "2026-02-20",
    affectedEntities: ["Unit Charlie — Mombasa", "Unit Alpha — Nairobi"],
    evidenceCount: 18,
    simulationsRun: 5,
    decisions: [
      { date: "2026-02-25", action: "Appointed interim team lead", rationale: "Immediate stabilization required", owner: "D. Achebe" },
      { date: "2026-03-01", action: "Initiated accelerated succession program", rationale: "0% successor coverage at Unit Charlie", owner: "E. Mwangi" },
      { date: "2026-03-10", action: "Cross-trained 4 staff from Unit Alpha", rationale: "Reduce cascade risk between units", owner: "D. Achebe" },
    ],
    outcome: "Fragility stabilized at 78 (down from 91). Monitoring for 30 days.",
  },
];

export default function CasesPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const activeCase = mockCases.find(c => c.id === selectedCase);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-muted-foreground" />
          <div>
            <h1 className="text-lg font-display font-medium">Cases & Investigations</h1>
            <p className="text-xs text-muted-foreground">From observation to tracked operational case — decision workflow platform</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-display uppercase tracking-wider bg-primary text-primary-foreground rounded-md hover:bg-primary/80 atlas-transition-fast"
        >
          <Plus className="w-3 h-3" /> New Case
        </button>
      </div>

      {/* Create case form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-simulation/50 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-medium text-simulation">Create New Case</h3>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Title</label>
                <input className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Case title..." />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Priority</label>
                <select className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Summary</label>
                <textarea className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none" placeholder="Describe the issue..." />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 text-xs font-display uppercase tracking-wider bg-simulation text-simulation-foreground rounded-md hover:bg-simulation/80 atlas-transition-fast">
              Create Case
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Case list */}
        <div className={`space-y-3 ${activeCase ? "w-1/2" : "w-full"} transition-all`}>
          {mockCases.map((c, i) => {
            const sc = statusConfig[c.status];
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedCase(selectedCase === c.id ? null : c.id)}
                className={`glass-surface-solid border-l-4 ${priorityBorder[c.priority]} rounded-lg p-4 cursor-pointer hover:bg-accent/30 atlas-transition-fast ${
                  selectedCase === c.id ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-display text-muted-foreground tabular-nums">{c.id}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-display flex items-center gap-1 ${sc.class}`}>
                        <StatusIcon className="w-3 h-3" />{sc.label}
                      </span>
                    </div>
                    <h3 className="text-xs font-display font-medium text-foreground mb-1">{c.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{c.summary}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground ml-2 transition-transform ${selectedCase === c.id ? "rotate-90" : ""}`} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                  <span>Owner: {c.owner}</span>
                  <span>{c.evidenceCount} evidence items</span>
                  <span>{c.simulationsRun} simulations</span>
                  <span>{c.decisions.length} decisions</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Case detail drawer */}
        <AnimatePresence>
          {activeCase && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "50%" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass-surface-solid rounded-lg p-5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-display text-muted-foreground tabular-nums">{activeCase.id}</span>
                <button onClick={() => setSelectedCase(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-sm font-display font-medium text-foreground mb-2">{activeCase.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{activeCase.summary}</p>

              {/* Affected entities */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">Affected Entities</h4>
                <div className="flex flex-wrap gap-1">
                  {activeCase.affectedEntities.map(e => (
                    <span key={e} className="text-[10px] px-2 py-1 rounded bg-muted text-secondary-foreground font-display">{e}</span>
                  ))}
                </div>
              </div>

              {/* Decision log */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">
                  <FileText className="w-3 h-3 inline mr-1" /> Decision Log
                </h4>
                {activeCase.decisions.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground italic">No decisions recorded. Awaiting investigation.</p>
                ) : (
                  <div className="space-y-2">
                    {activeCase.decisions.map((d, i) => (
                      <div key={i} className="p-2 rounded bg-accent/20 border-l-2 border-l-primary/40">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground font-display tabular-nums">{d.date}</span>
                          <span className="text-[10px] text-muted-foreground">{d.owner}</span>
                        </div>
                        <p className="text-xs text-foreground font-medium">{d.action}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{d.rationale}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outcome */}
              {activeCase.outcome && (
                <div className="p-3 rounded-lg bg-stress-stable/10 border border-stress-stable/20">
                  <h4 className="text-[10px] uppercase tracking-wider stress-stable font-display mb-1">Outcome</h4>
                  <p className="text-xs text-secondary-foreground">{activeCase.outcome}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider bg-muted text-muted-foreground rounded-md hover:text-foreground atlas-transition-fast">
                  Add Evidence
                </button>
                <button className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider bg-muted text-muted-foreground rounded-md hover:text-foreground atlas-transition-fast">
                  Log Decision
                </button>
                <button className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider bg-simulation/20 text-simulation rounded-md hover:bg-simulation/30 atlas-transition-fast">
                  Run Simulation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
