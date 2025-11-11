"use client"

import { Canvas } from "@react-three/fiber"
import { Edges, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"

const faceLayout: Record<
  string,
  { position: [number, number, number]; rotation: [number, number, number] }
> = {
  front: { position: [0, 0, 1.02], rotation: [0, 0, 0] },
  back: { position: [0, 0, -1.02], rotation: [0, Math.PI, 0] },
  top: { position: [0, 1.02, 0], rotation: [-Math.PI / 2, 0, 0] },
  bottom: { position: [0, -1.02, 0], rotation: [Math.PI / 2, 0, 0] },
  left: { position: [-1.02, 0, 0], rotation: [0, Math.PI / 2, 0] },
  right: { position: [1.02, 0, 0], rotation: [0, -Math.PI / 2, 0] }
}

const colorByHealth: Record<ResourceFace["health"], string> = {
  normal: "#0ea5e9",
  warning: "#f59e0b",
  critical: "#f97316"
}

const faceOrder = ["front", "back", "top", "bottom", "left", "right"]

export function CubeScene() {
  const { faces, selectedFaceId, selectFace } = useResourceStore((state) => ({
    faces: state.faces,
    selectedFaceId: state.selectedFaceId,
    selectFace: state.selectFace
  }))

  const arrangedFaces = useMemo(() => {
    if (faces.length === 0) {
      return []
    }

    return faces.map((face, index) => {
      const layoutKey = faceOrder[index % faceOrder.length]
      return {
        ...face,
        layoutKey
      }
    })
  }, [faces])

  return (
    <div className="glass-panel relative flex-1 overflow-hidden min-h-[420px]">
      <Canvas style={{ height: "100%", width: "100%" }} shadows>
        <PerspectiveCamera makeDefault position={[4.2, 3.2, 4.2]} fov={48} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          color="#38bdf8"
        />
        <directionalLight position={[-4, -2, -4]} intensity={0.3} color="#818cf8" />
        <pointLight position={[0, 4, 0]} intensity={0.7} />

        <group rotation={[0.4, 0.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 2.2, 2.2]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.3}
              roughness={0.8}
              transparent
              opacity={0.9}
            />
            <Edges color="#38bdf8" />
          </mesh>

          {arrangedFaces.map((face) => {
            const { layoutKey } = face
            const layout = faceLayout[layoutKey]
            const isActive = face.id === selectedFaceId
            return (
              <Html
                key={face.id}
                position={layout.position}
                rotation={layout.rotation}
                transform
                occlude
                distanceFactor={1.2}
              >
                <motion.button
                  onClick={() => selectFace(face.id)}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    boxShadow: isActive
                      ? "0px 0px 32px rgba(56, 189, 248, 0.35)"
                      : "0px 0px 16px rgba(15, 23, 42, 0.6)"
                  }}
                  className="w-56 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 text-left backdrop-blur"
                  style={{
                    borderColor: `${colorByHealth[face.health]}55`
                  }}
                >
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {face.title}
                  </p>
                  <p className="text-sm font-semibold text-slate-100">
                    {face.subtitle}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-slate-50">
                      $
                      {face.cost.current.toLocaleString("en-US", {
                        maximumFractionDigits: 0
                      })}
                    </span>
                    <span
                      className={`text-xs ${
                        face.cost.deltaPercent >= 0 ? "text-sky-400" : "text-emerald-400"
                      }`}
                    >
                      {face.cost.deltaPercent >= 0 ? "+" : ""}
                      {face.cost.deltaPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Utilisation {face.utilisation.value}%
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getHealthBadgeClass(face.health)}`}
                    >
                      {face.health.toUpperCase()}
                    </span>
                  </div>
                </motion.button>
              </Html>
            )
          })}
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#020617" />
        </mesh>

        <OrbitControls
          enablePan={false}
          dampingFactor={0.08}
          enableZoom
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  )
}

function getHealthBadgeClass(health: ResourceFace["health"]) {
  switch (health) {
    case "normal":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
    case "warning":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/30"
    case "critical":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/30"
    default:
      return "bg-slate-500/10 text-slate-300 border border-slate-500/30"
  }
}

