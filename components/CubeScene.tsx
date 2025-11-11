"use client"

import { Canvas } from "@react-three/fiber"
import {
  Edges,
  Html,
  OrbitControls,
  PerspectiveCamera,
  Stats
} from "@react-three/drei"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"

const GRID_POSITIONS: [number, number, number][] = [
  [-3.5, 1.4, 0],
  [-1.1, 1.4, 0],
  [1.3, 1.4, 0],
  [-3.5, -1.1, 0],
  [-1.1, -1.1, 0],
  [1.3, -1.1, 0]
]

const categoryPalette: Record<
  ResourceFace["category"],
  { base: string; glow: string }
> = {
  compute: { base: "#1d4ed8", glow: "#60a5fa" },
  storage: { base: "#0369a1", glow: "#38bdf8" },
  network: { base: "#7c3aed", glow: "#c084fc" },
  security: { base: "#c026d3", glow: "#f472b6" },
  finops: { base: "#047857", glow: "#34d399" },
  platform: { base: "#0ea5e9", glow: "#67e8f9" }
}

export function CubeScene() {
  const { faces, selectedFaceId, selectFace, hoveredFaceId, setHoveredFace } =
    useResourceStore((state) => ({
      faces: state.faces,
      selectedFaceId: state.selectedFaceId,
      selectFace: state.selectFace,
      hoveredFaceId: state.hoveredFaceId,
      setHoveredFace: state.setHoveredFace
    }))

  const cubes = useMemo(() => {
    return faces.map((face, index) => ({
      face,
      position: GRID_POSITIONS[index % GRID_POSITIONS.length]
    }))
  }, [faces])

  return (
    <div className="glass-panel relative min-h-[520px] overflow-hidden">
      <Canvas style={{ height: "100%", width: "100%" }} shadows dpr={[1, 1.5]}>
        <color attach="background" args={["#020617"]} />
        <PerspectiveCamera makeDefault position={[8, 6, 10]} fov={46} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.2}
          castShadow
          color="#38bdf8"
        />
        <directionalLight position={[-6, 8, -8]} intensity={0.55} color="#a855f7" />
        <spotLight position={[0, 12, 0]} intensity={0.6} angle={0.3} penumbra={0.8} />

        <group rotation={[-0.35, 0.55, 0]}>
          {cubes.map(({ face, position }) => {
            const isActive = face.id === selectedFaceId
            const isHovered = face.id === hoveredFaceId
            const palette = categoryPalette[face.category]

            return (
              <group
                key={face.id}
                position={position}
                onClick={(event) => {
                  event.stopPropagation()
                  selectFace(face.id)
                }}
                onPointerOver={(event) => {
                  event.stopPropagation()
                  setHoveredFace(face.id)
                }}
                onPointerOut={(event) => {
                  event.stopPropagation()
                  setHoveredFace(null)
                }}
                cursor="pointer"
              >
                <mesh scale={isActive ? 1.35 : isHovered ? 1.25 : 1.15} castShadow receiveShadow>
                  <boxGeometry args={[1.6, 1.6, 1.6]} />
                  <meshStandardMaterial
                    color={palette.base}
                    metalness={0.35}
                    roughness={0.4}
                    emissive={palette.glow}
                    emissiveIntensity={isActive ? 0.24 : isHovered ? 0.16 : 0.08}
                  />
                  <Edges color={palette.glow} />
                </mesh>

                <Html position={[0, 1.6, 0]} center>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex w-48 flex-col gap-2 rounded-2xl border border-slate-600/50 bg-slate-950/75 px-4 py-3 text-left shadow-lg backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                        {face.category}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${getHealthBadgeClass(face.health)}`}
                      >
                        {face.health}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{face.title}</p>
                      <p className="text-xs text-slate-400">{face.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>
                        $
                        {face.cost.current.toLocaleString("en-US", {
                          maximumFractionDigits: 0
                        })}
                      </span>
                      <span
                        className={
                          face.cost.deltaPercent >= 0 ? "text-sky-300" : "text-emerald-300"
                        }
                      >
                        {face.cost.deltaPercent >= 0 ? "+" : ""}
                        {face.cost.deltaPercent.toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                </Html>

                {isHovered ? (
                  <Html position={[0, -1.2, 0]} center>
                    <div className="rounded-xl border border-slate-600/40 bg-slate-900/80 px-3 py-2 text-[10px] text-slate-300 shadow-lg backdrop-blur">
                      <p className="uppercase tracking-[0.35em] text-slate-500">
                        signal
                      </p>
                      <p className="mt-1 text-xs text-slate-200">
                        {face.insights[0]?.title ?? "No open insights"}
                      </p>
                    </div>
                  </Html>
                ) : null}
              </group>
            )
          })}
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[28, 18]} />
          <meshStandardMaterial color="#020617" />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.49, 0]} receiveShadow>
          <circleGeometry args={[16, 64]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.6} />
        </mesh>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          dampingFactor={0.08}
        />
        <Stats showPanel={0} className="hidden" />
      </Canvas>
    </div>
  )
}

function getHealthBadgeClass(health: ResourceFace["health"]) {
  switch (health) {
    case "normal":
      return "border-emerald-500/30 text-emerald-200"
    case "warning":
      return "border-amber-500/30 text-amber-200"
    case "critical":
      return "border-rose-500/30 text-rose-200"
    default:
      return "border-slate-500/30 text-slate-200"
  }
}

