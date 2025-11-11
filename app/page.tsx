"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCcw } from "lucide-react"
import { SummaryBar } from "@/components/SummaryBar"
import { CubeScene } from "@/components/CubeScene"
import { useResourceStore } from "@/stores/resourceStore"
import { mockFaces, mockSummary } from "@/lib/mockData"

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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="flex items-center justify-between">
        <SummaryBar />
        <motion.button
          onClick={handleRefresh}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500/60 hover:text-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh snapshot
        </motion.button>
      </div>

      <div className="relative h-[640px] w-full overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <CubeScene />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>
    </main>
  )
}

