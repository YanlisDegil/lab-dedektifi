import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// 1. REALISTIC MITOCHONDRIA WITH INNER FOLDED CRISTAE
// ============================================================
export function Mitochondria({ position, rotation = [0, 0, 0], scale = 0.38, isSelected, onClick }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.025
    }
  })

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('mitochondria')
      }}
    >
      {/* Outer Membrane (Smooth bean capsule) */}
      <mesh>
        <capsuleGeometry args={[0.38, 0.9, 16, 32]} />
        <meshPhysicalMaterial
          color={isSelected ? '#fb7185' : '#f43f5e'}
          emissive={isSelected ? '#e11d48' : '#be123c'}
          emissiveIntensity={isSelected ? 1.0 : 0.4}
          roughness={0.25}
          transmission={0.4}
          opacity={0.85}
          transparent
        />
      </mesh>

      {/* Inner Membrane Folded Cristae (Realistic shelf layers) */}
      {[-0.35, -0.18, 0, 0.18, 0.35].map((y, i) => (
        <group key={i} position={[i % 2 === 0 ? 0.06 : -0.06, y, 0]}>
          <mesh rotation={[0, 0, i % 2 === 0 ? 0.2 : -0.2]}>
            <boxGeometry args={[0.48, 0.05, 0.38]} />
            <meshStandardMaterial
              color="#fda4af"
              emissive="#f43f5e"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Mitochondrial Matrix core */}
      <mesh>
        <capsuleGeometry args={[0.3, 0.8, 12, 16]} />
        <meshStandardMaterial color="#881337" roughness={0.5} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// ============================================================
// 2. REALISTIC CHLOROPLAST WITH THYLAKOID GRANA DISCS
// ============================================================
export function Chloroplast({ position, rotation = [0, 0, 0], scale = 0.42, isSelected, onClick }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4 + position[0]) * 0.02
    }
  })

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('chloroplast')
      }}
    >
      {/* Outer Double-Membrane Oval Lens */}
      <mesh scale={[1.3, 0.65, 0.9]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshPhysicalMaterial
          color={isSelected ? '#34d399' : '#059669'}
          emissive={isSelected ? '#10b981' : '#047857'}
          emissiveIntensity={isSelected ? 1.0 : 0.45}
          roughness={0.2}
          transmission={0.45}
          opacity={0.88}
          transparent
        />
      </mesh>

      {/* Multiple Thylakoid Grana Stacks (Green Coin Piles) */}
      {[
        [-0.32, 0, 0.1],
        [-0.1, 0.05, -0.15],
        [0.15, -0.05, 0.15],
        [0.35, 0, -0.1],
      ].map((pos, stackIdx) => (
        <group key={stackIdx} position={pos}>
          {[-0.08, -0.03, 0.02, 0.07].map((y, discIdx) => (
            <mesh key={discIdx} position={[0, y, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.025, 14]} />
              <meshStandardMaterial
                color="#86efac"
                emissive="#10b981"
                emissiveIntensity={0.8}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Stroma Lamellae Connecting Wires */}
      <mesh position={[0, 0, 0]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
        <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// ============================================================
// 3. GOLGI APPARATUS WITH SECRETORY VESICLES
// ============================================================
export function GolgiApparatus({ position = [1.2, 0.4, 0.5], isSelected, onClick }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('golgiApparatus')
      }}
    >
      {/* 5 Stacked Crescent Cisternae */}
      {[
        { y: -0.22, r: 0.38, w: 0.06, c: '#f59e0b' },
        { y: -0.11, r: 0.46, w: 0.065, c: '#fbbf24' },
        { y: 0.0, r: 0.52, w: 0.07, c: '#fcd34d' },
        { y: 0.11, r: 0.48, w: 0.065, c: '#fbbf24' },
        { y: 0.22, r: 0.4, w: 0.06, c: '#f59e0b' },
      ].map((cist, idx) => (
        <mesh key={idx} position={[0, cist.y, 0]} rotation={[0.25, 0.4, 0]}>
          <torusGeometry args={[cist.r, cist.w, 14, 28, Math.PI * 1.3]} />
          <meshStandardMaterial
            color={isSelected ? '#fef08a' : cist.c}
            emissive={isSelected ? '#f59e0b' : '#b45309'}
            emissiveIntensity={isSelected ? 1.0 : 0.4}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Secretory Transport Vesicles */}
      {[
        [0.45, 0.3, 0.2],
        [-0.35, -0.25, 0.15],
        [0.55, -0.1, -0.2],
        [0.2, 0.35, -0.3],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// 4. ENDOPLASMIC RETICULUM (ROUGH WITH RIBOSOMES)
// ============================================================
export function EndoplasmicReticulum({ isSelected, onClick }) {
  return (
    <group
      position={[-0.8, -0.2, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('roughER')
      }}
    >
      {[-0.28, 0, 0.28].map((z, idx) => (
        <group key={idx} position={[0, 0, z]} rotation={[0, 0, idx * 0.25]}>
          <mesh>
            <torusGeometry args={[0.75 + idx * 0.16, 0.07, 14, 28, Math.PI * 1.15]} />
            <meshStandardMaterial
              color={isSelected ? '#c084fc' : '#a855f7'}
              emissive={isSelected ? '#9333ea' : '#6b21a8'}
              emissiveIntensity={isSelected ? 0.9 : 0.35}
              roughness={0.3}
            />
          </mesh>
          {/* Ribosome Granules */}
          {Array.from({ length: 10 }).map((_, rIdx) => {
            const angle = (rIdx / 10) * Math.PI * 1.15
            const r = 0.75 + idx * 0.16
            return (
              <mesh key={rIdx} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.07]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={1} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

// ============================================================
// 5. CENTRIOLES (9 MICROTUBULE TRIPLETS)
// ============================================================
export function Centrioles({ position = [1.2, 1.2, -0.5], isSelected, onClick }) {
  return (
    <group
      position={position}
      scale={0.75}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('centriole')
      }}
    >
      {/* Centriole Cylinder 1 */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18]}>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          )
        })}
      </group>

      {/* Centriole Cylinder 2 (Perpendicular at 90°) */}
      <group position={[0.25, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18]}>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// ============================================================
// 6. ANIMAL CELL FULL 3D MODEL
// ============================================================
export function AnimalCell({ selectedOrganelle, onSelectOrganelle }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer Cell Membrane - Cutaway Open View */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('cellMembrane')
        }}
      >
        <sphereGeometry args={[2.6, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.82]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          transparent
          opacity={selectedOrganelle === 'cellMembrane' ? 0.6 : 0.25}
          roughness={0.1}
          transmission={0.85}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dense Nucleus with Cutaway Window */}
      <group
        position={[-0.2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('nucleus')
        }}
      >
        <mesh>
          <sphereGeometry args={[0.95, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
          <meshStandardMaterial
            color={selectedOrganelle === 'nucleus' ? '#818cf8' : '#4f46e5'}
            emissive={selectedOrganelle === 'nucleus' ? '#6366f1' : '#312e81'}
            emissiveIntensity={selectedOrganelle === 'nucleus' ? 0.9 : 0.4}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Nucleolus Core inside */}
        <mesh position={[0.15, 0.1, 0.15]}>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial color="#6366f1" emissive="#4338ca" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Realistic Mitochondria */}
      <Mitochondria
        position={[1.3, -0.7, 0.8]}
        rotation={[0.4, 0.5, 0]}
        isSelected={selectedOrganelle === 'mitochondria'}
        onClick={onSelectOrganelle}
      />
      <Mitochondria
        position={[-1.3, 1.2, 0.5]}
        rotation={[0.8, -0.3, 0.4]}
        isSelected={selectedOrganelle === 'mitochondria'}
        onClick={onSelectOrganelle}
      />
      <Mitochondria
        position={[0.6, 1.4, -0.6]}
        rotation={[-0.5, 0.6, 0.2]}
        isSelected={selectedOrganelle === 'mitochondria'}
        onClick={onSelectOrganelle}
      />

      {/* Endoplasmic Reticulum */}
      <EndoplasmicReticulum
        isSelected={selectedOrganelle === 'roughER'}
        onClick={onSelectOrganelle}
      />

      {/* Golgi Apparatus */}
      <GolgiApparatus
        isSelected={selectedOrganelle === 'golgiApparatus'}
        onClick={onSelectOrganelle}
      />

      {/* Centrioles */}
      <Centrioles
        isSelected={selectedOrganelle === 'centriole'}
        onClick={onSelectOrganelle}
      />

      {/* Lysosomes */}
      {[
        [-1.4, -1.0, 0.8],
        [1.6, 0.2, -0.8],
        [-0.4, 1.6, 0.4],
      ].map((pos, idx) => (
        <mesh
          key={idx}
          position={pos}
          onClick={(e) => {
            e.stopPropagation()
            onSelectOrganelle('lysosome')
          }}
        >
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={selectedOrganelle === 'lysosome' ? '#fb923c' : '#ea580c'}
            emissive={selectedOrganelle === 'lysosome' ? '#f97316' : '#9a3412'}
            emissiveIntensity={selectedOrganelle === 'lysosome' ? 1.0 : 0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// 7. REALISTIC HEXAGONAL PLANT CELL WITH GIANT CENTRAL VACUOLE
// ============================================================
export function PlantCell({ selectedOrganelle, onSelectOrganelle }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* REALISTIC HEXAGONAL PRISM CELL WALL (Not a plain cube!) */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('cellWall')
        }}
      >
        <cylinderGeometry args={[2.5, 2.5, 3.2, 6, 1, true]} />
        <meshPhysicalMaterial
          color="#047857"
          transparent
          opacity={selectedOrganelle === 'cellWall' ? 0.75 : 0.35}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Thick Green Cellulose Framework Edges */}
      <mesh>
        <cylinderGeometry args={[2.52, 2.52, 0.1, 6]} position={[0, 1.6, 0]} />
        <meshStandardMaterial color="#065f46" roughness={0.3} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[2.52, 2.52, 0.1, 6]} position={[0, -1.6, 0]} />
        <meshStandardMaterial color="#065f46" roughness={0.3} />
      </mesh>

      {/* GIANT CENTRAL VACUOLE (Occupies 70% of Plant Cell Interior) */}
      <mesh
        position={[0.2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('centralVacuole')
        }}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={selectedOrganelle === 'centralVacuole' ? 0.6 : 0.15}
          transparent
          opacity={selectedOrganelle === 'centralVacuole' ? 0.85 : 0.45}
          roughness={0.05}
          transmission={0.88}
        />
      </mesh>

      {/* Displaced Nucleus pushed against the cell wall by the vacuole */}
      <mesh
        position={[-1.4, 0.7, 0.4]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('nucleus')
        }}
      >
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial
          color={selectedOrganelle === 'nucleus' ? '#818cf8' : '#4f46e5'}
          emissive="#312e81"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Chloroplasts circling the periphery */}
      <Chloroplast
        position={[-1.4, -0.8, 0.6]}
        rotation={[0.3, 0.4, 0]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />
      <Chloroplast
        position={[1.4, 0.9, -0.5]}
        rotation={[-0.4, 0.2, 0.5]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />
      <Chloroplast
        position={[1.3, -0.9, 0.5]}
        rotation={[0.2, -0.5, 0.1]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />
      <Chloroplast
        position={[-0.8, 1.2, -0.7]}
        rotation={[0.6, 0.1, -0.3]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />

      {/* Mitochondria */}
      <Mitochondria
        position={[-0.4, -1.2, 0.8]}
        rotation={[0, 0.5, 0]}
        scale={0.3}
        isSelected={selectedOrganelle === 'mitochondria'}
        onClick={onSelectOrganelle}
      />
    </group>
  )
}

// ============================================================
// 8. DETAILED NUCLEUS ARCHITECTURE
// ============================================================
export function NucleusStructureDetail() {
  return (
    <group>
      {/* Double-Membrane Nuclear Envelope Cutaway */}
      <mesh>
        <sphereGeometry args={[2.0, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshStandardMaterial
          color="#4f46e5"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          roughness={0.3}
        />
      </mesh>

      {/* Dense Nucleolus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#4338ca"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Nuclear Pores */}
      {Array.from({ length: 14 }).map((_, i) => {
        const phi = (i / 14) * Math.PI
        const theta = (i / 14) * Math.PI * 1.5
        const x = 2.0 * Math.sin(phi) * Math.cos(theta)
        const y = 2.0 * Math.sin(phi) * Math.sin(theta)
        const z = 2.0 * Math.cos(phi)
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <torusGeometry args={[0.15, 0.035, 8, 16]} />
              <meshStandardMaterial color="#c7d2fe" emissive="#818cf8" emissiveIntensity={0.9} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ============================================================
// 9. MULTI-CYCLE SUCCESSIVE MITOSIS CELL DIVISION (1 → 2 → 4 → 8)
// ============================================================
export function MultiCellMitosisScene({
  cellCount = 1, // 1, 2, 4, 8
  divisionProgress = 0, // 0 (parent) to 1 (two daughter cells)
}) {
  // Generate cell positions based on count
  const cells = useMemo(() => {
    if (cellCount === 1) return [{ x: 0, y: 0, scale: 1.4 }]
    if (cellCount === 2) {
      return [
        { x: -1.2, y: 0, scale: 1.0 },
        { x: 1.2, y: 0, scale: 1.0 },
      ]
    }
    if (cellCount === 4) {
      return [
        { x: -1.2, y: 1.0, scale: 0.75 },
        { x: 1.2, y: 1.0, scale: 0.75 },
        { x: -1.2, y: -1.0, scale: 0.75 },
        { x: 1.2, y: -1.0, scale: 0.75 },
      ]
    }
    // 8 Cells
    return [
      { x: -2.0, y: 1.0, scale: 0.55 },
      { x: -0.7, y: 1.0, scale: 0.55 },
      { x: 0.7, y: 1.0, scale: 0.55 },
      { x: 2.0, y: 1.0, scale: 0.55 },
      { x: -2.0, y: -1.0, scale: 0.55 },
      { x: -0.7, y: -1.0, scale: 0.55 },
      { x: 0.7, y: -1.0, scale: 0.55 },
      { x: 2.0, y: -1.0, scale: 0.55 },
    ]
  }, [cellCount])

  return (
    <group position={[0, 0, 0]}>
      {cells.map((cell, idx) => (
        <DividingCellUnit
          key={idx}
          position={[cell.x, cell.y, 0]}
          scale={cell.scale}
          progress={divisionProgress}
        />
      ))}
    </group>
  )
}

function DividingCellUnit({ position, scale, progress }) {
  // progress 0: spherical single cell
  // progress 0.5: elongated with cleavage furrow (pinching)
  // progress 1: two fully separated daughter cells
  const pinch = Math.sin(progress * Math.PI) * 0.4
  const separation = progress * 0.9

  return (
    <group position={position} scale={scale}>
      {/* Upper/Left Daughter Pole */}
      <group position={[-separation * 0.5, 0, 0]}>
        <mesh scale={[1.0 + pinch * 0.3, 1.0 - pinch * 0.2, 1.0 - pinch * 0.2]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            emissive="#6d28d9"
            emissiveIntensity={0.35}
            transparent
            opacity={0.4}
            roughness={0.2}
          />
        </mesh>
        {/* Nucleus */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#4f46e5" emissive="#3730a3" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Lower/Right Daughter Pole (Appears as cell cleaves) */}
      {progress > 0.1 && (
        <group position={[separation * 0.5, 0, 0]}>
          <mesh scale={[1.0 + pinch * 0.3, 1.0 - pinch * 0.2, 1.0 - pinch * 0.2]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshPhysicalMaterial
              color="#8b5cf6"
              emissive="#6d28d9"
              emissiveIntensity={0.35}
              transparent
              opacity={0.4}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#4f46e5" emissive="#3730a3" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  )
}
