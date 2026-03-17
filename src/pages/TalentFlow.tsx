import { motion } from "framer-motion";
import { GitBranch, Filter } from "lucide-react";
import { useState } from "react";

type FlowView = "volume" | "velocity" | "dropoff" | "equity";

interface FlowStage {
  id: string;
  label: string;
  value: number;
  color: string;
  dropoff: number;
  avgDays: number;
  equityGap: number;
}

const flowStages: FlowStage[] = [
  { id: "pipeline", label: "Pipeline", value: 2840, color: "hsl(var(--stress-stable))", dropoff: 0, avgDays: 0, equityGap: 0.05 },
  { id: "screening", label: "Screening", value: 1920, color: "hsl(var(--stress-stable))", dropoff: 32.4, avgDays: 8, equityGap: 0.08 },
  { id: "interview", label: "Interview", value: 980, color: "hsl(var(--stress-emerging))", dropoff: 49.0, avgDays: 21, equityGap: 0.12 },
  { id: "offer", label: "Offer", value: 420, color: "hsl(var(--stress-emerging))", dropoff: 57.1, avgDays: 7, equityGap: 0.06 },
  { id: "onboarding", label: "Onboarding", value: 380, color: "hsl(var(--stress-stable))", dropoff: 9.5, avgDays: 30, equityGap: 0.04 },
  { id: "active", label: "Active", value: 12847, color: "hsl(var(--primary))", dropoff: 0, avgDays: 0, equityGap: 0.18 },
  { id: "promotion", label: "Promoted", value: 890, color: "hsl(var(--stress-stable))", dropoff: 0, avgDays: 365, equityGap: 0.22 },
  { id: "exit", label: "Exit", value: 1420, color: "hsl(var(--stress-critical))", dropoff: 0, avgDays: 0, equityGap: 0.15 },
];

const exitReasons = [
  { reason: "Voluntary — Better opportunity", pct: 34, count: 483 },
  { reason: "Voluntary — Burnout", pct: 22, count: 312 },
  { reason: "Voluntary — Relocation", pct: 12, count: 170 },
  { reason: "Involuntary — Performance", pct: 15, count: 213 },
  { reason: "Involuntary — Restructuring", pct: 10, count: 142 },
  { reason: "Retirement", pct: 7, count: 100 },
];

const mobilityPaths = [
  { from: "Engineering", to: "Management", count: 45, direction: "up" as const },
  { from: "Operations", to: "Engineering", count: 28, direction: "lateral" as const },
  { from: "Support", to: "Operations", count: 34, direction: "lateral" as const },
  { from: "Management", to: "Executive", count: 12, direction: "up" as const },
  { from: "Support", to: "Exit", count: 89, direction: "out" as const },
  { from: "Operations", to: "Exit", count: 67, direction: "out" as const },
];

function SankeyFlow({ stages }: { stages: FlowStage[] }) {
  const maxVal = Math.max(...stages.map(s => s.value));

  return (
    <div className="relative">
      <div className="flex items-end gap-1 h-48">
        {stages.map((stage, i) => {
          const height = (stage.value / maxVal) * 100;
          return (
            <div key={stage.id} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-display tabular-nums text-foreground">{stage.value.toLocaleString()}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full rounded-t-sm relative overflow-hidden"
                style={{ backgroundColor: stage.color }}
              >
                {/* Flow connector */}
                {i < stages.length - 1 && i !== 4 && (
                  <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-white/20" />
                )}
              </motion.div>
              <span className="text-[9px] font-display text-muted-foreground uppercase tracking-wider text-center">{stage.label}</span>
            </div>
          );
        })}
      </div>
      {/* Flow arrows */}
      <svg className="absolute inset-0 pointer-events-none" style={{ top: 0, height: "100%" }}>
        {stages.slice(0, -1).map((_, i) => {
          if (i === 4) return null; // gap between onboarding → active
          const x1 = ((i + 0.5) / stages.length) * 100;
          const x2 = ((i + 1.5) / stages.length) * 100;
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1="40%"
              x2={`${x2}%`}
              y2="40%"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function TalentFlowPage() {
  const [view, setView] = useState<FlowView>("volume");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-muted-foreground" />
          <div>
            <h1 className="text-lg font-display font-medium">Talent Flow</h1>
            <p className="text-xs text-muted-foreground">Organizational fluid mechanics — capacity movement across the system</p>
          </div>
        </div>
        <div className="flex gap-1">
          {(["volume", "velocity", "dropoff", "equity"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-[10px] font-display uppercase tracking-wider rounded-md atlas-transition-fast
                ${view === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sankey-style flow */}
      <div className="glass-surface-solid rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
            Hiring → Onboarding → Active → Promotion / Exit
          </h3>
          <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground atlas-transition-fast font-display">
            <Filter className="w-3 h-3" /> Show only friction points
          </button>
        </div>
        <SankeyFlow stages={flowStages} />

        {/* View-specific metrics */}
        {view === "dropoff" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-4 border-t border-white/[0.06]">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">Drop-off Analysis</h4>
            <div className="grid grid-cols-4 gap-3">
              {flowStages.filter(s => s.dropoff > 0).map(s => (
                <div key={s.id} className="text-center">
                  <span className={`text-xl font-display tabular-nums ${s.dropoff > 40 ? "stress-critical" : s.dropoff > 20 ? "stress-emerging" : "stress-stable"}`}>
                    {s.dropoff}%
                  </span>
                  <span className="block text-[10px] text-muted-foreground font-display mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === "velocity" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-4 border-t border-white/[0.06]">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">Stage Velocity (Avg Days)</h4>
            <div className="grid grid-cols-4 gap-3">
              {flowStages.filter(s => s.avgDays > 0).map(s => (
                <div key={s.id} className="text-center">
                  <span className="text-xl font-display tabular-nums text-foreground">{s.avgDays}</span>
                  <span className="text-xs text-muted-foreground ml-1">days</span>
                  <span className="block text-[10px] text-muted-foreground font-display mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === "equity" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-4 border-t border-white/[0.06]">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">Equity Gap by Stage (σ deviation)</h4>
            <div className="grid grid-cols-4 gap-3">
              {flowStages.map(s => (
                <div key={s.id} className="text-center">
                  <span className={`text-xl font-display tabular-nums ${s.equityGap > 0.15 ? "stress-critical" : s.equityGap > 0.08 ? "stress-emerging" : "stress-stable"}`}>
                    {s.equityGap}σ
                  </span>
                  <span className="block text-[10px] text-muted-foreground font-display mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exit Pathway Analysis */}
        <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-stress-critical">
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-4">Exit Pathway Analysis</h3>
          <div className="space-y-2">
            {exitReasons.map((r, i) => (
              <motion.div
                key={r.reason}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-secondary-foreground">{r.reason}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{r.count}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      className="h-full bg-stress-critical/60 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-sm font-display tabular-nums stress-critical w-10 text-right">{r.pct}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Internal Mobility Paths */}
        <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-stress-stable">
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-4">Internal Mobility Paths</h3>
          <div className="space-y-2">
            {mobilityPaths.map((p, i) => (
              <motion.div
                key={`${p.from}-${p.to}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2 rounded hover:bg-accent/30 atlas-transition-fast"
              >
                <span className="text-xs font-display text-secondary-foreground w-24">{p.from}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-display ${
                  p.direction === "up" ? "bg-stress-stable/10 stress-stable"
                    : p.direction === "out" ? "bg-stress-critical/10 stress-critical"
                    : "bg-stress-emerging/10 stress-emerging"
                }`}>
                  {p.direction === "up" ? "↑" : p.direction === "out" ? "→ exit" : "↔"}
                </span>
                <span className="text-xs font-display text-secondary-foreground w-24">{p.to}</span>
                <span className="text-sm font-display tabular-nums text-foreground ml-auto">{p.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
