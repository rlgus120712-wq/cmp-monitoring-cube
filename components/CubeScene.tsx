"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import {
  Edges,
  Html,
  OrbitControls,
  PerspectiveCamera,
  Text,
  useCursor
} from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing"
import { Vector2 } from "three"

const GRID_POSITIONS: [number, number, number][] = [
  [-3.6, -1.6, -3.6],
  [0, -1.6, -3.6],
  [3.6, -1.6, -3.6],
  [-3.6, -1.6, 0],
  [0, -1.6, 0],
  [3.6, -1.6, 0],
  [-3.6, -1.6, 3.6],
  [0, -1.6, 3.6],
  [3.6, -1.6, 3.6]
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
    <Canvas
      shadows
      dpr={[1, 1.5]}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2("#020817", 0.06)
      }}
    >
      <color attach="background" args={["#020617"]} />
      <PerspectiveCamera makeDefault position={[8, 7, 10]} fov={42} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 14, 10]} intensity={1.35} castShadow color="#60a5fa" />
      <directionalLight position={[-8, 10, -12]} intensity={0.4} color="#c084fc" />
      <spotLight position={[0, 14, 0]} intensity={0.5} angle={0.35} penumbra={0.8} />

      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]} receiveShadow>
        <planeGeometry args={[34, 34]} />
        <meshPhysicalMaterial color="#010b1f" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshPhysicalMaterial
          color="#03112d"
          emissive="#0b3b73"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.3}
        />
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
      <group rotation={[-0.25, 0.6, 0]} scale={1.6}>
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
        rotateSpeed={0.55}
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.45} luminanceThreshold={0.2} luminanceSmoothing={0.15} />
        <ChromaticAberration
          offset={new Vector2(0.0008, 0.0006)}
          radialModulation
          modulationOffset={0.2}
        />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.4} darkness={0.6} />
      </EffectComposer>
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
      <mesh scale={isHovered ? 1.1 : 1} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshPhysicalMaterial
          color={palette.base}
          roughness={0.22}
          metalness={0.5}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
          transmission={0.15}
          thickness={0.4}
          emissive={palette.glow}
          emissiveIntensity={isHovered ? 0.4 : 0.18}
        />
        <Edges color={palette.glow} />
      </mesh>

      {isHovered ? (
        <Html position={[0, -2.4, 0]} center>
          <div className="rounded-full border border-slate-600/40 bg-slate-950/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-slate-100 backdrop-blur">
            {face.title}
          </div>
        </Html>
      ) : null}

      <Text
        position={[0, -2.4, 0]}
        fontSize={0.45}
        color="#7dd3fc"
        anchorX="center"
        anchorY="top"
        visible={!isHovered}
      >
        {face.title}
      </Text>
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
      <mesh ref={ref} position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[3.4, 3.4, 3.4]} />
        <meshPhysicalMaterial
          color={palette.base}
          roughness={0.18}
          metalness={0.45}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          transmission={0.25}
          thickness={0.6}
          emissive={palette.glow}
          emissiveIntensity={0.4}
        />
        <Edges color={palette.glow} />
      </mesh>
      <Html position={[0, 4.4, 0]} center>
        <div className="rounded-full border border-slate-600/40 bg-slate-950/80 px-5 py-2 text-sm uppercase tracking-[0.4em] text-slate-100 backdrop-blur">
          {face.title}
        </div>
      </Html>
    </group>
  )
}

