import { create } from 'zustand'

interface AppState {
  phase: 'loading' | 'entry' | 'collective'
  setPhase: (phase: 'loading' | 'entry' | 'collective') => void

  hoveredNode: string | null
  setHoveredNode: (id: string | null) => void

  cursorSpeed: number
  setCursorSpeed: (speed: number) => void

  scrollSpeed: number
  setScrollSpeed: (speed: number) => void

  traversalState: 'launch' | 'orbit' | 'warp' | 'drift'
  setTraversalState: (state: 'launch' | 'orbit' | 'warp' | 'drift') => void

  traversalProgress: number
  setTraversalProgress: (progress: number) => void

  monolithPosition: [number, number]
}

export const useStore = create<AppState>((set) => ({
  phase: 'loading',
  setPhase: (phase) => set({ phase }),

  hoveredNode: null,
  setHoveredNode: (id) => set({ hoveredNode: id }),

  cursorSpeed: 0,
  setCursorSpeed: (speed) => set({ cursorSpeed: speed }),

  scrollSpeed: 0,
  setScrollSpeed: (speed) => set({ scrollSpeed: speed }),

  traversalState: 'launch',
  setTraversalState: (state) => set({ traversalState: state }),

  traversalProgress: 0,
  setTraversalProgress: (progress) => set({ traversalProgress: progress }),
  monolithPosition: [0, 0]
}))
