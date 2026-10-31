"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/** A phone shows the same world through a narrower window, so the same dot
    reads much larger. Fewer and smaller there. */
function fieldSize() {
  const narrow = typeof window !== "undefined" && window.innerWidth < 768
  return { count: narrow ? 220 : 420, dot: narrow ? 0.1 : 0.2 }
}

/** A soft round dot. Without it three draws hard squares, which look like confetti. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = size
    const ctx = canvas.getContext("2d")!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, "rgba(255,255,255,1)")
    g.addColorStop(0.35, "rgba(255,255,255,0.55)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function Field() {
  const points = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const dot = useDotTexture()
  const { count: COUNT, dot: dotSize } = useMemo(fieldSize, [])

  const positions = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return positions
  }, [COUNT])

  useFrame((state, delta) => {
    const p = points.current
    if (!p) return
    p.rotation.y += delta * 0.02
    /* lean the whole field a few degrees towards the pointer */
    const { x, y } = state.pointer
    p.rotation.x += (-y * 0.12 - p.rotation.x) * delta * 1.6
    p.position.x += (x * viewport.width * 0.02 - p.position.x) * delta * 1.2
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dot}
        size={dotSize}
        sizeAttenuation
        color="#8aeaf4"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  )
}

/** A slow dust field behind the hero. Real geometry, deliberately quiet. */
export default function Particles() {
  return (
    <Canvas
      className="absolute! inset-0"
      camera={{ position: [0, 0, 10], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
    >
      <Field />
    </Canvas>
  )
}
