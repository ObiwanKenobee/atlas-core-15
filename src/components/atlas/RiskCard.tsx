import { motion } from "framer-motion";
import type { RiskScore, StressLevel } from "@/types/atlas";
import { ChevronRight, Info } from "lucide-react";
import { useState } from "react";

const stressBorderClasses: Record<StressLevel, string> = {
  stable: "border-l-stress-stable",
  emerging: "border-l-stress-emerging",
  critical: "border-l-stress-critical",
  systemic: "border-l-stress-systemic",
};

const stressBgClasses: Record<StressLevel, string> = {
  stable: "bg-stress-stable/10",
  emerging: "bg-stress-emerging/10",
  critical: "bg-stress-critical/10",
  systemic: "bg-stress-systemic/10",
};

const stressTextClasses: Record<StressLevel, string> = {
  stable: "stress-stable",
  emerging: "stress-emerging",
  critical: "stress-critical",
  systemic: "stress-systemic",
};

export function RiskCard({ risk, index = 0 }: { risk: RiskScore; index?: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ scale: 1.005 }}
      className={`glass-surface-solid border-l-4 ${stressBorderClasses[risk.label]} rounded-lg overflow-hidden cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-display">{risk.entityType}</span>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-display ${stressBgClasses[risk.label]} ${stressTextClasses[risk.label]}`}>
                {risk.label}
              </span>
            </div>
            <h3 className="font-display text-sm font-medium text-foreground">{risk.entityName}</h3>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-display font-medium tabular-nums ${stressTextClasses[risk.label]}`}>
              {risk.score}
            </div>
            <div className="text-xs text-muted-foreground tabular-nums">
              {risk.trend.delta > 0 ? "+" : ""}{risk.trend.delta} / {risk.trend.windowDays}d
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-muted px-2 py-1 rounded text-muted-foreground hover:text-foreground atlas-transition-fast font-display">
            <Info className="w-3 h-3" />
            Why this changed
          </button>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            Confidence: {Math.round(risk.confidence * 100)}%
          </span>
          <ChevronRight className={`w-3 h-3 text-muted-foreground ml-auto transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">Top Drivers</h4>
          <div className="space-y-2">
            {risk.drivers.map((driver) => (
              <div key={driver.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-secondary-foreground">{driver.name}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{driver.contribution}%</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${driver.contribution}%` }}
                      transition={{ delay: 0.2, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                      className={`h-full rounded-full ${driver.direction === "up" ? "bg-stress-critical/60" : driver.direction === "down" ? "bg-stress-emerging/60" : "bg-muted-foreground/40"}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Trajectory:</span>
            <span className="tabular-nums">{risk.trend.previous}</span>
            <span className="text-muted-foreground">→</span>
            <span className={`tabular-nums font-medium ${stressTextClasses[risk.label]}`}>{risk.trend.current}</span>
            <span className="text-muted-foreground">over {risk.trend.windowDays} days</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
