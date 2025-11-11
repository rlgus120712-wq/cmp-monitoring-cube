"use client"

import { motion } from "framer-motion"
import { AlertTriangle, BarChart3, ShieldCheck, TrendingUp } from "lucide-react"
import { useResourceStore } from "@/stores/resourceStore"

const metrics = [
  {
    id: "cost",
    icon: TrendingUp,
    label: "Monthly Spend",
    format: (value: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(value)
  },
  {
    id: "variance",
    icon: BarChart3,
    label: "Forecast Variance",
    format: (value: number) => `${value.toFixed(1)}%`
  },
  {
    id: "anomalies",
    icon: AlertTriangle,
    label: "Active Anomalies",
    format: (value: number) => value.toString()
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    label: "Compliance Score",
    format: (value: number) => `${value.toFixed(0)}%`
  }
]

export function SummaryBar() {
  const summary = useResourceStore((state) => state.summary)

  if (!summary) {
    return null
  }

  return (
    <div className="glass-panel mb-6 grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
      {metrics.map(({ id, icon: Icon, label, format }, index) => {
        const value =
          id === "cost"
            ? summary.totalMonthlyCost
            : id === "variance"
              ? summary.forecastVariance
              : id === "anomalies"
                ? summary.activeAnomalies
                : summary.complianceScore
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-50">
                {format(value)}
              </p>
            </div>
            <span className="rounded-full bg-slate-800/70 p-2">
              <Icon className="h-5 w-5 text-sky-400" />
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

