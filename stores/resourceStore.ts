"use client"

import { create } from "zustand"
import type { DashboardSummary, ResourceFace } from "@/lib/types"

interface ResourceState {
  faces: ResourceFace[]
  summary: DashboardSummary | null
  selectedFaceId: string | null
  hoveredFaceId: string | null
  setData: (faces: ResourceFace[], summary: DashboardSummary) => void
  selectFace: (faceId: string) => void
  setHoveredFace: (faceId: string | null) => void
  updateFace: (faceId: string, patch: Partial<ResourceFace>) => void
}

export const useResourceStore = create<ResourceState>((set) => ({
  faces: [],
  summary: null,
  selectedFaceId: null,
  hoveredFaceId: null,
  setData: (faces, summary) =>
    set({
      faces,
      summary,
      selectedFaceId: faces[0]?.id ?? null
    }),
  selectFace: (faceId) => set({ selectedFaceId: faceId }),
  setHoveredFace: (faceId) => set({ hoveredFaceId: faceId }),
  updateFace: (faceId, patch) =>
    set((state) => ({
      faces: state.faces.map((face) =>
        face.id === faceId ? { ...face, ...patch } : face
      )
    }))
}))

