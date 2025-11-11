export type ResourceHealth = "normal" | "warning" | "critical"

export interface ResourceInsight {
  id: string
  title: string
  description: string
  impact: "cost" | "performance" | "security"
  estimatedSavings?: number
  recommendedAction: string
}

export interface ResourceFace {
  id: string
  title: string
  subtitle: string
  category: "compute" | "storage" | "network" | "security" | "finops" | "platform"
  cost: {
    current: number
    forecast: number
    deltaPercent: number
  }
  utilisation: {
    value: number
    trend: number
  }
  health: ResourceHealth
  anomalies: number
  insights: ResourceInsight[]
  lastUpdated: string
}

export interface DashboardSummary {
  totalMonthlyCost: number
  forecastVariance: number
  activeAnomalies: number
  complianceScore: number
}

