export interface Member {
    id: string
    name: string // "The Architect", "The Muse", etc.
    trait: string
    obsession: string
    color: string
}

export const members: Member[] = [
    { id: '01', name: 'The Architect', trait: 'Structural', obsession: 'Entropy', color: '#ff4b4b' },
    { id: '02', name: 'The Muse', trait: 'Ethereal', obsession: 'Silence', color: '#4b9eff' },
    { id: '03', name: 'The Ghost', trait: 'Invisible', obsession: 'Memory', color: '#ffffff' },
    { id: '04', name: 'The Signal', trait: 'Resonant', obsession: 'Frequency', color: '#ffd04b' },
    { id: '05', name: 'The Void', trait: 'Absorbent', obsession: 'Nothingness', color: '#1a1a1a' },
    { id: '06', name: 'The Kinetic', trait: 'Restless', obsession: 'Velocity', color: '#ff8a4b' },
    { id: '07', name: 'The Observer', trait: 'Static', obsession: 'perception', color: '#4bff8a' },
    { id: '08', name: 'The Cryptic', trait: 'Encoded', obsession: 'Patterns', color: '#b44bff' },
    { id: '09', name: 'The Echo', trait: 'Recursive', obsession: 'Delay', color: '#4bffff' },
    { id: '10', name: 'The Anchor', trait: 'Heavy', obsession: 'Gravity', color: '#555555' },
    { id: '11', name: 'The Spark', trait: 'Volatile', obsession: 'Ignition', color: '#ff4b8a' },
    { id: '12', name: 'The Weaver', trait: 'Connected', obsession: 'Threads', color: '#b4ff4b' },
]
