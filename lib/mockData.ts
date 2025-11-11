import { DashboardSummary, ResourceFace } from "./types"

export const mockSummary: DashboardSummary = {
  totalMonthlyCost: 3250,
  forecastVariance: 8.4,
  activeAnomalies: 5,
  complianceScore: 96
}

export const mockFaces: ResourceFace[] = [
  {
    id: "compute",
    title: "Compute Fabric",
    subtitle: "Kubernetes, VM, Serverless",
    category: "compute",
    cost: { current: 1280, forecast: 1350, deltaPercent: 11.2 },
    utilisation: { value: 74, trend: 6 },
    health: "warning",
    anomalies: 2,
    insights: [
      {
        id: "compute-1",
        title: "Right-size node pool",
        description: "EKS-prod node group usage < 40% for last 48h.",
        impact: "cost",
        estimatedSavings: 210,
        recommendedAction: "Scale-in 2 nodes or downgrade instance class."
      },
      {
        id: "compute-2",
        title: "Patch drift detected",
        description: "3 worker nodes running kernel < 5.15.149.",
        impact: "security",
        recommendedAction: "Schedule maintenance window and apply patch set."
      }
    ],
    lastUpdated: "2025-11-11T09:20:00Z"
  },
  {
    id: "storage",
    title: "Storage Grid",
    subtitle: "S3, EBS, EFS, Snapshots",
    category: "storage",
    cost: { current: 820, forecast: 790, deltaPercent: -3.5 },
    utilisation: { value: 63, trend: -2 },
    health: "normal",
    anomalies: 1,
    insights: [
      {
        id: "storage-1",
        title: "Cold data migration",
        description: "14 TB older than 180 days in S3 Standard tier.",
        impact: "cost",
        estimatedSavings: 340,
        recommendedAction: "Move to Intelligent-Tiering or Glacier Instant."
      }
    ],
    lastUpdated: "2025-11-11T09:15:00Z"
  },
  {
    id: "network",
    title: "Network Fabric",
    subtitle: "Transit Gateway, Load Balancers",
    category: "network",
    cost: { current: 420, forecast: 500, deltaPercent: 18.7 },
    utilisation: { value: 81, trend: 9 },
    health: "critical",
    anomalies: 3,
    insights: [
      {
        id: "network-1",
        title: "Egress spike",
        description: "APAC VPC data transfer up 240% vs baseline.",
        impact: "performance",
        recommendedAction: "Investigate suspect service, apply CDN caching."
      },
      {
        id: "network-2",
        title: "Idle load balancer",
        description: "ALB-prod-east traffic < 5 req/min for 72h.",
        impact: "cost",
        estimatedSavings: 95,
        recommendedAction: "Scale in to single AZ or switch to on-demand."
      }
    ],
    lastUpdated: "2025-11-11T09:05:00Z"
  },
  {
    id: "security",
    title: "Security & Governance",
    subtitle: "Policy, IAM, Guardrails",
    category: "security",
    cost: { current: 240, forecast: 260, deltaPercent: 4.3 },
    utilisation: { value: 92, trend: 1 },
    health: "normal",
    anomalies: 0,
    insights: [
      {
        id: "security-1",
        title: "New admin role created",
        description: "Okestro-admin-temp role lacks MFA enforcement.",
        impact: "security",
        recommendedAction: "Expire role or attach conditional MFA policy."
      }
    ],
    lastUpdated: "2025-11-11T09:25:00Z"
  },
  {
    id: "finops",
    title: "FinOps Operations",
    subtitle: "Budgets, Reservations",
    category: "finops",
    cost: { current: 320, forecast: 310, deltaPercent: -1.8 },
    utilisation: { value: 58, trend: -4 },
    health: "warning",
    anomalies: 1,
    insights: [
      {
        id: "finops-1",
        title: "RI coverage gap",
        description: "Coverage for compute workloads at 62% (< target 75%).",
        impact: "cost",
        estimatedSavings: 180,
        recommendedAction: "Purchase 2 c7g.4xlarge RI (12 months, all upfront)."
      }
    ],
    lastUpdated: "2025-11-11T09:18:00Z"
  },
  {
    id: "platform",
    title: "Platform Services",
    subtitle: "Observability, Automation",
    category: "platform",
    cost: { current: 170, forecast: 180, deltaPercent: 5.1 },
    utilisation: { value: 69, trend: 3 },
    health: "normal",
    anomalies: 0,
    insights: [
      {
        id: "platform-1",
        title: "Playbook success",
        description: "Auto-remediation playbook reduced MTTR by 28%.",
        impact: "performance",
        recommendedAction: "Promote runbook to primary incident flows."
      }
    ],
    lastUpdated: "2025-11-11T09:22:00Z"
  }
]

