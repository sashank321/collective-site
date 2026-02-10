import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

export const PlanetMaterial = shaderMaterial(
    {
        uSunDirection: new THREE.Vector3(1, 0, 0),
        uDayMap: null,
        uNightMap: null,
        uNormalMap: null,
        uRoughnessMap: null,
        uCloudMap: null,
        uTime: 0
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    // Fragment Shader
    `
    uniform vec3 uSunDirection;
    uniform sampler2D uDayMap;
    uniform sampler2D uNightMap;
    // uniform sampler2D uNormalMap;
    // uniform sampler2D uRoughnessMap;
    // uniform sampler2D uCloudMap;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Day/Night Mixing
      float sunOrientation = dot(normal, uSunDirection);
      float dayMix = smoothstep(-0.25, 0.25, sunOrientation);

      vec3 dayColor = texture2D(uDayMap, vUv).rgb;
      vec3 nightColor = texture2D(uNightMap, vUv).rgb;
      
      // City lights only on night side
      // Boost night lights intensity
      nightColor *= 2.0; 
      
      vec3 color = mix(nightColor, dayColor, dayMix);

      // Fresnel Rim (Atmosphere interaction)
      float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
      // Add blueish atmospheric haze on limb
      vec3 atmosphereColor = vec3(0.4, 0.6, 1.0);
      color += atmosphereColor * fresnel * 0.5 * dayMix; // Only visible on day side

      gl_FragColor = vec4(color, 1.0);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
)

extend({ PlanetMaterial })
