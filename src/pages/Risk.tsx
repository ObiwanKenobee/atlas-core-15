import { motion } from "framer-motion";
import { riskScores } from "@/data/mock-data";
import { RiskCard } from "@/components/atlas/RiskCard";
import { ShieldAlert } from "lucide-react";

export default function RiskPage() {
  const sorted = [...riskScores].sort((a, b) => b.score - a.score);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-display font-medium">Workforce Risk Intelligence</h1>
          <p className="text-xs text-muted-foreground">Failure probability, causal drivers, and cascade analysis across all entities</p>
        </div>
      </div>

      {/* Risk heatmap summary */}
      <div className="glass-surface-solid rounded-lg p-5">
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-4">Risk Distribution</h3>
        <div className="flex items-end gap-1 h-16">
          {sorted.map((r, i) => (
            <motion.div
              key={r.entityId}
              initial={{ height: 0 }}
              animate={{ height: `${(r.score / 100) * 100}%` }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className={`flex-1 rounded-t-sm ${
                r.label === "systemic" ? "bg-stress-systemic" :
                r.label === "critical" ? "bg-stress-critical" :
                r.label === "emerging" ? "bg-stress-emerging" : "bg-stress-stable"
              }`}
              title={`${r.entityName}: ${r.score}`}
            />
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {sorted.map(r => (
            <div key={r.entityId} className="flex-1 text-center">
              <span className="text-[9px] text-muted-foreground font-display truncate block">{r.entityName.split("—")[0].trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full risk list */}
      <div className="space-y-3">
        {sorted.map((r, i) => (
          <RiskCard key={r.entityId} risk={r} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
