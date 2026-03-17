import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import type { SimulationVariable } from "@/types/atlas";
import { FlaskConical, RotateCcw, Save } from "lucide-react";

function computeOutputs(vars: SimulationVariable[]) {
  const get = (key: string) => vars.find(v => v.key === key)?.value ?? 0;
  const hiring = get("hiring_rate");
  const shift = get("shift_reduction");
  const manager = get("manager_ratio");
  const training = get("training_investment");
  const mental = get("mental_health");
  const comp = get("compensation");

  const riskReduction = hiring * 0.3 + shift * 2 + manager * 0.25 + training * 0.1 + mental * 0.15 + comp * 0.2;
  const costIncrease = hiring * 0.4 + shift * 1.5 + manager * 0.15 + training * 0.3 + mental * 0.2 + comp * 0.8;
  const burnoutReduction = shift * 4 + manager * 0.3 + mental * 0.25 + comp * 0.1;
  const equityGain = manager * 0.2 + training * 0.15 + mental * 0.1 - comp * 0.05;

  return {
    projectedRisk: Math.max(0, Math.min(100, 68 - riskReduction)),
    projectedCost: Math.round(costIncrease * 10) / 10,
    projectedBurnout: Math.max(0, Math.min(100, 67 - burnoutReduction)),
    projectedEquity: Math.round(equityGain * 100) / 100,
  };
}

export function SimulationPanel({ initialVariables }: { initialVariables: SimulationVariable[] }) {
  const [variables, setVariables] = useState<SimulationVariable[]>(initialVariables);
  const isActive = variables.some(v => v.value !== 0);
  const outputs = useMemo(() => computeOutputs(variables), [variables]);

  const updateVar = (key: string, value: number) => {
    setVariables(prev => prev.map(v => v.key === key ? { ...v, value } : v));
  };

  const reset = () => setVariables(initialVariables.map(v => ({ ...v, value: 0 })));

  return (
    <div className={`space-y-6 ${isActive ? "simulation-active" : ""}`}>
      {/* Mode indicator */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-simulation/10 border border-dashed border-simulation/30"
        >
          <FlaskConical className="w-4 h-4 text-simulation" />
          <span className="text-xs font-display text-simulation uppercase tracking-wider">Simulation Mode Active</span>
        </motion.div>
      )}

      {/* Variable controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variables.map((v) => (
          <div key={v.key} className="glass-surface-solid rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-display text-secondary-foreground">{v.label}</span>
              <span className={`text-sm font-display tabular-nums ${v.value !== 0 ? "text-simulation" : "text-muted-foreground"}`}>
                {v.value > 0 ? "+" : ""}{v.value}{v.unit}
              </span>
            </div>
            <input
              type="range"
              min={v.min}
              max={v.max}
              step={v.step}
              value={v.value}
              onChange={(e) => updateVar(v.key, parseFloat(e.target.value))}
              className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-atlas-sm"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tabular-nums">
              <span>{v.min}{v.unit}</span>
              <span>{v.max}{v.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Impact preview */}
      <div className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-simulation/50">
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-4">System Impact Preview — 90 Day Projection</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ImpactMetric label="Projected Risk" value={outputs.projectedRisk} baseline={68} unit="/100" inverse />
          <ImpactMetric label="Cost Impact" value={outputs.projectedCost} baseline={0} unit="%" />
          <ImpactMetric label="Projected Burnout" value={outputs.projectedBurnout} baseline={67} unit="/100" inverse />
          <ImpactMetric label="Equity Gain" value={outputs.projectedEquity} baseline={0} unit="σ" />
        </div>
      </div>

      {/* Ethical tradeoff */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-surface-solid rounded-lg p-5 border-l-4 border-l-stress-emerging"
        >
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">Ethical Tradeoff Analysis</h3>
          <div className="space-y-2 text-xs text-secondary-foreground">
            {outputs.projectedCost > 5 && (
              <p>⚠ Cost increase of {outputs.projectedCost}% may require budget reallocation from other programs.</p>
            )}
            {outputs.projectedBurnout < 50 && (
              <p>✓ Burnout projected below critical threshold. Frontline staff benefit most.</p>
            )}
            {outputs.projectedEquity > 0.1 && (
              <p>✓ Equity improvement detected. Underserved cohorts gain proportionally more.</p>
            )}
            {outputs.projectedEquity < 0 && (
              <p>⚠ Equity regression detected. Compensation changes disproportionately affect junior staff.</p>
            )}
            {outputs.projectedCost <= 5 && outputs.projectedBurnout >= 50 && outputs.projectedEquity >= 0 && outputs.projectedEquity <= 0.1 && (
              <p className="text-muted-foreground">Adjust variables to see projected ethical tradeoffs.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 text-xs font-display uppercase tracking-wider bg-muted text-muted-foreground rounded-md hover:text-foreground atlas-transition-fast"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-xs font-display uppercase tracking-wider bg-primary text-primary-foreground rounded-md hover:bg-primary/80 atlas-transition-fast">
          <Save className="w-3 h-3" />
          Save Scenario
        </button>
      </div>
    </div>
  );
}

function ImpactMetric({ label, value, baseline, unit, inverse }: { label: string; value: number; baseline: number; unit: string; inverse?: boolean }) {
  const delta = value - baseline;
  const improved = inverse ? delta < 0 : delta > 0;
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">{label}</span>
      <span className="text-xl font-display font-medium tabular-nums text-foreground">{typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}</span>
      <span className="text-xs text-muted-foreground ml-1">{unit}</span>
      {delta !== 0 && (
        <div className={`text-xs tabular-nums mt-0.5 ${improved ? "stress-stable" : "stress-critical"}`}>
          {delta > 0 ? "+" : ""}{typeof delta === "number" ? (Number.isInteger(delta) ? delta : delta.toFixed(1)) : delta}{unit}
        </div>
      )}
    </div>
  );
}
