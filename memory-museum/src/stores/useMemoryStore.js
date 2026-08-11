import { create } from 'zustand'

export const useMemoryStore = create((set, get) => ({
  activeMemory: null,       // 'book' | 'record' | 'letter' | 'photo' | null
  hoveredObject: null,
  isTransitioning: false,
  introComplete: false,

  setHoveredObject: (id) => set({ hoveredObject: id }),

  setActiveMemory: (id) => {
    const { isTransitioning, activeMemory } = get();
    
    // ignore click in middle of transition
    if (isTransitioning || activeMemory === id) return;
    set({ isTransitioning: true, activeMemory: id });
  },

  closeMemory: () => {
    const { isTransitioning } = get();
    if (isTransitioning) return;
    set({ isTransitioning: true, activeMemory: null });
  },

  finishTransition: () => set({ isTransitioning: false }),
  completeIntro: () => set({ introComplete: true }),
}));