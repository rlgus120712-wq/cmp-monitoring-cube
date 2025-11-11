"use client"

import NextDynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCcw } from "lucide-react"
import { SummaryBar } from "@/components/SummaryBar"
import { useResourceStore } from "@/stores/resourceStore"
import { mockFaces, mockSummary } from "@/lib/mockData"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const { setData } = useResourceStore((state) => ({
    setData: state.setData
  }))
  const [isDeckReady, setDeckReady] = useState(false)

  useEffect(() => {
    import("@/components/CubeScene").then(() => setDeckReady(true))
  }, [])

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

      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-[520px] md:min-h-[680px] lg:min-h-[720px]">
        {isDeckReady ? (
          <ClientDeck />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            Initializing volumetric canvas…
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>
    </main>
  )
}

const ClientDeck = NextDynamic(
  () => import("@/components/CubeScene").then((mod) => mod.CubeScene),
  { ssr: false }
)

