import { create } from 'zustand'

interface AppState {
    phase: 'entry' | 'collective' | 'detail' | 'dissolution'
    setPhase: (phase: AppState['phase']) => void

    hoveredNode: string | null
    setHoveredNode: (id: string | null) => void

    cursorSpeed: number
    setCursorSpeed: (speed: number) => void

    scrollSpeed: number
    setScrollSpeed: (speed: number) => void

    // Physics params
    attractionStrength: number
    repulsionStrength: number
}

export const useStore = create<AppState>((set) => ({
    phase: 'entry',
    setPhase: (phase) => set({ phase }),

    hoveredNode: null,
    setHoveredNode: (id) => set({ hoveredNode: id }),

    cursorSpeed: 0,
    setCursorSpeed: (speed) => set({ cursorSpeed: speed }),

    scrollSpeed: 0,
    setScrollSpeed: (speed) => set({ scrollSpeed: speed }),

    attractionStrength: 0.5,
    repulsionStrength: 1.0,
}))
