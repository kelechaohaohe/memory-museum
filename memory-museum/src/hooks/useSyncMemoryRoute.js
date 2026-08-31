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
  const skipNextSync = useRef(false) 

  useEffect(() => {
    if (didInit.current || !introComplete) return
    didInit.current = true
    if (memoryId && memoryId !== activeMemory) {
      skipNextSync.current = true
      setActiveMemory(memoryId)
    }
  }, [introComplete])

  useEffect(() => {
    if (!didInit.current) return
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
   navigate(activeMemory ? `/${activeMemory}` : '/')
  }, [activeMemory])

  useEffect(() => {
    if (!didInit.current) return
    if (!memoryId && activeMemory) closeMemory()
    else if (memoryId && memoryId !== activeMemory) setActiveMemory(memoryId)
  }, [memoryId])
}