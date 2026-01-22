import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"

function weightToColor(weight: number) {
  // blue → red heatmap
  const r = Math.min(1, weight * 3)
  const b = 1 - r
  return `rgb(${r * 255}, 0, ${b * 255})`
}

export default function WordCloud({
  words,
  sizeMode,
  colorMode,
}: any) {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {words.map((word: any, i: number) => (
        <Text
          key={i}
          position={word.position}
          fontSize={sizeMode ? word.weight * 3 : 0.5}
          color={colorMode ? weightToColor(word.weight) : "white"}
        >
          {word.text}
        </Text>
      ))}
    </Canvas>
  )
}
