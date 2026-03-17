import { motion } from "framer-motion";
import { riskScores, anomalies, recommendations } from "@/data/mock-data";
import { RiskCard } from "@/components/atlas/RiskCard";
import { AnomalyRow } from "@/components/atlas/AnomalyRow";
import { RecommendationCard } from "@/components/atlas/RecommendationCard";
import { ShieldAlert, Zap, Lightbulb } from "lucide-react";

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div>
        <h2 className="text-sm font-display font-medium text-foreground">{title}</h2>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const topRisks = riskScores.filter(r => r.label === "critical" || r.label === "systemic");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Anomalies */}
      <section>
        <SectionHeader icon={Zap} title="Active Anomalies" subtitle="System-detected deviations requiring attention" />
        <div className="glass-surface-solid rounded-lg divide-y divide-white/[0.06]">
          {anomalies.map((a, i) => (
            <AnomalyRow key={a.id} anomaly={a} index={i} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top risks */}
        <section>
          <SectionHeader icon={ShieldAlert} title="Critical Risk Entities" subtitle="Entities requiring immediate intervention" />
          <div className="space-y-3">
            {topRisks.map((r, i) => (
              <RiskCard key={r.entityId} risk={r} index={i} />
            ))}
          </div>
        </section>

        {/* Top recommendations */}
        <section>
          <SectionHeader icon={Lightbulb} title="Priority Recommendations" subtitle="AI-generated interventions with ethical analysis" />
          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec, i) => (
              <RecommendationCard key={rec.id} rec={rec} index={i} />
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
