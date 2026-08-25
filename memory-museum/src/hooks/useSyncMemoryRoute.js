import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMemoryStore } from '../stores/useMemoryStore'

export function useSyncMemoryRoute() {
  const navigate = useNavigate()
  const { memoryId } = useParams()
  const activeMemory = useMemoryStore((s) => s.activeMemory)
  const setActiveMemory = useMemoryStore((s) => s.setActiveMemory)
  const closeMemory = useMemoryStore((s) => s.closeMemory)
  const introComplete = useMemoryStore((s) => s.introComplete)
  const didInit = useRef(false)

  // deep link on load: /memory/record -> store (once, after intro)
  useEffect(() => {
    if (didInit.current || !introComplete) return
    didInit.current = true
    if (memoryId && memoryId !== activeMemory) setActiveMemory(memoryId)
  }, [introComplete])

  // store -> URL, whenever the object clicked changes
  useEffect(() => {
    if (!didInit.current) return
    navigate(activeMemory ? `/memory/${activeMemory}` : '/')
  }, [activeMemory])

  // browser back/forward -> store
  useEffect(() => {
    if (!didInit.current) return
    if (!memoryId && activeMemory) closeMemory()
    else if (memoryId && memoryId !== activeMemory) setActiveMemory(memoryId)
  }, [memoryId])
}