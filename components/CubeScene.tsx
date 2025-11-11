"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Edges, Html, OrbitControls, PerspectiveCamera, useCursor } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"

const GRID_POSITIONS: [number, number, number][] = [
  [-2.4, -1.2, -2.4],
  [0, -1.2, -2.4],
  [2.4, -1.2, -2.4],
  [-2.4, -1.2, 0],
  [0, -1.2, 0],
  [2.4, -1.2, 0],
  [-2.4, -1.2, 2.4],
  [0, -1.2, 2.4],
  [2.4, -1.2, 2.4]
]

const categoryPalette: Record<ResourceFace["category"], { base: string; glow: string }> = {
  compute: { base: "#2563eb", glow: "#60a5fa" },
  storage: { base: "#0ea5e9", glow: "#7dd3fc" },
  network: { base: "#8b5cf6", glow: "#c4b5fd" },
  security: { base: "#db2777", glow: "#f9a8d4" },
  finops: { base: "#16a34a", glow: "#4ade80" },
  platform: { base: "#06b6d4", glow: "#67e8f9" }
}

export function CubeScene() {
  const { faces, hoveredFaceId, setHoveredFace } = useResourceStore((state) => ({
    faces: state.faces,
    hoveredFaceId: state.hoveredFaceId,
    setHoveredFace: state.setHoveredFace
  }))

  const gridCubes = useMemo(
    () =>
      faces.map((face, index) => ({
        face,
        position: GRID_POSITIONS[index % GRID_POSITIONS.length]
      })),
    [faces]
  )

  const highlightFace = faces[0]

  return (
    <Canvas shadows dpr={[1, 1.5]}>
      <color attach="background" args={["#020617"]} />
      <PerspectiveCamera makeDefault position={[10, 8, 12]} fov={46} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 12, 8]} intensity={1.2} castShadow color="#60a5fa" />
      <directionalLight position={[-8, 10, -12]} intensity={0.4} color="#c084fc" />
      <spotLight position={[0, 14, 0]} intensity={0.5} angle={0.35} penumbra={0.8} />

      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#010b1f" />
      </mesh>

      {/* Outer glass volume */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[12, 10, 12]} />
        <meshPhysicalMaterial
          color="#1d4ed8"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.4}
          transmission={0.6}
        />
        <Edges color="#1d4ed8" />
      </mesh>

      {/* Base grid cubes */}
      <group rotation={[-0.35, 0.6, 0]}>
        {gridCubes.map(({ face, position }) => (
          <DomainCube
            key={face.id}
            face={face}
            position={position}
            palette={categoryPalette[face.category]}
            isHovered={hoveredFaceId === face.id}
            onHover={() => setHoveredFace(face.id)}
            onLeave={() => setHoveredFace(null)}
          />
        ))}

        <FloatingCube face={highlightFace} />
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
    </Canvas>
  )
}

interface DomainCubeProps {
  face: ResourceFace
  position: [number, number, number]
  palette: { base: string; glow: string }
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function DomainCube({ face, position, palette, isHovered, onHover, onLeave }: DomainCubeProps) {
  useCursor(isHovered)

  return (
    <group
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover()
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onLeave()
      }}
    >
      <mesh scale={isHovered ? 1.15 : 1} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color={palette.base}
          roughness={0.35}
          metalness={0.5}
          emissive={palette.glow}
          emissiveIntensity={isHovered ? 0.25 : 0.12}
        />
        <Edges color={palette.glow} />
      </mesh>

      <Html position={[0, -1.4, 0]} center>
        <div className="rounded-full border border-slate-600/40 bg-slate-950/70 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-300 backdrop-blur">
          {face.title}
        </div>
      </Html>
    </group>
  )
}

function FloatingCube({ face }: { face?: ResourceFace }) {
  const ref = useRef<THREE.Mesh>(null)
  const palette = face ? categoryPalette[face.category] : null

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = 1.6 + Math.sin(t * 1.1) * 0.35
    ref.current.rotation.y = t * 0.6
    ref.current.rotation.x = 0.2 + Math.sin(t * 0.4) * 0.1
  })

  if (!face || !palette) {
    return null
  }

  return (
    <group>
      <mesh ref={ref} position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial
          color={palette.base}
          roughness={0.25}
          metalness={0.5}
          emissive={palette.glow}
          emissiveIntensity={0.3}
        />
        <Edges color={palette.glow} />
      </mesh>
      <Html position={[0, 3.4, 0]} center>
        <div className="rounded-full border border-slate-600/40 bg-slate-950/70 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-200 backdrop-blur">
          {face.title}
        </div>
      </Html>
    </group>
  )
}

