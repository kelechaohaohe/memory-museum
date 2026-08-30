import { useState, useEffect } from 'react'
import { Text, Billboard } from '@react-three/drei'
import { MEMORY_CONFIG } from '../libs/memoryConfig'

const BOOK_ANCHOR = MEMORY_CONFIG.book.position

const TIMES_FONT =
  'https://cdn.jsdelivr.net/fontsource/fonts/tinos@latest/latin-400-normal.ttf'

const PENCIL_CURSOR =
  `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M19.4 4.6a2 2 0 0 1 2.8 2.8l-1.4 1.4-2.8-2.8 1.4-1.4zm-2.8 2.8l2.8 2.8-9.2 9.2-3.5.7.7-3.5 9.2-9.2z" fill="%23f4ead1" stroke="%23c9a86a" stroke-width="0.6"/></svg>') 14 14, auto`;

const SENTENCES = [
  "Half the entries just... stop. Mid-thought, mid-word sometimes.",
  "I used to write every night at eleven, no matter what, like it was a debt I owed the day.",
  "Then somewhere around March there's a page that just says",
  "'can't…'",
  "When I pick it back up in May, I don't explain the gap. I just keep going, like the six weeks didn't happen.",
  "I used to be embarrassed by that blank space.",
  "Now I think it's the most honest part of the whole book — proof that some months don't get to be written down, and that's allowed.",
]

export default function BookMemory({ title, onMemoryBlur }) {
  const [index, setIndex] = useState(-1)
  const [displayedText, setDisplayedText] = useState('')

  const handleClick = (e) => {
    e.stopPropagation()
    setIndex((i) => Math.min(i + 1, SENTENCES.length - 1))
  }

  const targetText = SENTENCES.slice(0, index + 1).join(' ')

  useEffect(() => {
    document.body.style.cursor = PENCIL_CURSOR

    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

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
    }, index === 3 ? 80 : 25)

    return () => clearInterval(interval)
  }, [targetText, index])

  useEffect(() => {
    if (index === 3) {
        onMemoryBlur(true)

        const timer = setTimeout(() => {
        onMemoryBlur(false)
        }, 1200)

        return () => clearTimeout(timer)
    }
  }, [index, onMemoryBlur])

  return (
    <group position={BOOK_ANCHOR} onClick={handleClick}>
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <pointLight position={[0, 0.4, 1.5]} intensity={1.2} color="#ffe9c7" />

      <Billboard>
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          font={TIMES_FONT}
        >
          {title}
        </Text>
        <Text
            position={[0, 1.6, 0]}
            fontSize={0.22}
            color="white"
            anchorX="center"
            anchorY="top"
            maxWidth={7}
            lineHeight={1.4}
            font={TIMES_FONT}
            >
            {displayedText}
        </Text>

      </Billboard>
    </group>
  )
}