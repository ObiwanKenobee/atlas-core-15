import type { KPIMetric, RiskScore, Recommendation, Anomaly, HealthMetric, SimulationVariable } from "@/types/atlas";

export const globalKPIs: KPIMetric[] = [
  { id: "headcount", label: "Total Headcount", value: 12847, unit: "", delta: -2.1, deltaDirection: "down", status: "stable", sparkline: [12900, 12880, 12870, 12860, 12850, 12847] },
  { id: "attrition", label: "Attrition Risk", value: 14.2, unit: "%", delta: 3.8, deltaDirection: "up", status: "critical", sparkline: [10, 11, 11.5, 12, 13, 14.2] },
  { id: "burnout", label: "Burnout Index", value: 67, unit: "/100", delta: 8, deltaDirection: "up", status: "emerging", sparkline: [55, 58, 60, 62, 65, 67] },
  { id: "fragility", label: "Team Fragility", value: 31, unit: "%", delta: 5.2, deltaDirection: "up", status: "emerging", sparkline: [22, 24, 26, 28, 30, 31] },
  { id: "productivity", label: "Productivity", value: 82, unit: "%", delta: -4.1, deltaDirection: "down", status: "stable", sparkline: [88, 87, 86, 85, 83, 82] },
  { id: "absenteeism", label: "Absenteeism", value: 6.8, unit: "%", delta: 1.9, deltaDirection: "up", status: "emerging", sparkline: [4.2, 4.8, 5.1, 5.8, 6.2, 6.8] },
  { id: "mobility", label: "Internal Mobility", value: 4.1, unit: "%", delta: -1.2, deltaDirection: "down", status: "stable", sparkline: [5.5, 5.2, 4.8, 4.5, 4.3, 4.1] },
  { id: "equity", label: "Equity Deviation", value: 0.18, unit: "σ", delta: 0.04, deltaDirection: "up", status: "stable", sparkline: [0.12, 0.13, 0.14, 0.15, 0.16, 0.18] },
];

export const riskScores: RiskScore[] = [
  {
    entityId: "team-alpha",
    entityName: "Unit Alpha — Nairobi",
    entityType: "team",
    score: 84,
    label: "critical",
    confidence: 0.87,
    drivers: [
      { name: "Absenteeism spike", contribution: 34, direction: "up" },
      { name: "Manager overload", contribution: 28, direction: "up" },
      { name: "Low internal mobility", contribution: 22, direction: "down" },
      { name: "Sentiment decline", contribution: 16, direction: "down" },
    ],
    trend: { previous: 61, current: 84, delta: 23, windowDays: 21 },
  },
  {
    entityId: "team-bravo",
    entityName: "Unit Bravo — Lagos",
    entityType: "team",
    score: 72,
    label: "emerging",
    confidence: 0.79,
    drivers: [
      { name: "Shift strain", contribution: 40, direction: "up" },
      { name: "Promotion stagnation", contribution: 30, direction: "flat" },
      { name: "Workload imbalance", contribution: 30, direction: "up" },
    ],
    trend: { previous: 58, current: 72, delta: 14, windowDays: 30 },
  },
  {
    entityId: "dept-ops",
    entityName: "Operations — Central",
    entityType: "department",
    score: 68,
    label: "emerging",
    confidence: 0.82,
    drivers: [
      { name: "Hiring pipeline delay", contribution: 45, direction: "up" },
      { name: "Training gap", contribution: 35, direction: "flat" },
      { name: "Burnout accumulation", contribution: 20, direction: "up" },
    ],
    trend: { previous: 55, current: 68, delta: 13, windowDays: 14 },
  },
  {
    entityId: "region-west",
    entityName: "Western Region",
    entityType: "region",
    score: 45,
    label: "stable",
    confidence: 0.91,
    drivers: [
      { name: "Stable staffing", contribution: 50, direction: "flat" },
      { name: "Good manager ratio", contribution: 30, direction: "flat" },
      { name: "Minor absenteeism rise", contribution: 20, direction: "up" },
    ],
    trend: { previous: 42, current: 45, delta: 3, windowDays: 30 },
  },
  {
    entityId: "team-charlie",
    entityName: "Unit Charlie — Mombasa",
    entityType: "team",
    score: 91,
    label: "systemic",
    confidence: 0.74,
    drivers: [
      { name: "Cascade from Unit Alpha", contribution: 30, direction: "up" },
      { name: "Leadership vacancy", contribution: 35, direction: "up" },
      { name: "Critical skill attrition", contribution: 35, direction: "up" },
    ],
    trend: { previous: 70, current: 91, delta: 21, windowDays: 14 },
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Reduce Manager Span in Unit C",
    summary: "Current span of 1:14 exceeds sustainable threshold. Redistribute 3 direct reports to adjacent managers.",
    urgency: "high",
    predictedImpact: { burnoutDelta: -12, attritionDelta: -7, costDelta: 3 },
    ethicalImpact: {
      burdenShift: ["Adjacent managers absorb temporary load"],
      vulnerableGroups: ["Frontline staff in Unit C"],
      fairnessChange: 0.08,
    },
    evidenceRefs: ["Burnout-manager load correlation", "Fragility simulation S-041"],
    confidence: 0.82,
    linkedScenarioId: "sim-1",
  },
  {
    id: "rec-2",
    title: "Emergency Hiring — Mombasa Facility",
    summary: "Critical understaffing projected within 30 days. Accelerate 5 positions from Q3 pipeline.",
    urgency: "critical",
    predictedImpact: { attritionDelta: -15, burnoutDelta: -9, costDelta: 8, productivityDelta: 6 },
    ethicalImpact: {
      burdenShift: ["Budget reallocation from training"],
      vulnerableGroups: ["New hires under accelerated onboarding"],
      fairnessChange: -0.02,
    },
    evidenceRefs: ["Staffing gap analysis", "Cascade risk model"],
    confidence: 0.76,
  },
  {
    id: "rec-3",
    title: "Shift Pattern Restructure — Lagos",
    summary: "Current 12-hour rotations correlate with 40% of burnout signal. Propose 8-hour overlap model.",
    urgency: "medium",
    predictedImpact: { burnoutDelta: -18, productivityDelta: 4, costDelta: 5 },
    ethicalImpact: {
      burdenShift: ["Requires schedule change for all staff"],
      vulnerableGroups: ["Staff with caregiving responsibilities"],
      fairnessChange: 0.05,
    },
    evidenceRefs: ["Shift strain analysis", "Absenteeism correlation"],
    confidence: 0.88,
  },
];

export const anomalies: Anomaly[] = [
  { id: "a1", title: "Fragility Spike: Unit Charlie", severity: "systemic", timestamp: "12 min ago", affectedEntity: "Unit Charlie — Mombasa", description: "Score surged 21pts in 14 days. Leadership vacancy + skill attrition cascade." },
  { id: "a2", title: "Absenteeism Surge: Nairobi", severity: "critical", timestamp: "2h ago", affectedEntity: "Unit Alpha — Nairobi", description: "7-day rolling absenteeism at 11.2%, 2.3σ above baseline." },
  { id: "a3", title: "Promotion Stagnation: Lagos", severity: "emerging", timestamp: "6h ago", affectedEntity: "Unit Bravo — Lagos", description: "Zero promotions in 2 quarters. Sentiment decline correlated." },
  { id: "a4", title: "Manager Overload: Central Ops", severity: "emerging", timestamp: "1d ago", affectedEntity: "Operations — Central", description: "3 managers exceeding 1:16 span. Burnout indicators rising." },
];

export const healthMetrics: HealthMetric[] = [
  { id: "h1", label: "Burnout Risk Trend", value: 67, trend: [42, 45, 48, 52, 58, 63, 67], status: "emerging", unit: "/100" },
  { id: "h2", label: "Morale Index", value: 54, trend: [72, 68, 65, 62, 58, 56, 54], status: "critical", unit: "/100" },
  { id: "h3", label: "Absenteeism Rate", value: 6.8, trend: [3.2, 3.8, 4.2, 4.8, 5.4, 6.1, 6.8], status: "emerging", unit: "%" },
  { id: "h4", label: "Workload Imbalance", value: 0.34, trend: [0.15, 0.18, 0.22, 0.25, 0.28, 0.31, 0.34], status: "emerging", unit: "Gini" },
  { id: "h5", label: "Manager Health Score", value: 58, trend: [75, 72, 68, 65, 62, 60, 58], status: "critical", unit: "/100" },
  { id: "h6", label: "Shift Strain Index", value: 71, trend: [50, 55, 58, 62, 66, 69, 71], status: "emerging", unit: "/100" },
];

export const defaultSimVariables: SimulationVariable[] = [
  { key: "hiring_rate", label: "Hiring Rate Change", value: 0, min: -30, max: 50, step: 5, unit: "%" },
  { key: "shift_reduction", label: "Shift Hour Reduction", value: 0, min: 0, max: 4, step: 0.5, unit: "hrs" },
  { key: "manager_ratio", label: "Manager Ratio Improvement", value: 0, min: 0, max: 30, step: 5, unit: "%" },
  { key: "training_investment", label: "Training Investment", value: 0, min: 0, max: 100, step: 10, unit: "%" },
  { key: "mental_health", label: "Mental Health Resources", value: 0, min: 0, max: 100, step: 10, unit: "%" },
  { key: "compensation", label: "Compensation Adjustment", value: 0, min: -10, max: 20, step: 2, unit: "%" },
];
