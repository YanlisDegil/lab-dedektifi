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

      {/* Folded Cristae Ridges */}
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

      {/* Thylakoid Stacks */}
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
    </group>
  )
}

// ============================================================
// 3. GOLGI APPARATUS
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

      {[
        [0.45, 0.3, 0.2],
        [-0.35, -0.25, 0.15],
        [0.55, -0.1, -0.2],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// 4. ENDOPLASMIC RETICULUM
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
// 5. CENTRIOLES
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

      {/* Nucleus */}
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
        <mesh position={[0.15, 0.1, 0.15]}>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial color="#6366f1" emissive="#4338ca" emissiveIntensity={0.8} />
        </mesh>
      </group>

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

      <EndoplasmicReticulum
        isSelected={selectedOrganelle === 'roughER'}
        onClick={onSelectOrganelle}
      />
      <GolgiApparatus
        isSelected={selectedOrganelle === 'golgiApparatus'}
        onClick={onSelectOrganelle}
      />
      <Centrioles
        isSelected={selectedOrganelle === 'centriole'}
        onClick={onSelectOrganelle}
      />

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
// 7. REALISTIC HEXAGONAL PLANT CELL
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
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[2.52, 2.52, 0.1, 6]} />
        <meshStandardMaterial color="#065f46" roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[2.52, 2.52, 0.1, 6]} />
        <meshStandardMaterial color="#065f46" roughness={0.3} />
      </mesh>

      {/* Central Vacuole */}
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

      {/* Nucleus */}
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

      {/* Chloroplasts */}
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
// 8. RICH, DETAILED 3D NUCLEUS ARCHITECTURE (CUTAWAY WITH PORES & CHROMATIN)
// ============================================================
export function NucleusStructureDetail() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
    }
  })

  // Procedural chromatin DNA loops
  const chromatinCurves = useMemo(() => {
    const list = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const pts = []
      for (let s = 0; s <= 20; s++) {
        const t = s / 20
        const r = 0.5 + Math.sin(t * Math.PI) * 0.9
        const x = Math.cos(angle + t * 2) * r
        const y = (t - 0.5) * 1.8 + Math.sin(t * 8) * 0.15
        const z = Math.sin(angle + t * 2) * r
        pts.push(new THREE.Vector3(x, y, z))
      }
      list.push(new THREE.CatmullRomCurve3(pts))
    }
    return list
  }, [])

  return (
    <group ref={groupRef}>
      {/* Outer Nuclear Envelope Hemisphere Cutaway (Deep Indigo) */}
      <mesh>
        <sphereGeometry args={[2.0, 48, 48, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshStandardMaterial
          color="#4338ca"
          emissive="#312e81"
          emissiveIntensity={0.5}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Nuclear Lamina Fiber Lining */}
      <mesh>
        <sphereGeometry args={[1.94, 36, 36, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshStandardMaterial
          color="#6366f1"
          roughness={0.6}
          wireframe={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nuclear Pore Octamers */}
      {Array.from({ length: 18 }).map((_, i) => {
        const phi = (i / 18) * Math.PI
        const theta = (i / 18) * Math.PI * 1.5
        const x = 2.01 * Math.sin(phi) * Math.cos(theta)
        const y = 2.01 * Math.sin(phi) * Math.sin(theta)
        const z = 2.01 * Math.cos(phi)
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <torusGeometry args={[0.13, 0.035, 12, 18]} />
              <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={1} />
            </mesh>
            {/* Central plug */}
            <mesh>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
          </group>
        )
      })}

      {/* Dense Granular Nucleolus Core (Center) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>

      {/* Coiled Chromatin Fibers Winding in Nucleoplasm */}
      {chromatinCurves.map((curve, idx) => (
        <mesh key={idx}>
          <tubeGeometry args={[curve, 40, 0.03, 8, false]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#ec4899' : '#38bdf8'}
            emissive={idx % 2 === 0 ? '#db2777' : '#0284c7'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// 9. CONTINUOUS SMOOTH MITOSIS ANIMATION (1 → 2 → 4 → 8 CELLS)
// ============================================================
export function MultiCellMitosisScene({
  cellCount = 1,
  divisionProgress = 0,
  isDividing = false,
  currentCycle,
  progress,
}) {
  const cycle = currentCycle !== undefined
    ? currentCycle
    : cellCount === 1
    ? 1
    : cellCount === 2
    ? 2
    : cellCount === 4
    ? 3
    : 4
  const prog = progress !== undefined ? progress : divisionProgress

  // 8 Cells Completed Tissue Stage
  if (cycle >= 4 || cellCount >= 8) {
    return (
      <group position={[0, 0, 0]}>
        {[-1.8, 1.8].map((xBase, colIdx) => (
          <group key={colIdx} position={[xBase, 0, 0]}>
            {[-1.1, 1.1].map((yBase, rowIdx) => (
              <group key={rowIdx} position={[0, yBase, 0]}>
                <CellUnit position={[-0.45, 0, 0]} scale={0.55} />
                <CellUnit position={[0.45, 0, 0]} scale={0.55} />
              </group>
            ))}
          </group>
        ))}
      </group>
    )
  }

  // Cycle 1: 1 cell elongates and splits into 2 cells
  if (cycle === 1) {
    const sep = prog * 1.5
    const pinch = Math.sin(prog * Math.PI) * 0.45

    return (
      <group position={[0, 0, 0]}>
        {/* Left Daughter */}
        <group position={[-sep * 0.5, 0, 0]}>
          <mesh scale={[1.0 + pinch * 0.35, 1.0 - pinch * 0.25, 1.0 - pinch * 0.25]}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshPhysicalMaterial
              color="#8b5cf6"
              emissive="#6d28d9"
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.42, 20, 20]} />
            <meshStandardMaterial color="#4f46e5" emissive="#3730a3" emissiveIntensity={0.7} />
          </mesh>
        </group>

        {/* Right Daughter (emerges smoothly) */}
        {prog > 0.02 && (
          <group position={[sep * 0.5, 0, 0]}>
            <mesh scale={[1.0 + pinch * 0.35, 1.0 - pinch * 0.25, 1.0 - pinch * 0.25]}>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshPhysicalMaterial
                color="#8b5cf6"
                emissive="#6d28d9"
                emissiveIntensity={0.4}
                transparent
                opacity={0.5}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.42, 20, 20]} />
              <meshStandardMaterial color="#4f46e5" emissive="#3730a3" emissiveIntensity={0.7} />
            </mesh>
          </group>
        )}
      </group>
    )
  }

  // Cycle 2: 2 cells split into 4 cells
  if (cycle === 2) {
    const ySep = prog * 1.2
    return (
      <group position={[0, 0, 0]}>
        {/* Left Pair */}
        <group position={[-1.4, 0, 0]}>
          <CellUnit position={[0, ySep * 0.5, 0]} scale={0.8} />
          {prog > 0.05 && <CellUnit position={[0, -ySep * 0.5, 0]} scale={0.8} />}
        </group>
        {/* Right Pair */}
        <group position={[1.4, 0, 0]}>
          <CellUnit position={[0, ySep * 0.5, 0]} scale={0.8} />
          {prog > 0.05 && <CellUnit position={[0, -ySep * 0.5, 0]} scale={0.8} />}
        </group>
      </group>
    )
  }

  // Cycle 3: 4 cells split into 8 cells
  const xSep = prog * 0.9
  return (
    <group position={[0, 0, 0]}>
      {[-1.8, 1.8].map((xBase, colIdx) => (
        <group key={colIdx} position={[xBase, 0, 0]}>
          {[-1.1, 1.1].map((yBase, rowIdx) => (
            <group key={rowIdx} position={[0, yBase, 0]}>
              <CellUnit position={[-xSep * 0.5, 0, 0]} scale={0.55} />
              {prog > 0.05 && <CellUnit position={[xSep * 0.5, 0, 0]} scale={0.55} />}
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

function CellUnit({ position, scale }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={0.4}
          transparent
          opacity={0.55}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#4f46e5" emissive="#3730a3" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}
