import { NextResponse } from "next/server"
import { mockFaces, mockSummary } from "@/lib/mockData"

export async function GET() {
  return NextResponse.json({
    summary: mockSummary,
    faces: mockFaces
  })
}

