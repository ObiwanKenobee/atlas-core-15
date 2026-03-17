import { motion } from "framer-motion";
import type { HealthMetric, StressLevel } from "@/types/atlas";

const stressBorder: Record<StressLevel, string> = {
  stable: "border-l-stress-stable",
  emerging: "border-l-stress-emerging",
  critical: "border-l-stress-critical",
  systemic: "border-l-stress-systemic",
};

const stressText: Record<StressLevel, string> = {
  stable: "stress-stable",
  emerging: "stress-emerging",
  critical: "stress-critical",
  systemic: "stress-systemic",
};

function TrendChart({ data, status }: { data: number[]; status: StressLevel }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 48;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");

  const fillPoints = `0,${h} ${points} ${w},${h}`;

  const strokeColor = status === "stable" ? "hsl(var(--stress-stable))"
    : status === "emerging" ? "hsl(var(--stress-emerging))"
    : status === "critical" ? "hsl(var(--stress-critical))"
    : "hsl(var(--stress-systemic))";

  return (
    <svg width={w} height={h} className="w-full">
      <defs>
        <linearGradient id={`grad-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#grad-${status})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2" />
    </svg>
  );
}

export function HealthTrendCard({ metric, index = 0 }: { metric: HealthMetric; index?: number }) {
  const trendDelta = metric.trend.length >= 2 ? metric.trend[metric.trend.length - 1] - metric.trend[0] : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass-surface-solid border-l-4 ${stressBorder[metric.status]} rounded-lg p-5`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">{metric.label}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-display font-medium tabular-nums ${stressText[metric.status]}`}>{metric.value}</span>
            <span className="text-xs text-muted-foreground">{metric.unit}</span>
          </div>
        </div>
        <div className={`text-xs tabular-nums ${trendDelta > 0 ? "stress-critical" : "stress-stable"}`}>
          {trendDelta > 0 ? "+" : ""}{trendDelta.toFixed(1)} trend
        </div>
      </div>
      <TrendChart data={metric.trend} status={metric.status} />
    </motion.div>
  );
}
