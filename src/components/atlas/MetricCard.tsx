import { motion } from "framer-motion";
import type { KPIMetric, StressLevel } from "@/types/atlas";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const stressClasses: Record<StressLevel, string> = {
  stable: "border-l-stress-stable",
  emerging: "border-l-stress-emerging",
  critical: "border-l-stress-critical",
  systemic: "border-l-stress-systemic",
};

const stressDotClasses: Record<StressLevel, string> = {
  stable: "bg-stress-stable",
  emerging: "bg-stress-emerging",
  critical: "bg-stress-critical",
  systemic: "bg-stress-systemic",
};

function MiniSparkline({ data, status }: { data: number[]; status: StressLevel }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  const strokeColor = status === "stable" ? "hsl(var(--stress-stable))"
    : status === "emerging" ? "hsl(var(--stress-emerging))"
    : status === "critical" ? "hsl(var(--stress-critical))"
    : "hsl(var(--stress-systemic))";

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="1.5" />
    </svg>
  );
}

export function MetricCard({ metric, index = 0 }: { metric: KPIMetric; index?: number }) {
  const TrendIcon = metric.deltaDirection === "up" ? TrendingUp : metric.deltaDirection === "down" ? TrendingDown : Minus;
  const isNegative = (metric.deltaDirection === "up" && ["attrition", "burnout", "fragility", "absenteeism", "equity"].some(k => metric.id.includes(k)))
    || (metric.deltaDirection === "down" && ["productivity", "mobility", "headcount"].some(k => metric.id.includes(k)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass-surface-solid border-l-4 ${stressClasses[metric.status]} p-4 rounded-lg hover:bg-accent/30 atlas-transition-fast cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">{metric.label}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${stressDotClasses[metric.status]} animate-pulse-glow`} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-display font-medium tabular-nums" data-metric>
            {typeof metric.value === "number" && metric.value > 999 ? metric.value.toLocaleString() : metric.value}
          </span>
          <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>
        </div>
        {metric.sparkline && <MiniSparkline data={metric.sparkline} status={metric.status} />}
      </div>
      <div className={`flex items-center gap-1 mt-2 text-xs ${isNegative ? "stress-critical" : "stress-stable"}`}>
        <TrendIcon className="w-3 h-3" />
        <span className="tabular-nums">{metric.delta > 0 ? "+" : ""}{metric.delta}{metric.unit === "%" || metric.unit === "σ" ? metric.unit : ""}</span>
        <span className="text-muted-foreground ml-1">vs 30d</span>
      </div>
    </motion.div>
  );
}
