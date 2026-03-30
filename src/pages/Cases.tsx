import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, ChevronRight, Clock, CheckCircle, AlertTriangle, FileText, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCases } from "@/hooks/useCases";
import { toast } from "@/hooks/use-toast";

type CaseStatus = "open" | "investigating" | "resolved" | "monitoring";
type CasePriority = "low" | "medium" | "high" | "critical";

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

export default function CasesPage() {
  const { cases, loading, createCase, addDecision } = useCases();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [creating, setCreating] = useState(false);

  // Decision form
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [decAction, setDecAction] = useState("");
  const [decRationale, setDecRationale] = useState("");
  const [decOwner, setDecOwner] = useState("");

  const activeCase = cases.find(c => c.id === selectedCase);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await createCase(newTitle, newSummary, newPriority);
      setNewTitle(""); setNewSummary(""); setNewPriority("medium");
      setShowCreate(false);
      toast({ title: "Case created" });
    } catch {
      toast({ title: "Error creating case", variant: "destructive" });
    }
    setCreating(false);
  };

  const handleAddDecision = async () => {
    if (!activeCase || !decAction.trim()) return;
    try {
      await addDecision(activeCase.id, decAction, decRationale, decOwner);
      setDecAction(""); setDecRationale(""); setDecOwner("");
      setShowDecisionForm(false);
      toast({ title: "Decision logged" });
    } catch {
      toast({ title: "Error logging decision", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* Create form */}
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
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Case title..." />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Priority</label>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Summary</label>
                <textarea value={newSummary} onChange={e => setNewSummary(e.target.value)} className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none" placeholder="Describe the issue..." />
              </div>
            </div>
            <button onClick={handleCreate} disabled={creating} className="mt-4 px-4 py-2 text-xs font-display uppercase tracking-wider bg-simulation text-simulation-foreground rounded-md hover:bg-simulation/80 atlas-transition-fast disabled:opacity-50">
              {creating ? "Creating..." : "Create Case"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {cases.length === 0 && !showCreate && (
        <div className="glass-surface-solid rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">No cases yet. Create your first case to begin tracking.</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Case list */}
        <div className={`space-y-3 ${activeCase ? "w-1/2" : "w-full"} transition-all`}>
          {cases.map((c, i) => {
            const sc = statusConfig[(c.status as CaseStatus) || "open"];
            const StatusIcon = sc?.icon || AlertTriangle;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedCase(selectedCase === c.id ? null : c.id)}
                className={`glass-surface-solid border-l-4 ${priorityBorder[(c.priority as CasePriority) || "medium"]} rounded-lg p-4 cursor-pointer hover:bg-accent/30 atlas-transition-fast ${selectedCase === c.id ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-display text-muted-foreground tabular-nums">{c.case_number}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-display flex items-center gap-1 ${sc?.class || ""}`}>
                        <StatusIcon className="w-3 h-3" />{sc?.label || c.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-display font-medium text-foreground mb-1">{c.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{c.summary}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground ml-2 transition-transform ${selectedCase === c.id ? "rotate-90" : ""}`} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                  <span>Owner: {c.owner || "Unassigned"}</span>
                  <span>{c.evidence_count || 0} evidence</span>
                  <span>{c.simulations_run || 0} simulations</span>
                  <span>{c.decisions.length} decisions</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail drawer */}
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
                <span className="text-[10px] font-display text-muted-foreground tabular-nums">{activeCase.case_number}</span>
                <button onClick={() => setSelectedCase(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>

              <h2 className="text-sm font-display font-medium text-foreground mb-2">{activeCase.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{activeCase.summary}</p>

              {activeCase.affected_entities && activeCase.affected_entities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">Affected Entities</h4>
                  <div className="flex flex-wrap gap-1">
                    {activeCase.affected_entities.map(e => (
                      <span key={e} className="text-[10px] px-2 py-1 rounded bg-muted text-secondary-foreground font-display">{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision log */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">
                  <FileText className="w-3 h-3 inline mr-1" /> Decision Log
                </h4>
                {activeCase.decisions.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground italic">No decisions recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {activeCase.decisions.map((d) => (
                      <div key={d.id} className="p-2 rounded bg-accent/20 border-l-2 border-l-primary/40">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground font-display tabular-nums">{d.decided_at?.split("T")[0]}</span>
                          <span className="text-[10px] text-muted-foreground">{d.decision_owner}</span>
                        </div>
                        <p className="text-xs text-foreground font-medium">{d.action}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{d.rationale}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add decision form */}
              <AnimatePresence>
                {showDecisionForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 p-3 rounded bg-accent/10 border border-white/[0.06] space-y-2 overflow-hidden">
                    <input value={decAction} onChange={e => setDecAction(e.target.value)} className="w-full bg-muted border border-white/[0.08] rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground" placeholder="Decision action..." />
                    <input value={decRationale} onChange={e => setDecRationale(e.target.value)} className="w-full bg-muted border border-white/[0.08] rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground" placeholder="Rationale..." />
                    <input value={decOwner} onChange={e => setDecOwner(e.target.value)} className="w-full bg-muted border border-white/[0.08] rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground" placeholder="Decision owner..." />
                    <button onClick={handleAddDecision} className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider bg-primary text-primary-foreground rounded-md">Log Decision</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeCase.outcome && (
                <div className="p-3 rounded-lg bg-stress-stable/10 border border-stress-stable/20 mb-4">
                  <h4 className="text-[10px] uppercase tracking-wider stress-stable font-display mb-1">Outcome</h4>
                  <p className="text-xs text-secondary-foreground">{activeCase.outcome}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => setShowDecisionForm(!showDecisionForm)} className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider bg-muted text-muted-foreground rounded-md hover:text-foreground atlas-transition-fast">
                  Log Decision
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
