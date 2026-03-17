import { motion } from "framer-motion";
import { healthMetrics } from "@/data/mock-data";
import { HealthTrendCard } from "@/components/atlas/HealthTrendCard";
import { HeartPulse } from "lucide-react";

export default function HealthPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <HeartPulse className="w-5 h-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-display font-medium">Workforce Health & Sentiment</h1>
          <p className="text-xs text-muted-foreground">Early-warning telemetry for human condition across the system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMetrics.map((m, i) => (
          <HealthTrendCard key={m.id} metric={m} index={i} />
        ))}
      </div>

      {/* Qualitative insights */}
      <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-stress-emerging">
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">Qualitative Signal Summary</h3>
        <div className="space-y-3 text-xs text-secondary-foreground">
          <div className="flex gap-3">
            <span className="text-muted-foreground flex-shrink-0 w-20 font-display">Theme 1</span>
            <p>"Shift schedules are unsustainable" — recurring in 34% of frontline feedback across Nairobi and Lagos facilities.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-foreground flex-shrink-0 w-20 font-display">Theme 2</span>
            <p>"No growth path visible" — promotion stagnation mentioned by 28% of mid-level staff in quarterly surveys.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-foreground flex-shrink-0 w-20 font-display">Theme 3</span>
            <p>"Manager is overwhelmed" — direct reports of overloaded managers show 2.3x higher burnout indicators.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
