import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

export const AtmosphereMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0.4, 0.6, 1.0),
        uSunDirection: new THREE.Vector3(1, 0, 0),
        uPower: 4.0,
        uIntensity: 1.0
    },
    // Vertex Shader
    `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    // Fragment Shader
    `
    uniform vec3 uColor;
    uniform vec3 uSunDirection;
    uniform float uPower;
    uniform float uIntensity;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Intensity based on view angle (Grazing angle = higher intensity)
      float viewDot = dot(normal, viewDir);
      float intensity = pow(0.6 - dot(normal, viewDir), uPower);
      
      // Sun mask: Atmosphere should be brighter on the sun side
      float sunDot = dot(normal, uSunDirection);
      float sunMask = smoothstep(-0.5, 0.5, sunDot);

      // Combine
      vec3 finalColor = uColor * intensity * uIntensity;
      finalColor *= (0.5 + 0.5 * sunMask); // subtle dimming on dark side

      gl_FragColor = vec4(finalColor, intensity);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
)

extend({ AtmosphereMaterial })
