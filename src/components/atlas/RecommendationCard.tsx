import { motion } from "framer-motion";
import type { Recommendation, Urgency } from "@/types/atlas";
import { AlertTriangle, ArrowRight, Shield, FlaskConical } from "lucide-react";
import { useState } from "react";

const urgencyClasses: Record<Urgency, { border: string; badge: string; text: string }> = {
  low: { border: "border-l-stress-stable", badge: "bg-stress-stable/10 stress-stable", text: "stress-stable" },
  medium: { border: "border-l-stress-emerging", badge: "bg-stress-emerging/10 stress-emerging", text: "stress-emerging" },
  high: { border: "border-l-stress-critical", badge: "bg-stress-critical/10 stress-critical", text: "stress-critical" },
  critical: { border: "border-l-stress-systemic", badge: "bg-stress-systemic/10 stress-systemic", text: "stress-systemic" },
};

function DeltaPill({ value, label }: { value?: number; label: string }) {
  if (value === undefined) return null;
  const isPositive = label === "cost" ? value > 0 : value < 0;
  return (
    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${isPositive ? "bg-stress-critical/10 stress-critical" : "bg-stress-stable/10 stress-stable"}`}>
      <span className="tabular-nums font-display">{value > 0 ? "+" : ""}{value}%</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function RecommendationCard({ rec, index = 0 }: { rec: Recommendation; index?: number }) {
  const [showEthics, setShowEthics] = useState(false);
  const uc = urgencyClasses[rec.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass-surface-solid border-l-4 ${uc.border} rounded-lg p-5`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${uc.text}`} />
          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-display ${uc.badge}`}>{rec.urgency}</span>
          <span className="text-[10px] text-muted-foreground tabular-nums font-display">Confidence: {Math.round(rec.confidence * 100)}%</span>
        </div>
      </div>

      <h3 className="font-display text-sm font-medium text-foreground mb-1">{rec.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.summary}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <DeltaPill value={rec.predictedImpact.attritionDelta} label="attrition" />
        <DeltaPill value={rec.predictedImpact.burnoutDelta} label="burnout" />
        <DeltaPill value={rec.predictedImpact.productivityDelta} label="productivity" />
        <DeltaPill value={rec.predictedImpact.costDelta} label="cost" />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEthics(!showEthics)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-muted px-2 py-1 rounded text-muted-foreground hover:text-foreground atlas-transition-fast font-display"
        >
          <Shield className="w-3 h-3" />
          Ethical impact
        </button>
        {rec.linkedScenarioId && (
          <button className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-muted px-2 py-1 rounded text-simulation hover:bg-accent atlas-transition-fast font-display">
            <FlaskConical className="w-3 h-3" />
            View simulation
          </button>
        )}
        <button className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary/80 atlas-transition-fast font-display">
          Evidence <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {showEthics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-white/[0.06]"
        >
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">Ethical Tradeoff Analysis</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Burden shifts to:</span>
              <ul className="mt-1 space-y-0.5">
                {rec.ethicalImpact.burdenShift.map((b, i) => (
                  <li key={i} className="text-secondary-foreground">• {b}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-muted-foreground">Vulnerable groups:</span>
              <ul className="mt-1 space-y-0.5">
                {rec.ethicalImpact.vulnerableGroups.map((g, i) => (
                  <li key={i} className="stress-emerging">• {g}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-muted-foreground">Fairness change: </span>
            <span className={`tabular-nums ${rec.ethicalImpact.fairnessChange >= 0 ? "stress-stable" : "stress-critical"}`}>
              {rec.ethicalImpact.fairnessChange >= 0 ? "+" : ""}{rec.ethicalImpact.fairnessChange}σ
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
