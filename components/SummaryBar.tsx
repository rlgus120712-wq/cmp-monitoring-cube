"use client"

import { motion } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react"
import { useMemo } from "react"
import { useResourceStore } from "@/stores/resourceStore"

export function SummaryBar() {
  const { summary, faces } = useResourceStore((state) => ({
    summary: state.summary,
    faces: state.faces
  }))

  const highlight = useMemo(() => {
    if (!faces.length) {
      return null
    }
    const sorted = [...faces].sort(
      (a, b) => (b.insights[0]?.estimatedSavings ?? 0) - (a.insights[0]?.estimatedSavings ?? 0)
    )
    return sorted[0]
  }, [faces])

  if (!summary) {
    return null
  }

  return (
    <div className="glass-panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_60%)]" />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            Live CMP intelligence
          </div>
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-semibold text-slate-50 md:text-4xl"
            >
              Okestro Cost Navigator
            </motion.h1>
            <p className="max-w-xl text-sm text-slate-400 md:text-base">
              A spatial control tower for your CMP estate. Monitor health, cost and
              governance posture in one immersive view. Each cube spotlights a domain
              with live anomalies, forecasts and recommended plays.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge label="Cloud scale ready" />
            <Badge label="FinOps insights" tone="sky" />
            <Badge label="Automated guardrails" tone="violet" />
          </div>
        </div>

        <div className="grid w-full max-w-lg grid-cols-2 gap-4 md:w-auto md:max-w-none lg:grid-cols-4">
          <MetricTile
            icon={TrendingUp}
            title="Monthly Spend"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0
            }).format(summary.totalMonthlyCost)}
          />
          <MetricTile
            icon={Activity}
            title="Forecast Variance"
            value={`${summary.forecastVariance.toFixed(1)}%`}
            tone="sky"
          />
          <MetricTile
            icon={AlertTriangle}
            title="Active Signals"
            value={summary.activeAnomalies.toString()}
            tone="amber"
          />
          <MetricTile
            icon={ShieldCheck}
            title="Compliance Score"
            value={`${summary.complianceScore.toFixed(0)}%`}
            tone="emerald"
          />
        </div>
      </div>

      {highlight ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative mt-8 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 md:p-5"
        >
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Spotlight domain
          </p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-100">
                {highlight.title}
              </p>
              <p className="text-xs text-slate-400">{highlight.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span>
                Spend {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0
                }).format(highlight.cost.current)}
              </span>
              <span>
                Utilisation {highlight.utilisation.value}% (
                {highlight.utilisation.trend >= 0 ? "+" : ""}
                {highlight.utilisation.trend} pts)
              </span>
              <span className="rounded-full border border-sky-500/50 px-2 py-1 text-xs text-sky-300">
                {highlight.insights.length} insight
                {highlight.insights.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}

function MetricTile({
  icon: Icon,
  title,
  value,
  tone = "slate"
}: {
  icon: typeof TrendingUp
  title: string
  value: string
  tone?: "slate" | "sky" | "emerald" | "amber"
}) {
  const toneClass =
    tone === "sky"
      ? "via-sky-500/15 text-sky-200 border-sky-500/40"
      : tone === "emerald"
        ? "via-emerald-500/15 text-emerald-200 border-emerald-500/40"
        : tone === "amber"
          ? "via-amber-500/15 text-amber-200 border-amber-500/40"
          : "via-slate-500/10 text-slate-200 border-slate-500/30"

  return (
    <div className={`rounded-2xl border bg-gradient-to-br from-slate-900/80 ${toneClass} p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
        <Icon className="h-4 w-4 text-current" />
      </div>
      <p className="mt-3 text-xl font-semibold">{value}</p>
    </div>
  )
}

function Badge({
  label,
  tone = "slate"
}: {
  label: string
  tone?: "slate" | "sky" | "violet"
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-500/40 text-sky-200"
      : tone === "violet"
        ? "border-violet-500/40 text-violet-200"
        : "border-slate-600/60 text-slate-200"
  return (
    <span
      className={`inline-flex items-center rounded-full border bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-wide ${toneClass}`}
    >
      {label}
    </span>
  )
}

