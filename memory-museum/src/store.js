import { create } from 'zustand'

export const useMemoryStore = create((set) => ({
  activeMemory: null,       // 'book' | 'journal' | 'letter' | 'photo' | null
  isTransitioning: false,
  setActiveMemory: (id) => set({ activeMemory: id, isTransitioning: true }),
  finishTransition: () => set({ isTransitioning: false }),
  exitMemory: () => set({ activeMemory: null, isTransitioning: false }),
}))