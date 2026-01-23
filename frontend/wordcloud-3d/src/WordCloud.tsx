import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

type Word = {
  text: string
  weight: number
}

type PositionedWord = Word & {
  target: THREE.Vector3
  radius: number
  nw: number
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

//Colors for heatmap

function heatmapColor(t: number) {
  t = Math.min(1, Math.max(0, t))

  const stops = [
    { t: 0.0, c: new THREE.Color("#1e3cff") }, // blue
    { t: 0.25, c: new THREE.Color("#00c8ff") }, // cyan
    { t: 0.5, c: new THREE.Color("#00ff6a") }, // green
    { t: 0.75, c: new THREE.Color("#ffe600") }, // yellow
    { t: 1.0, c: new THREE.Color("#ff2d2d") }, // red
  ]

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]

    if (t >= a.t && t <= b.t) {
      const local = (t - a.t) / (b.t - a.t)
      return a.c.clone().lerp(b.c, local).getStyle()
    }
  }

  return stops[stops.length - 1].c.getStyle()
}

//layout generation
function generateLayout(words: Word[]): PositionedWord[] {
  const maxWeight = Math.max(...words.map(w => w.weight))
  const minWeight = Math.min(...words.map(w => w.weight))

  const normalized = words.map(w => ({
    ...w,
    nw:
      maxWeight === minWeight
        ? 1
        : (w.weight - minWeight) / (maxWeight - minWeight),
  }))

  const placed: PositionedWord[] = normalized.map((w, i) => {
    const t = 1 - w.nw
    const angle = i * GOLDEN_ANGLE

    const radius = 0.6 + t * 5

    // Depth: important words forward, rare words back
    const zBase = (w.nw - 0.5) * 3
    const zJitter = (Math.random() - 0.5) * 0.6

    return {
      text: w.text,
      weight: w.weight,
      nw: w.nw,
      radius: 0.4 + w.weight * 0.7,
      target: new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        zBase + zJitter
      ),
    }
  })

  /* ----------------------------
     3D Overlap Relaxation
  ----------------------------- */

  for (let iter = 0; iter < 14; iter++) {
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i]
        const b = placed[j]

        const delta = new THREE.Vector3().subVectors(
          a.target,
          b.target
        )

        const dist = delta.length()
        const minDist = a.radius + b.radius

        if (dist < minDist && dist > 0.001) {
          delta.normalize()
          const push = (minDist - dist) * 0.5
          a.target.add(delta.multiplyScalar(push))
          b.target.add(delta.multiplyScalar(-push))
        }
      }
    }
  }

  return placed
}

// Animate words
function AnimatedWord({
  word,
  sizeMode,
  colorMode,
}: {
  word: PositionedWord
  sizeMode: boolean
  colorMode: boolean
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const pos = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    pos.current.lerp(word.target, 0.075)
    ref.current.position.copy(pos.current)
  })

  return (
    <Text
      ref={ref}
      fontSize={sizeMode ? word.weight * 3 : 0.5}
      color={colorMode ? heatmapColor(word.nw) : "white"}
    >
      {word.text}
    </Text>
  )
}

/* ----------------------------
   WordCloud Component
----------------------------- */

export default function WordCloud({
  words,
  sizeMode,
  colorMode,
}: {
  words: Word[]
  sizeMode: boolean
  colorMode: boolean
}) {
  const layout = useMemo(() => generateLayout(words), [words])

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom enablePan />

      {layout.map((word, i) => (
        <AnimatedWord
          key={i}
          word={word}
          sizeMode={sizeMode}
          colorMode={colorMode}
        />
      ))}
    </Canvas>
  )
}
