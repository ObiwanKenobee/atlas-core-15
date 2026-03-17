import { motion } from "framer-motion";
import { Network, Users, TrendingUp, Scale } from "lucide-react";
import { useState } from "react";

interface ManagerNode {
  id: string;
  name: string;
  role: string;
  span: number;
  burnoutCorrelation: number;
  successorCoverage: number;
  department: string;
}

interface EquityGap {
  cohort: string;
  promotionRate: number;
  avgTimeToPromotion: number;
  payRatio: number;
  representationByLevel: { level: string; pct: number }[];
}

const managers: ManagerNode[] = [
  { id: "m1", name: "A. Kimani", role: "Regional Director", span: 18, burnoutCorrelation: 0.82, successorCoverage: 0.3, department: "Operations" },
  { id: "m2", name: "B. Okonkwo", role: "Shift Supervisor", span: 16, burnoutCorrelation: 0.76, successorCoverage: 0.1, department: "Operations" },
  { id: "m3", name: "C. Mbeki", role: "Team Lead", span: 14, burnoutCorrelation: 0.68, successorCoverage: 0.5, department: "Engineering" },
  { id: "m4", name: "D. Achebe", role: "Unit Manager", span: 12, burnoutCorrelation: 0.55, successorCoverage: 0.7, department: "Support" },
  { id: "m5", name: "E. Mwangi", role: "Department Head", span: 9, burnoutCorrelation: 0.32, successorCoverage: 0.9, department: "Engineering" },
  { id: "m6", name: "F. Adeyemi", role: "Program Lead", span: 7, burnoutCorrelation: 0.21, successorCoverage: 1.0, department: "Strategy" },
];

const equityGaps: EquityGap[] = [
  {
    cohort: "Women",
    promotionRate: 6.2,
    avgTimeToPromotion: 4.1,
    payRatio: 0.91,
    representationByLevel: [
      { level: "Junior", pct: 52 }, { level: "Mid", pct: 44 }, { level: "Senior", pct: 31 }, { level: "Director+", pct: 18 },
    ],
  },
  {
    cohort: "Under-represented ethnic groups",
    promotionRate: 5.8,
    avgTimeToPromotion: 4.6,
    payRatio: 0.88,
    representationByLevel: [
      { level: "Junior", pct: 38 }, { level: "Mid", pct: 28 }, { level: "Senior", pct: 16 }, { level: "Director+", pct: 9 },
    ],
  },
  {
    cohort: "Age 50+",
    promotionRate: 3.1,
    avgTimeToPromotion: 6.2,
    payRatio: 1.05,
    representationByLevel: [
      { level: "Junior", pct: 8 }, { level: "Mid", pct: 22 }, { level: "Senior", pct: 34 }, { level: "Director+", pct: 41 },
    ],
  },
];

const leadershipConcentration = [
  { dept: "Operations", decisions: 340, nodes: 3, concentration: 0.92 },
  { dept: "Engineering", decisions: 280, nodes: 5, concentration: 0.71 },
  { dept: "Support", decisions: 180, nodes: 4, concentration: 0.65 },
  { dept: "Strategy", decisions: 120, nodes: 6, concentration: 0.48 },
];

export default function StructureEquityPage() {
  const [selectedCohort, setSelectedCohort] = useState(0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Network className="w-5 h-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-display font-medium">Structure & Equity</h1>
          <p className="text-xs text-muted-foreground">Hidden power geometries, structural resilience, and institutional equity analysis</p>
        </div>
      </div>

      {/* Span of Control Map */}
      <div className="glass-surface-solid rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Span of Control — Manager Overload Risk</h3>
        </div>
        <div className="space-y-2">
          {managers.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-4 p-3 rounded-lg border-l-4 ${
                m.span > 15 ? "border-l-stress-critical bg-stress-critical/5"
                  : m.span > 11 ? "border-l-stress-emerging bg-stress-emerging/5"
                  : "border-l-stress-stable"
              } hover:bg-accent/30 atlas-transition-fast`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-medium text-foreground">{m.name}</span>
                  <span className="text-[10px] text-muted-foreground">{m.role}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-display">{m.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="text-center">
                  <span className={`text-lg font-display tabular-nums ${m.span > 15 ? "stress-critical" : m.span > 11 ? "stress-emerging" : "stress-stable"}`}>
                    1:{m.span}
                  </span>
                  <span className="block text-[9px] text-muted-foreground font-display">SPAN</span>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-display tabular-nums ${m.burnoutCorrelation > 0.6 ? "stress-critical" : "stress-stable"}`}>
                    {(m.burnoutCorrelation * 100).toFixed(0)}%
                  </span>
                  <span className="block text-[9px] text-muted-foreground font-display">BURNOUT r²</span>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-display tabular-nums ${m.successorCoverage < 0.5 ? "stress-critical" : "stress-stable"}`}>
                    {(m.successorCoverage * 100).toFixed(0)}%
                  </span>
                  <span className="block text-[9px] text-muted-foreground font-display">SUCCESSOR</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promotion Equity Gaps */}
        <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-stress-emerging">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Promotion Equity Analysis</h3>
          </div>
          <div className="flex gap-2 mb-4">
            {equityGaps.map((g, i) => (
              <button
                key={g.cohort}
                onClick={() => setSelectedCohort(i)}
                className={`px-2 py-1 text-[10px] font-display rounded-md atlas-transition-fast ${
                  selectedCohort === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {g.cohort}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground font-display block">PROMOTION RATE</span>
                <span className="text-xl font-display tabular-nums text-foreground">{equityGaps[selectedCohort].promotionRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-display block">AVG TIME</span>
                <span className="text-xl font-display tabular-nums text-foreground">{equityGaps[selectedCohort].avgTimeToPromotion}yr</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-display block">PAY RATIO</span>
                <span className={`text-xl font-display tabular-nums ${equityGaps[selectedCohort].payRatio < 0.95 ? "stress-critical" : "stress-stable"}`}>
                  {equityGaps[selectedCohort].payRatio}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-display block mb-2">REPRESENTATION BY LEVEL</span>
              <div className="flex items-end gap-2 h-24">
                {equityGaps[selectedCohort].representationByLevel.map((l, i) => (
                  <div key={l.level} className="flex-1 flex flex-col items-center">
                    <span className="text-xs font-display tabular-nums text-foreground mb-1">{l.pct}%</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${l.pct}%` }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className={`w-full rounded-t-sm ${l.pct < 20 ? "bg-stress-critical" : l.pct < 35 ? "bg-stress-emerging" : "bg-stress-stable"}`}
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[9px] text-muted-foreground font-display mt-1">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Concentration */}
        <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-stress-systemic">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Decision Bottleneck Analysis</h3>
          </div>
          <div className="space-y-3">
            {leadershipConcentration.map((dept, i) => (
              <motion.div
                key={dept.dept}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-3 rounded-lg bg-accent/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display font-medium text-foreground">{dept.dept}</span>
                  <span className={`text-sm font-display tabular-nums ${dept.concentration > 0.8 ? "stress-critical" : dept.concentration > 0.6 ? "stress-emerging" : "stress-stable"}`}>
                    {(dept.concentration * 100).toFixed(0)}% concentrated
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.concentration * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className={`h-full rounded-full ${dept.concentration > 0.8 ? "bg-stress-critical" : dept.concentration > 0.6 ? "bg-stress-emerging" : "bg-stress-stable"}`}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span>{dept.decisions} decisions/quarter</span>
                  <span>{dept.nodes} decision nodes</span>
                  <span>{Math.round(dept.decisions / dept.nodes)} per node</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ⚠ Operations has critical decision concentration — 92% of decisions flow through 3 nodes.
              Single-point failure risk is elevated. Succession coverage is 30%.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
