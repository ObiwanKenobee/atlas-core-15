import { motion } from "framer-motion";
import type { Anomaly, StressLevel } from "@/types/atlas";
import { Zap } from "lucide-react";

const severityDot: Record<StressLevel, string> = {
  stable: "bg-stress-stable",
  emerging: "bg-stress-emerging",
  critical: "bg-stress-critical",
  systemic: "bg-stress-systemic",
};

export function AnomalyRow({ anomaly, index = 0 }: { anomaly: Anomaly; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 atlas-transition-fast cursor-pointer group"
    >
      <div className="mt-1 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full ${severityDot[anomaly.severity]} animate-pulse-glow`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Zap className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-display font-medium text-foreground truncate">{anomaly.title}</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{anomaly.description}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
          <span>{anomaly.timestamp}</span>
          <span>•</span>
          <span>{anomaly.affectedEntity}</span>
        </div>
      </div>
    </motion.div>
  );
}
