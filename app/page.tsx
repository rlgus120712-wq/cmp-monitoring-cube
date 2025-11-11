"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCcw } from "lucide-react"
import { SummaryBar } from "@/components/SummaryBar"
import { CubeScene } from "@/components/CubeScene"
import { ResourcePanel } from "@/components/ResourcePanel"
import { useResourceStore } from "@/stores/resourceStore"
import { mockFaces, mockSummary } from "@/lib/mockData"
import { InsightsRail } from "@/components/InsightsRail"

export default function DashboardPage() {
  const { setData } = useResourceStore((state) => ({
    setData: state.setData
  }))

  useEffect(() => {
    setData(mockFaces, mockSummary)
  }, [setData])

  const handleRefresh = () => {
    setData(mockFaces, mockSummary)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex items-start justify-end">
        <motion.button
          onClick={handleRefresh}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500/60 hover:text-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh snapshot
        </motion.button>
      </div>

      <SummaryBar />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <CubeScene />
        <ResourcePanel />
      </section>

      <InsightsRail />
    </main>
  )
}

