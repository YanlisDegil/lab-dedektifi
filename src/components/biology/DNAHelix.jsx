import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'

export function DNAHelix({
  length = 24, // number of base pairs
  radius = 0.9,
  pitch = 0.28,
  unzipProgress = 0, // 0 (connected) to 1 (fully separated)
  speed = 0.5,
  onSelectBase,
}) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed
    }
  })

  // Pairs data: A-T, G-C sequence
  const sequence = useMemo(() => {
    const pairs = [
      { name1: 'Adenin (A)', name2: 'Timin (T)', color1: '#ef4444', color2: '#3b82f6', bonds: 2 },
      { name1: 'Guanin (G)', name2: 'Sitozin (C)', color1: '#10b981', color2: '#f59e0b', bonds: 3 },
      { name1: 'Timin (T)', name2: 'Adenin (A)', color1: '#3b82f6', color2: '#ef4444', bonds: 2 },
      { name1: 'Sitozin (C)', name2: 'Guanin (G)', color1: '#f59e0b', color2: '#10b981', bonds: 3 },
      { name1: 'Adenin (A)', name2: 'Timin (T)', color1: '#ef4444', color2: '#3b82f6', bonds: 2 },
      { name1: 'Guanin (G)', name2: 'Sitozin (C)', color1: '#10b981', color2: '#f59e0b', bonds: 3 },
    ]
    return Array.from({ length }, (_, i) => pairs[i % pairs.length])
  }, [length])

  // Backbone 1 and 2 points
  const { curve1, curve2, pairPositions } = useMemo(() => {
    const pts1 = []
    const pts2 = []
    const pairs = []

    for (let i = 0; i < length; i++) {
      const angle = i * 0.5
      const y = (i - length / 2) * pitch
      // Unzip shift
      const separation = unzipProgress * 1.5

      const x1 = Math.cos(angle) * (radius + separation)
      const z1 = Math.sin(angle) * (radius + separation)

      const x2 = Math.cos(angle + Math.PI) * (radius + separation)
      const z2 = Math.sin(angle + Math.PI) * (radius + separation)

      pts1.push(new THREE.Vector3(x1, y, z1))
      pts2.push(new THREE.Vector3(x2, y, z2))

      pairs.push({
        p1: new THREE.Vector3(x1, y, z1),
        p2: new THREE.Vector3(x2, y, z2),
        angle,
        y,
      })
    }

    return {
      curve1: new THREE.CatmullRomCurve3(pts1),
      curve2: new THREE.CatmullRomCurve3(pts2),
      pairPositions: pairs,
    }
  }, [length, radius, pitch, unzipProgress])

  return (
    <group ref={groupRef}>
      {/* Backbone Strand 1 (Sugar-Phosphate) */}
      <mesh>
        <tubeGeometry args={[curve1, 64, 0.05, 8, false]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Backbone Strand 2 (Sugar-Phosphate) */}
      <mesh>
        <tubeGeometry args={[curve2, 64, 0.05, 8, false]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Base Pairs & Hydrogen Bonds */}
      {pairPositions.map((pair, idx) => {
        const info = sequence[idx]
        const separation = unzipProgress * 0.7
        const mid = new THREE.Vector3().lerpVectors(pair.p1, pair.p2, 0.5)

        // Half 1
        const mid1 = new THREE.Vector3().lerpVectors(pair.p1, mid, 0.5)
        const dir1 = new THREE.Vector3().subVectors(mid, pair.p1)
        const len1 = dir1.length()

        // Half 2
        const mid2 = new THREE.Vector3().lerpVectors(mid, pair.p2, 0.5)
        const dir2 = new THREE.Vector3().subVectors(pair.p2, mid)
        const len2 = dir2.length()

        return (
          <group key={idx}>
            {/* Base 1 */}
            <mesh
              position={[mid1.x - separation * Math.cos(pair.angle), mid1.y, mid1.z - separation * Math.sin(pair.angle)]}
              quaternion={new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                dir1.clone().normalize()
              )}
              onClick={() => onSelectBase && onSelectBase(info.name1, info.color1)}
            >
              <cylinderGeometry args={[0.035, 0.035, len1 * 0.9, 12]} />
              <meshStandardMaterial
                color={info.color1}
                emissive={info.color1}
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* Base 2 */}
            <mesh
              position={[mid2.x + separation * Math.cos(pair.angle), mid2.y, mid2.z + separation * Math.sin(pair.angle)]}
              quaternion={new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                dir2.clone().normalize()
              )}
              onClick={() => onSelectBase && onSelectBase(info.name2, info.color2)}
            >
              <cylinderGeometry args={[0.035, 0.035, len2 * 0.9, 12]} />
              <meshStandardMaterial
                color={info.color2}
                emissive={info.color2}
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* Hydrogen Bonds (small spheres when connected) */}
            {unzipProgress < 0.3 && (
              <mesh position={mid}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}
