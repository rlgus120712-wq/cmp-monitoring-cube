"use client"

import { create } from "zustand"
import type { DashboardSummary, ResourceFace } from "@/lib/types"

interface ResourceState {
  faces: ResourceFace[]
  summary: DashboardSummary | null
  hoveredFaceId: string | null
  setData: (faces: ResourceFace[], summary: DashboardSummary) => void
  setHoveredFace: (faceId: string | null) => void
}

export const useResourceStore = create<ResourceState>((set) => ({
  faces: [],
  summary: null,
  hoveredFaceId: null,
  setData: (faces, summary) =>
    set({
      faces,
      summary,
      hoveredFaceId: null
    }),
  setHoveredFace: (faceId) => set({ hoveredFaceId: faceId }),
}))

