import { CollectiveSystem } from './CollectiveSystem'
import { ParticleField } from './ParticleField'
import { MemoryField } from './MemoryField'

export const Scene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <ParticleField />
            <CollectiveSystem />
            <MemoryField />
        </>
    )
}
