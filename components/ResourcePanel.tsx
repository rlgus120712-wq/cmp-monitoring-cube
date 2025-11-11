"use client"

import { motion } from "framer-motion"
import { AlertTriangle, ArrowUpRight, BadgeCheck, Bolt } from "lucide-react"
import { useMemo } from "react"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"

const healthStyles: Record<ResourceFace["health"], string> = {
  normal: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-rose-400"
}

const healthLabel: Record<ResourceFace["health"], string> = {
  normal: "Healthy",
  warning: "Needs Attention",
  critical: "Critical"
}

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
      <div className="glass-panel h-full p-6">
        <p className="text-sm text-slate-400">
          Select a cube surface to inspect detailed metrics.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      key={face.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel h-full max-h-[640px] overflow-hidden p-6"
    >
      <header className="mb-5 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{face.title}</h2>
            <p className="text-sm text-slate-400">{face.subtitle}</p>
          </div>
          <span
            className={`flex items-center gap-2 text-sm font-medium ${healthStyles[face.health]}`}
          >
            <BadgeCheck className="h-4 w-4" />
            {healthLabel[face.health]}
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-4 text-xs text-slate-300">
          <div>
            <dt className="uppercase text-slate-500">Monthly Cost</dt>
            <dd className="mt-1 text-base text-slate-100">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
              }).format(face.cost.current)}
            </dd>
          </div>
          <div>
            <dt className="uppercase text-slate-500">Forecast</dt>
            <dd className="mt-1 text-base text-slate-100">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
              }).format(face.cost.forecast)}
            </dd>
          </div>
          <div>
            <dt className="uppercase text-slate-500">Utilisation</dt>
            <dd className="mt-1 text-base text-slate-100">
              {face.utilisation.value}%{" "}
              <span
                className={`ml-1 text-xs ${
                  face.utilisation.trend >= 0 ? "text-sky-400" : "text-amber-400"
                }`}
              >
                {face.utilisation.trend >= 0 ? "+" : ""}
                {face.utilisation.trend} pts
              </span>
            </dd>
          </div>
        </dl>
      </header>

      <section className="space-y-4">
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">Top Findings</h3>
            <span className="flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-1 text-xs text-slate-300">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              {face.anomalies} anomalies
            </span>
          </div>
          <ul className="mt-3 space-y-3">
            {face.insights.map((insight) => (
              <li
                key={insight.id}
                className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      {insight.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {insight.description}
                    </p>
                  </div>
                  <span
                    className={`ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${
                      insight.impact === "security"
                        ? "bg-rose-400/10 text-rose-300"
                        : insight.impact === "performance"
                          ? "bg-sky-400/10 text-sky-300"
                          : "bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    <Bolt className="h-3 w-3" />
                    {insight.impact}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                  <span>{insight.recommendedAction}</span>
                  {insight.estimatedSavings ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      save $
                      {insight.estimatedSavings.toLocaleString("en-US")}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4 text-xs text-slate-400">
          Last updated:{" "}
          {new Date(face.lastUpdated).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric"
          })}
        </div>
      </section>
    </motion.div>
  )
}

