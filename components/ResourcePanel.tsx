"use client"

import { motion } from "framer-motion"
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bolt,
  CircleDot,
  TimerReset
} from "lucide-react"
import { useMemo } from "react"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"

const healthStyles: Record<ResourceFace["health"], string> = {
  normal: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-rose-400"
}

const impactBadge: Record<ResourceFace["category"], string> = {
  compute: "border-blue-500/40 text-blue-200",
  storage: "border-cyan-500/40 text-cyan-200",
  network: "border-violet-500/40 text-violet-200",
  security: "border-rose-500/40 text-rose-200",
  finops: "border-emerald-500/40 text-emerald-200",
  platform: "border-sky-500/40 text-sky-200"
}

const insightAccent = {
  security: "bg-rose-500/10 text-rose-200 border-rose-500/20",
  performance: "bg-sky-500/10 text-sky-200 border-sky-500/20",
  cost: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
} as const

export function ResourcePanel() {
  const { faces, selectedFaceId } = useResourceStore((state) => ({
    faces: state.faces,
    selectedFaceId: state.selectedFaceId
  }))

  const face = useMemo(
    () => faces.find((item) => item.id === selectedFaceId),
    [faces, selectedFaceId]
  )

  if (!face) {
    return (
      <div className="glass-panel flex h-full items-center justify-center p-6 text-sm text-slate-400">
        Select a cube to inspect its telemetry.
      </div>
    )
  }

  return (
    <motion.div
      key={face.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel flex h-full flex-col overflow-hidden p-6"
    >
      <header className="relative mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5">
        <div className="absolute inset-x-6 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_70%)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{face.title}</h2>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                {face.subtitle}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-slate-600/60 bg-slate-950/60 px-3 py-1 text-xs font-medium ${impactBadge[face.category]}`}
            >
              <CircleDot className="h-3.5 w-3.5" />
              {face.category}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <StatusChip
              icon={TimerReset}
              label="Updated"
              value={new Date(face.lastUpdated).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit"
              })}
            />
            <StatusChip
              icon={AlertCircle}
              label="Health"
              className={healthStyles[face.health]}
              value={face.health === "normal" ? "Healthy" : face.health === "warning" ? "Attention" : "Critical"}
            />
            <StatusChip
              icon={AlertTriangle}
              label="Signals"
              value={`${face.anomalies} anomalies`}
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5 text-xs text-slate-200">
        <MetricBlock
          title="Monthly Spend"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          }).format(face.cost.current)}
          caption={`Forecast ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          }).format(face.cost.forecast)}`}
        />
        <MetricBlock
          title="Utilisation"
          value={`${face.utilisation.value}%`}
          caption={`${face.utilisation.trend >= 0 ? "+" : ""}${face.utilisation.trend} pts vs. prior`}
          accent={face.utilisation.trend >= 0 ? "text-sky-300" : "text-amber-300"}
        />
        <MetricBlock
          title="Cost delta"
          value={`${face.cost.deltaPercent >= 0 ? "+" : ""}${face.cost.deltaPercent.toFixed(1)}%`}
          caption="Month-over-month"
        />
        <MetricBlock
          title="Insight coverage"
          value={`${face.insights.length} play${face.insights.length > 1 ? "s" : ""}`}
          caption="Ready-to-run automations"
        />
      </section>

      <section className="mt-5 flex-1 overflow-y-auto pr-1">
        <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500">
          recommended plays
        </h3>
        <div className="mt-3 space-y-3">
          {face.insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border px-4 py-3 ${insightAccent[insight.impact]} bg-slate-950/60 backdrop-blur`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {insight.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-200">
                    {insight.description}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full border border-slate-200/20 px-2 py-1 text-[10px] uppercase tracking-widest text-slate-100">
                  <Bolt className="h-3 w-3" />
                  {insight.impact}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-100">
                <span className="max-w-[70%] text-slate-200">
                  {insight.recommendedAction}
                </span>
                {insight.estimatedSavings ? (
                  <span className="flex items-center gap-1 text-emerald-200">
                    <ArrowUpRight className="h-3 w-3" />
                    $
                    {insight.estimatedSavings.toLocaleString("en-US")}
                  </span>
                ) : (
                  <span className="text-slate-400">Policy only</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

function StatusChip({
  icon: Icon,
  label,
  value,
  className = ""
}: {
  icon: typeof TimerReset
  label: string
  value: string
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-600/60 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-300 ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[10px]">{label}</span>
      <strong className="text-xs font-semibold">{value}</strong>
    </span>
  )
}

function MetricBlock({
  title,
  value,
  caption,
  accent
}: {
  title: string
  value: string
  caption: string
  accent?: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-700/50 bg-slate-950/60 p-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
        {title}
      </p>
      <p className={`text-lg font-semibold text-slate-100 ${accent ?? ""}`}>{value}</p>
      <p className="text-xs text-slate-400">{caption}</p>
    </div>
  )
}

