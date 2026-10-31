"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { avatarUrl } from "@/data/site"

/**
 * Object names as Ready Player Me exports them. Swap these for your model's
 * own names — in development the console prints every bone it found.
 */
const EYE_BONES = ["LeftEye", "RightEye"]

/**
 * Eyelids. Morph targets are tried first because they deform the lid over the
 * eyeball the way a real one closes; eyelid bones are used if the model rigs
 * them instead.
 */
const BLINK_MORPHS = ["eyeBlinkLeft", "eyeBlinkRight"]
const LID_BONES = ["LeftEyeLid", "RightEyeLid"]
const LID_CLOSED_ANGLE = THREE.MathUtils.degToRad(42)

/** If the eyes track the wrong way, flip a sign. Nothing else needs changing. */
const YAW_SIGN = 1
const PITCH_SIGN = 1

/* An eye only travels so far before the head would take over. */
const MAX_YAW = THREE.MathUtils.degToRad(28)
const MAX_PITCH = THREE.MathUtils.degToRad(17)

/* Blink shape: ~190ms door to door, inside the 150-250ms the brief asks for. */
const CLOSE_MS = 80
const OPEN_MS = 110
const GAP_MIN = 2000
const GAP_MAX = 6000
const DOUBLE_BLINK_CHANCE = 0.22

type Joint = { bone: THREE.Object3D; rest: THREE.Quaternion }

/* ease-in-out, so the lid does not start or stop abruptly */
const smooth = (t: number) => t * t * (3 - 2 * t)

function Rig() {
  const { scene } = useGLTF(avatarUrl)

  /* where the eyes are asked to look, and where they have got to */
  const want = useRef({ yaw: 0, pitch: 0 })
  const at = useRef({ yaw: 0, pitch: 0 })

  /* Blink state lives in a ref: it drives the model every frame and must
     never cause a React render, or the tracking would stutter. */
  const blink = useRef({
    value: 0,
    phase: "wait" as "wait" | "closing" | "opening",
    elapsed: 0,
    waitFor: GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN),
    encore: false,
  })

  const rig = useMemo(() => {
    const eyes: Joint[] = []
    const lids: Joint[] = []
    const morphs: { mesh: THREE.Mesh; indices: number[] }[] = []

    scene.traverse((o) => {
      if (EYE_BONES.includes(o.name)) {
        eyes.push({ bone: o, rest: o.quaternion.clone() })
      }
      if (LID_BONES.includes(o.name)) {
        lids.push({ bone: o, rest: o.quaternion.clone() })
      }
      const mesh = o as THREE.Mesh
      if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        const indices = BLINK_MORPHS.map(
          (n) => mesh.morphTargetDictionary![n],
        ).filter((i): i is number => i !== undefined)
        if (indices.length) morphs.push({ mesh, indices })
      }
    })

    if (process.env.NODE_ENV === "development") {
      if (eyes.length === 0) {
        const bones: string[] = []
        scene.traverse((o) => {
          if (o.type === "Bone") bones.push(o.name)
        })
        console.warn(
          `[avatar] no eye bones found — set EYE_BONES. Bones in this model: ${bones.join(", ")}`,
        )
      }
      if (morphs.length === 0 && lids.length === 0) {
        console.warn(
          "[avatar] no eyelids found. Export the model with ARKit morph targets (add ?morphTargets=ARKit to a Ready Player Me url) and it will blink.",
        )
      }
    }
    return { eyes, lids, morphs }
  }, [scene])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      want.current.yaw = THREE.MathUtils.clamp(nx, -1, 1) * MAX_YAW
      want.current.pitch = THREE.MathUtils.clamp(ny, -1, 1) * MAX_PITCH
    }
    /* cursor gone: ease the gaze back to facing forward */
    const forward = () => {
      want.current.yaw = 0
      want.current.pitch = 0
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", forward)
    window.addEventListener("blur", forward)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", forward)
      window.removeEventListener("blur", forward)
    }
  }, [])

  useFrame((_, delta) => {
    /* nothing to show on a hidden tab, so do none of this work */
    if (document.hidden) return

    const ms = Math.min(delta, 0.1) * 1000

    /* ---- gaze: only the eyeballs move, never the head or body ---- */
    const ease = 1 - Math.pow(0.002, Math.min(delta, 0.1))
    at.current.yaw += (want.current.yaw - at.current.yaw) * ease
    at.current.pitch += (want.current.pitch - at.current.pitch) * ease

    const turn = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        PITCH_SIGN * at.current.pitch,
        YAW_SIGN * at.current.yaw,
        0,
        "YXZ",
      ),
    )
    /* applied on top of each eye's own rest pose, so both eyes stay aligned
       however the model posed them */
    for (const eye of rig.eyes) {
      eye.bone.quaternion.copy(eye.rest).multiply(turn)
    }

    /* ---- blink: its own clock, so it never disturbs the gaze above ---- */
    const b = blink.current
    b.elapsed += ms

    if (b.phase === "wait" && b.elapsed >= b.waitFor) {
      b.phase = "closing"
      b.elapsed = 0
    } else if (b.phase === "closing") {
      b.value = smooth(Math.min(b.elapsed / CLOSE_MS, 1))
      if (b.elapsed >= CLOSE_MS) {
        b.phase = "opening"
        b.elapsed = 0
      }
    } else if (b.phase === "opening") {
      b.value = 1 - smooth(Math.min(b.elapsed / OPEN_MS, 1))
      if (b.elapsed >= OPEN_MS) {
        b.value = 0
        b.phase = "wait"
        b.elapsed = 0
        if (b.encore) {
          /* the second half of a double blink */
          b.encore = false
          b.waitFor = 90 + Math.random() * 70
        } else {
          b.encore = Math.random() < DOUBLE_BLINK_CHANCE
          b.waitFor = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN)
        }
      }
    }

    for (const { mesh, indices } of rig.morphs) {
      for (const i of indices) mesh.morphTargetInfluences![i] = b.value
    }
    for (const lid of rig.lids) {
      lid.bone.quaternion
        .copy(lid.rest)
        .multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(b.value * LID_CLOSED_ANGLE, 0, 0),
          ),
        )
    }
  })

  /* The body is placed once and never animated — the brief is explicit that
     only the eyes may move. */
  return <primitive object={scene} position={[0, -1.42, 0]} />
}

/** Chest-up framing, lit so the face reads as solid geometry. */
export default function Avatar() {
  const [small, setSmall] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const sync = () => setSmall(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return (
    <Canvas
      className="absolute! inset-0"
      camera={{ position: [0, 0.18, 1.15], fov: 28 }}
      /* a phone does not need the full pixel ratio for a head and shoulders */
      dpr={small ? [1, 1.25] : [1, 1.75]}
      shadows={!small}
      gl={{ antialias: !small, alpha: true }}
    >
      <ambientLight intensity={0.9} />
      {/* key, fill and two rim lights in the page's own colours */}
      <directionalLight
        position={[1.6, 2.4, 2.2]}
        intensity={2.6}
        castShadow={!small}
      />
      <directionalLight position={[-1.8, 0.6, 1.4]} intensity={0.9} />
      <directionalLight position={[-3, 1.5, -1]} intensity={2.4} color="#4cd9e8" />
      <directionalLight position={[2.4, 0.4, -2]} intensity={1.9} color="#8a6bff" />
      <Rig />
    </Canvas>
  )
}
