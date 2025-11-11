"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Html, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { Vector2 } from "three"
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing"
import { useResourceStore } from "@/stores/resourceStore"
import type { ResourceFace } from "@/lib/types"

const ORBIT_RADIUS = 5.8
const CORE_RADIUS = 2.3
const categoryPalette: Record<ResourceFace["category"], { base: string; glow: string }> = {
  compute: { base: "#38bdf8", glow: "#9acfff" },
  storage: { base: "#22d3ee", glow: "#8defff" },
  network: { base: "#a855f7", glow: "#d8b4fe" },
  security: { base: "#fb7185", glow: "#fda4af" },
  finops: { base: "#34d399", glow: "#bbf7d0" },
  platform: { base: "#0ea5e9", glow: "#67e8f9" }
}

export function CubeScene() {
  const { faces, hoveredFaceId, setHoveredFace } = useResourceStore((state) => ({
    faces: state.faces,
    hoveredFaceId: state.hoveredFaceId,
    setHoveredFace: state.setHoveredFace
  }))

  const orbitParams = useMemo(
    () =>
      faces.map((_, index) => ({
        initial: (index / faces.length) * Math.PI * 2,
        speed: 0.22 + index * 0.02
      })),
    [faces]
  )

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2("#010b1f", 0.045)
      }}
    >
      <color attach="background" args={["#010b1f"]} />
      <PerspectiveCamera makeDefault position={[8, 7, 10]} fov={40} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[10, 15, 9]} intensity={1.35} castShadow color="#60a5fa" />
      <directionalLight position={[-7, 9, -11]} intensity={0.45} color="#c084fc" />
      <spotLight position={[0, 13, 0]} intensity={0.55} angle={0.35} penumbra={0.9} />

      {/* Deck base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
        <cylinderGeometry args={[7.8, 9.3, 1.6, 64]} />
        <meshPhysicalMaterial
          color="#051327"
          emissive="#132f65"
          emissiveIntensity={0.4}
          roughness={0.6}
          metalness={0.35}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <ringGeometry args={[ORBIT_RADIUS - 0.2, ORBIT_RADIUS + 0.1, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <ringGeometry args={[CORE_RADIUS + 0.3, CORE_RADIUS + 0.45, 96]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.18} />
      </mesh>

      {/* Core column */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[CORE_RADIUS * 0.25, CORE_RADIUS * 0.5, 128]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.28} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[CORE_RADIUS * 0.1, CORE_RADIUS * 0.22, 96]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <circleGeometry args={[CORE_RADIUS * 0.12, 64]} />
          <meshBasicMaterial color="#1e3a8a" transparent opacity={0.18} />
        </mesh>
        <CorePulse radius={CORE_RADIUS} />
        <Html position={[0, 1.6, 0]} center>
          <div className="rounded-full border border-sky-500/40 bg-slate-950/80 px-5 py-2 text-xs uppercase tracking-[0.45em] text-sky-200 backdrop-blur">
            Okestro Core
          </div>
        </Html>
      </group>

      {/* Orbiting nodes */}
      {faces.map((face, index) => (
        <OrbitNode
          key={face.id}
          face={face}
          palette={categoryPalette[face.category]}
          initialAngle={orbitParams[index]?.initial ?? 0}
          speed={orbitParams[index]?.speed ?? 0.22}
          orbitRadius={ORBIT_RADIUS}
          yVariance={0.6}
          isHovered={hoveredFaceId === face.id}
          onHover={() => setHoveredFace(face.id)}
          onLeave={() => setHoveredFace(null)}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        dampingFactor={0.1}
        rotateSpeed={0.42}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 2.4}
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.42} luminanceThreshold={0.18} luminanceSmoothing={0.16} />
        <ChromaticAberration
          offset={new Vector2(0.0008, 0.0006)}
          radialModulation
          modulationOffset={0.18}
        />
        <Noise opacity={0.033} />
        <Vignette eskil={false} offset={0.42} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  )
}

interface OrbitNodeProps {
  face: ResourceFace
  palette: { base: string; glow: string }
  initialAngle: number
  speed: number
  orbitRadius: number
  yVariance: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function OrbitNode({
  face,
  palette,
  initialAngle,
  speed,
  orbitRadius,
  yVariance,
  isHovered,
  onHover,
  onLeave
}: OrbitNodeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const angleRef = useRef(initialAngle)

  useFrame((_, delta) => {
    angleRef.current += delta * speed
    const angle = angleRef.current
    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius
    const y = Math.sin(angle * 1.6) * yVariance

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z)
      groupRef.current.rotation.y = -angle + Math.PI / 2
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover()
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onLeave()
      }}
    >
      <mesh castShadow scale={isHovered ? 1.2 : 1}>
        <sphereGeometry args={[0.7, 36, 36]} />
        <meshPhysicalMaterial
          color={palette.base}
          emissive={palette.glow}
          emissiveIntensity={isHovered ? 0.6 : 0.28}
          roughness={0.18}
          metalness={0.45}
          transmission={0.15}
          thickness={0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.75, 0.9, 32]} />
        <meshBasicMaterial color={palette.glow} transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.6, 0.62, 64]} />
        <meshBasicMaterial color={palette.glow} transparent opacity={0.12} />
      </mesh>

      {isHovered ? (
        <Html position={[0, 1.3, 0]} center>
          <div className="rounded-xl border border-slate-600/40 bg-slate-950/85 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-100 backdrop-blur">
            {face.title}
          </div>
        </Html>
      ) : (
        <Text position={[0, 1.2, 0]} fontSize={0.45} color="#ced6ff" anchorX="center" anchorY="bottom">
          {face.title}
        </Text>
      )}
    </group>
  )
}

function CorePulse({ radius }: { radius: number }) {
  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!pulseRef.current) return
    const t = clock.elapsedTime
    const scale = radius + Math.sin(t * 2) * 0.18
    pulseRef.current.scale.set(scale, scale, scale)
    ;(pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.22 + Math.sin(t * 2) * 0.07
  })

  return (
    <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
      <ringGeometry args={[radius * 0.5, radius + 0.25, 96]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} />
    </mesh>
  )
}

