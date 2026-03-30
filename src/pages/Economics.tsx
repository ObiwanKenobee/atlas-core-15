import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Shield } from "lucide-react";
import { useState } from "react";

interface TeamEcon {
  id: string;
  name: string;
  headcount: number;
  laborCost: number;
  output: number;
  costPerEmployee: number;
  revenuePerEmployee: number;
  trainingROI: number;
  retentionSavings: number;
  burnoutCost: number;
}

const teamEconomics: TeamEcon[] = [
  { id: "t1", name: "Unit Alpha — Nairobi", headcount: 342, laborCost: 4200000, output: 8900000, costPerEmployee: 12280, revenuePerEmployee: 26023, trainingROI: 3.2, retentionSavings: 180000, burnoutCost: 420000 },
  { id: "t2", name: "Unit Bravo — Lagos", headcount: 289, laborCost: 3100000, output: 6200000, costPerEmployee: 10727, revenuePerEmployee: 21453, trainingROI: 2.8, retentionSavings: 145000, burnoutCost: 310000 },
  { id: "t3", name: "Operations — Central", headcount: 1240, laborCost: 18500000, output: 42000000, costPerEmployee: 14919, revenuePerEmployee: 33871, trainingROI: 4.1, retentionSavings: 920000, burnoutCost: 1850000 },
  { id: "t4", name: "Western Region", headcount: 890, laborCost: 10200000, output: 28500000, costPerEmployee: 11461, revenuePerEmployee: 32022, trainingROI: 3.8, retentionSavings: 510000, burnoutCost: 680000 },
  { id: "t5", name: "Unit Charlie — Mombasa", headcount: 198, laborCost: 2400000, output: 4100000, costPerEmployee: 12121, revenuePerEmployee: 20707, trainingROI: 1.9, retentionSavings: 98000, burnoutCost: 560000 },
];

const retentionScenarios = [
  { scenario: "Current trajectory", attritionRate: 14.2, annualCost: 2840000, productivityLoss: 8.2 },
  { scenario: "+10% compensation", attritionRate: 10.1, annualCost: 2020000, productivityLoss: 5.1 },
  { scenario: "+Mental health program", attritionRate: 11.8, annualCost: 2360000, productivityLoss: 6.4 },
  { scenario: "+Manager ratio fix", attritionRate: 9.4, annualCost: 1880000, productivityLoss: 4.2 },
  { scenario: "Combined intervention", attritionRate: 6.8, annualCost: 1360000, productivityLoss: 2.1 },
];

const costComposition = [
  { category: "Base Salary", pct: 58, amount: 22300000 },
  { category: "Benefits", pct: 18, amount: 6900000 },
  { category: "Training", pct: 6, amount: 2300000 },
  { category: "Overtime", pct: 8, amount: 3100000 },
  { category: "Turnover Cost", pct: 7, amount: 2700000 },
  { category: "Mental Health", pct: 3, amount: 1200000 },
];

function formatCurrency(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

export default function EconomicsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const maxOutput = Math.max(...teamEconomics.map(t => t.revenuePerEmployee));
  const maxCost = Math.max(...teamEconomics.map(t => t.costPerEmployee));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="w-5 h-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-display font-medium">Economics</h1>
          <p className="text-xs text-muted-foreground">Labor cost, value density, and forward efficiency — every metric paired with human cost</p>
        </div>
      </div>

      {/* Global cost summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Labor Cost", value: formatCurrency(38400000), delta: "+3.2%", status: "emerging" },
          { label: "Revenue per Employee", value: "$29,880", delta: "-2.1%", status: "emerging" },
          { label: "Training ROI", value: "3.4x", delta: "+0.3x", status: "stable" },
          { label: "Turnover Cost", value: formatCurrency(2840000), delta: "+18%", status: "critical" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-surface-solid rounded-lg p-4"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">{m.label}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display tabular-nums text-foreground">{m.value}</span>
              <span className={`text-[10px] font-display tabular-nums stress-${m.status}`}>{m.delta}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cost composition bar */}
      <div className="glass-surface-solid rounded-lg p-5">
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-4">Cost Composition</h3>
        <div className="flex h-8 rounded-md overflow-hidden mb-3">
          {costComposition.map((c, i) => {
            const colors = ["bg-primary", "bg-stress-stable", "bg-simulation", "bg-stress-emerging", "bg-stress-critical", "bg-stress-systemic"];
            return (
              <motion.div
                key={c.category}
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`${colors[i]} flex items-center justify-center`}
                title={`${c.category}: ${c.pct}%`}
              >
                {c.pct > 6 && <span className="text-[9px] font-display text-primary-foreground truncate px-1">{c.pct}%</span>}
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          {costComposition.map((c, i) => {
            const colors = ["text-primary", "stress-stable", "text-simulation", "stress-emerging", "stress-critical", "stress-systemic"];
            return (
              <span key={c.category} className="flex items-center gap-1 text-[10px] text-muted-foreground font-display">
                <span className={`${colors[i]} font-medium`}>●</span> {c.category} ({formatCurrency(c.amount)})
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Value Density scatter */}
        <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Team Value Density — Cost vs Output</h3>
          </div>
          <div className="relative h-64 border border-white/[0.06] rounded-md p-4">
            {/* Y axis label */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-muted-foreground font-display">Revenue/Employee</span>
            {/* X axis label */}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-display">Cost/Employee</span>

            {teamEconomics.map((t, i) => {
              const x = (t.costPerEmployee / maxCost) * 80 + 10;
              const y = 90 - (t.revenuePerEmployee / maxOutput) * 80;
              const size = Math.max(16, Math.min(40, t.headcount / 20));
              const efficiency = t.revenuePerEmployee / t.costPerEmployee;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  onClick={() => setSelectedTeam(selectedTeam === t.id ? null : t.id)}
                  className={`absolute rounded-full cursor-pointer atlas-transition-fast flex items-center justify-center ${
                    efficiency > 2.5 ? "bg-stress-stable/40 border border-stress-stable/60" :
                    efficiency > 2.0 ? "bg-stress-emerging/40 border border-stress-emerging/60" :
                    "bg-stress-critical/40 border border-stress-critical/60"
                  } ${selectedTeam === t.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    transform: "translate(-50%, -50%)",
                  }}
                  title={`${t.name}\nCost: ${formatCurrency(t.costPerEmployee)}/emp\nRev: ${formatCurrency(t.revenuePerEmployee)}/emp`}
                />
              );
            })}
            {/* Diagonal efficiency line */}
            <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none">
              <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3">
            {teamEconomics.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTeam(selectedTeam === t.id ? null : t.id)}
                className={`text-[10px] font-display px-2 py-1 rounded atlas-transition-fast ${
                  selectedTeam === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.name.split("—")[0].trim()}
              </button>
            ))}
          </div>
          {/* Selected team detail */}
          {selectedTeam && (() => {
            const t = teamEconomics.find(x => x.id === selectedTeam);
            if (!t) return null;
            return (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-lg bg-accent/30">
                <span className="text-xs font-display font-medium text-foreground">{t.name}</span>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div>
                    <span className="text-[9px] text-muted-foreground font-display block">COST/EMP</span>
                    <span className="text-sm font-display tabular-nums">{formatCurrency(t.costPerEmployee)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-display block">REV/EMP</span>
                    <span className="text-sm font-display tabular-nums">{formatCurrency(t.revenuePerEmployee)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-display block">TRAINING ROI</span>
                    <span className="text-sm font-display tabular-nums">{t.trainingROI}x</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span>Retention savings: <span className="stress-stable">{formatCurrency(t.retentionSavings)}</span></span>
                    <span>Burnout cost: <span className="stress-critical">{formatCurrency(t.burnoutCost)}</span></span>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Retention savings scenarios */}
        <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-simulation">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Retention Savings Scenarios</h3>
          </div>
          <div className="space-y-3">
            {retentionScenarios.map((s, i) => {
              const isBaseline = i === 0;
              const savings = isBaseline ? 0 : retentionScenarios[0].annualCost - s.annualCost;
              return (
                <motion.div
                  key={s.scenario}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`p-3 rounded-lg ${isBaseline ? "bg-stress-critical/10 border border-stress-critical/20" : "bg-accent/20"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-display font-medium ${isBaseline ? "stress-critical" : "text-foreground"}`}>
                      {s.scenario}
                    </span>
                    {!isBaseline && savings > 0 && (
                      <span className="text-[10px] font-display stress-stable">
                        Save {formatCurrency(savings)}/yr
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[9px] text-muted-foreground font-display block">ATTRITION</span>
                      <span className={`text-sm font-display tabular-nums ${s.attritionRate > 12 ? "stress-critical" : s.attritionRate > 8 ? "stress-emerging" : "stress-stable"}`}>
                        {s.attritionRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground font-display block">ANNUAL COST</span>
                      <span className="text-sm font-display tabular-nums text-foreground">{formatCurrency(s.annualCost)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground font-display block">PROD. LOSS</span>
                      <span className={`text-sm font-display tabular-nums ${s.productivityLoss > 6 ? "stress-critical" : "stress-emerging"}`}>
                        {s.productivityLoss}%
                      </span>
                    </div>
                  </div>
                  {/* Cost bar */}
                  <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.annualCost / retentionScenarios[0].annualCost) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                      className={`h-full rounded-full ${isBaseline ? "bg-stress-critical" : "bg-simulation"}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ⚠ Combined intervention reduces attrition cost by <span className="stress-stable font-medium">{formatCurrency(1480000)}/yr</span> but requires
              <span className="stress-emerging font-medium"> $890K</span> upfront investment.
              Projected breakeven: <span className="text-foreground font-medium">7.2 months</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Ethical cost lens */}
      <div className="glass-surface-solid rounded-lg p-5 border border-stress-systemic/20">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 stress-systemic" />
          <h3 className="text-[10px] uppercase tracking-wider stress-systemic font-display">Ethical Cost Lens</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded bg-accent/20">
            <span className="text-xs font-display font-medium text-foreground">Cost Reduction ≠ Free</span>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Reducing staffing cost by 8% increases predicted burnout by 19% and patient risk by 11%.
            </p>
          </div>
          <div className="p-3 rounded bg-accent/20">
            <span className="text-xs font-display font-medium text-foreground">Hidden Labor Costs</span>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Overtime spend masks 340 unreported hours/month. True labor cost is 12% higher than reported.
            </p>
          </div>
          <div className="p-3 rounded bg-accent/20">
            <span className="text-xs font-display font-medium text-foreground">Burnout → Revenue Loss</span>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Each burnout point above 60 correlates with $42K/yr revenue loss per affected team.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
