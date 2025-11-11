"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, RefreshCcw } from "lucide-react"
import { SummaryBar } from "@/components/SummaryBar"
import { CubeScene } from "@/components/CubeScene"
import { ResourcePanel } from "@/components/ResourcePanel"
import { useResourceStore } from "@/stores/resourceStore"
import type { DashboardSummary, ResourceFace } from "@/lib/types"

interface ApiResponse {
  summary: DashboardSummary
  faces: ResourceFace[]
}

export default function DashboardPage() {
  const { setData } = useResourceStore((state) => ({
    setData: state.setData
  }))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/resources")
      if (!response.ok) {
        throw new Error("Failed to fetch monitoring data")
      }

      const payload: ApiResponse = await response.json()
      setData(payload.faces, payload.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-semibold text-slate-50"
          >
            Okestro Cost Navigator
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-xl text-sm text-slate-400"
          >
            Navigate your CMP resources in an interactive 3D space. Surface
            anomalies, forecast spend and trigger FinOps actions in seconds.
          </motion.p>
        </div>
        <motion.button
          onClick={() => void fetchData()}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500/60 hover:text-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh snapshot
        </motion.button>
      </header>

      <SummaryBar />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        </div>
      ) : error ? (
        <div className="glass-panel flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={() => void fetchData()}
            className="rounded-full border border-rose-400/40 px-4 py-2 text-xs uppercase tracking-wide text-rose-200 transition hover:border-rose-300/60"
          >
            Retry
          </button>
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <CubeScene />
          <ResourcePanel />
        </section>
      )}
    </main>
  )
}

