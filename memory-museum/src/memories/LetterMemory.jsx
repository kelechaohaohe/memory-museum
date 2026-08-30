import { useState, useEffect } from 'react'
import { Text, Billboard } from '@react-three/drei'
import Goldfish from '../components/Goldfish'

const TIMES_FONT =
  'https://cdn.jsdelivr.net/fontsource/fonts/tinos@latest/latin-400-normal.ttf'

const PENCIL_CURSOR =
  `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M19.4 4.6a2 2 0 0 1 2.8 2.8l-1.4 1.4-2.8-2.8 1.4-1.4zm-2.8 2.8l2.8 2.8-9.2 9.2-3.5.7.7-3.5 9.2-9.2z" fill="%23f4ead1" stroke="%23c9a86a" stroke-width="0.6"/></svg>') 14 14, auto`;

const SENTENCES = [
  "I remember being angry about the small things first.",
  "That he packed his whole room into four boxes like it was nothing.",
  "That he asked me to feed his fish 'just for a while'.",
  "That he picked the one week Dad started feeling worse to tell us he'd already signed the contract, flights booked, no discussion.",
  "I wrote this the night before he left, and I made sure it sounded angry too — about the fish, the boxes, the timing, all of it.",
  "It took me three drafts to admit the real sentence, and even then I buried it in the middle of the page instead of the start.",
  "He came back four years later.",
  "I still haven't given him this.",
  "The last line is in different ink — I added it after he came home, after we still didn't talk about any of it, after I realized some things get too old to say out loud and just become things you keep instead."
]

const MAIN_SENTENCES = SENTENCES.slice(0, -1)
const FINAL_LINE = SENTENCES[SENTENCES.length - 1]
const FINAL_INK_COLOR = '#6f88c9'

function LetterText({ sentences, visibleSentences, color = 'white', y = 0, onHeightChange }) {
  const [displayedText, setDisplayedText] = useState('')

  const targetText = sentences
    .slice(0, visibleSentences)
    .join(' ')

  useEffect(() => {
    let i = displayedText.length

    if (i > targetText.length) {
      i = 0
    }

    const interval = setInterval(() => {
      i++
      setDisplayedText(targetText.slice(0, i))

      if (i >= targetText.length) {
        clearInterval(interval)
      }
    }, 4)

    return () => clearInterval(interval)
  }, [targetText, visibleSentences])

  return (
    <Billboard position={[0, 1.7 - y, 0]}>
      <Text
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="top"
        maxWidth={10}
        lineHeight={1.4}
        font={TIMES_FONT}
        onSync={(mesh) => {
          if (!onHeightChange) return
          const bounds = mesh.textRenderInfo?.blockBounds
          if (bounds) onHeightChange(Math.abs(bounds[3] - bounds[1]))
        }}
      >
        {displayedText}
      </Text>
    </Billboard>
  )
}

export default function LetterMemory({ title }) {
  const [index, setIndex] = useState(-1)
  const [mainHeight, setMainHeight] = useState(0)

  const advanceSentence = () => {
    setIndex((i) =>
      Math.min(i + 1, SENTENCES.length - 1)
    )
  }

  const handleBackgroundClick = (e) => {
    e.stopPropagation()
    advanceSentence()
  }

  useEffect(() => {
    document.body.style.cursor = PENCIL_CURSOR

    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <group>

      {/* Title */}
      <Billboard>
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          font={TIMES_FONT}
        >
          {title}
        </Text>

        {index === -1 && (
            <Text
            position={[0, 1.05, 0]}
            fontSize={0.16}
            color="#c9a86a"
            anchorX="center"
            font={TIMES_FONT}
            >
            Click the fish to read
            </Text>
        )}
      </Billboard>

      {index >= 0 && (
      <LetterText
          sentences={MAIN_SENTENCES}
          visibleSentences={Math.min(index + 1, MAIN_SENTENCES.length)}
          onHeightChange={setMainHeight}
      />
      )}

    {index >= SENTENCES.length - 1 && (
      <LetterText
          sentences={[FINAL_LINE]}
          visibleSentences={1}
          color={FINAL_INK_COLOR}
          y={mainHeight + 0.3}
      />
      )}

      {/* Table + imported 3D Goldfish */}
      <group position={[0, -2.4, 0]} scale={1.7}>

        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.08, 32]} />
          <meshStandardMaterial
            color="#5a3d2b"
            roughness={0.6}
          />
        </mesh>

        <mesh
          position={[0, -0.5, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.12, 0.16, 0.9, 16]}
          />
          <meshStandardMaterial
            color="#3d2b1f"
            roughness={0.7}
          />
        </mesh>

        {/* Imported 3D fish */}
        <Goldfish
          position={[0, 0.1, 0]}
          scale={1.7}
          onPress={advanceSentence}
        />

      </group>
    </group>
  )
}