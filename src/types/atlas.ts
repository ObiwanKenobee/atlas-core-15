export type StressLevel = "stable" | "emerging" | "critical" | "systemic";
export type Urgency = "low" | "medium" | "high" | "critical";
export type TrendDirection = "up" | "down" | "flat";

export interface RiskScore {
  entityId: string;
  entityName: string;
  entityType: "team" | "department" | "region" | "facility";
  score: number;
  label: StressLevel;
  confidence: number;
  drivers: Array<{
    name: string;
    contribution: number;
    direction: TrendDirection;
  }>;
  trend: {
    previous: number;
    current: number;
    delta: number;
    windowDays: number;
  };
}

export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
  deltaDirection: TrendDirection;
  status: StressLevel;
  sparkline?: number[];
}

export interface Recommendation {
  id: string;
  title: string;
  summary: string;
  urgency: Urgency;
  predictedImpact: {
    attritionDelta?: number;
    burnoutDelta?: number;
    productivityDelta?: number;
    costDelta?: number;
  };
  ethicalImpact: {
    burdenShift: string[];
    vulnerableGroups: string[];
    fairnessChange: number;
  };
  evidenceRefs: string[];
  confidence: number;
  linkedScenarioId?: string;
}

export interface SimulationVariable {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  variables: SimulationVariable[];
  outputs: {
    timeHorizonDays: number;
    projectedRisk: number;
    projectedCost: number;
    projectedBurnout: number;
    projectedEquity: number;
  };
  confidenceBands: {
    low: number;
    mid: number;
    high: number;
  };
}

export interface Anomaly {
  id: string;
  title: string;
  severity: StressLevel;
  timestamp: string;
  affectedEntity: string;
  description: string;
}

export interface HealthMetric {
  id: string;
  label: string;
  value: number;
  trend: number[];
  status: StressLevel;
  unit: string;
}
