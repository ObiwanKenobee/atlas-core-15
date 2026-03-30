import { motion } from "framer-motion";
import { recommendations } from "@/data/mock-data";
import { RecommendationCard } from "@/components/atlas/RecommendationCard";
import { Lightbulb } from "lucide-react";
import { useRole } from "@/hooks/useRole";

export default function RecommendationsPage() {
  const { role } = useRole();

  // Scope recommendations by role
  const scopedRecs = role === "executive"
    ? recommendations.filter(r => r.urgency === "critical" || r.urgency === "high")
    : role === "operator"
    ? recommendations.filter(r => r.urgency !== "low")
    : recommendations;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Lightbulb className="w-5 h-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-display font-medium">Intervention Recommendations</h1>
          <p className="text-xs text-muted-foreground">
            {role === "executive" ? "High-priority recommendations requiring executive attention" :
             role === "operator" ? "Operational recommendations for your teams" :
             "AI-generated guidance with ethical tradeoff analysis"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-display uppercase tracking-wider text-muted-foreground">
        <span>Rules enforced:</span>
        <span className="px-2 py-1 rounded bg-muted">No score without explanation</span>
        <span className="px-2 py-1 rounded bg-muted">No recommendation without tradeoffs</span>
        <span className="px-2 py-1 rounded bg-muted">No simulation without confidence</span>
      </div>

      <div className="space-y-4">
        {scopedRecs.map((rec, i) => (
          <RecommendationCard key={rec.id} rec={rec} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
