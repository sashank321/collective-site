import { Object3DNode } from '@react-three/fiber'
import { PlanetMaterial } from './canvas/shaders/PlanetMaterial'
import { AtmosphereMaterial } from './canvas/shaders/AtmosphereMaterial'

declare module '@react-three/fiber' {
    interface ThreeElements {
        planetMaterial: Object3DNode<any, typeof PlanetMaterial>
        atmosphereMaterial: Object3DNode<any, typeof AtmosphereMaterial>
    }
}
