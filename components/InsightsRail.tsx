"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Lightbulb, Sparkles } from "lucide-react"
import { useMemo } from "react"
import { useResourceStore } from "@/stores/resourceStore"

const impactPalette = {
  cost: "from-emerald-500/20 via-emerald-500/5",
  performance: "from-sky-500/20 via-sky-500/5",
  security: "from-rose-500/20 via-rose-500/5"
} as const

export function InsightsRail() {
  const { faces } = useResourceStore((state) => ({
    faces: state.faces
  }))

  const insights = useMemo(() => {
    return faces
      .flatMap((face) =>
        face.insights.map((insight) => ({
          faceId: face.id,
          faceTitle: face.title,
          category: face.category,
          health: face.health,
          ...insight
        }))
      )
      .sort(
        (a, b) => (b.estimatedSavings ?? 0) - (a.estimatedSavings ?? 0)
      )
      .slice(0, 4)
  }, [faces])

  if (!insights.length) {
    return null
  }

  return (
    <div className="glass-panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.18),_transparent_65%)]" />
      <div className="relative mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Sparkles className="h-4 w-4 text-violet-300" />
          AI-suggested plays
        </div>
        <p className="text-xs text-slate-400">
          Prioritised by potential savings and service impact
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight, index) => (
          <motion.div
            key={`${insight.faceId}-${insight.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br ${impactPalette[insight.impact]} to-slate-900/70 p-4`}
          >
            <div className="absolute right-3 top-3 text-xs uppercase tracking-[0.3em] text-slate-500">
              {insight.impact}
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Lightbulb className="h-4 w-4 text-amber-300" />
              <span className="text-xs uppercase tracking-wide text-slate-300">
                {insight.faceTitle}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-50">
              {insight.title}
            </h3>
            <p className="mt-2 text-xs text-slate-300">{insight.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
              {insight.estimatedSavings ? (
                <span className="flex items-center gap-1 text-emerald-200">
                  <ArrowUpRight className="h-3 w-3" />
                  Save $
                  {insight.estimatedSavings.toLocaleString("en-US")}
                </span>
              ) : (
                <span className="text-slate-400">Guardrail update</span>
              )}
              <span className="rounded-full border border-slate-500/40 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-200">
                {insight.recommendedAction}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

