import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

// ─── MITOCHONDRIA COMPONENT ───
export function Mitochondria({ position, rotation = [0, 0, 0], scale = 0.35, isSelected, onClick }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.03
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
      {/* Outer capsule membrane */}
      <mesh>
        <capsuleGeometry args={[0.35, 0.8, 16, 32]} />
        <meshStandardMaterial
          color={isSelected ? '#f43f5e' : '#fb7185'}
          emissive={isSelected ? '#e11d48' : '#be123c'}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          roughness={0.4}
        />
      </mesh>
      {/* Inner folds (cristae suggestion) */}
      {[-0.2, 0, 0.2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 16]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// ─── CHLOROPLAST COMPONENT (FOR PLANT CELL) ───
export function Chloroplast({ position, rotation = [0, 0, 0], scale = 0.4, isSelected, onClick }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.8 + position[0]) * 0.02
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
      {/* Oval green chloroplast body */}
      <mesh scale={[1.2, 0.6, 0.8]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial
          color={isSelected ? '#10b981' : '#059669'}
          emissive={isSelected ? '#34d399' : '#047857'}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
          roughness={0.3}
        />
      </mesh>
      {/* Thylakoid stacks (Granum) */}
      {[-0.2, 0.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {[ -0.06, 0, 0.06 ].map((y, j) => (
            <mesh key={j} position={[0, y, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.02, 12]} />
              <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// ─── GOLGI APPARATUS ───
export function GolgiApparatus({ position = [1.2, 0.4, 0.5], isSelected, onClick }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('golgiApparatus')
      }}
    >
      {/* Stack of curved cisternae discs */}
      {[
        { y: -0.2, r: 0.4, col: '#f59e0b' },
        { y: -0.07, r: 0.48, col: '#fbbf24' },
        { y: 0.07, r: 0.52, col: '#fcd34d' },
        { y: 0.2, r: 0.44, col: '#f59e0b' },
      ].map((disc, idx) => (
        <mesh key={idx} position={[0, disc.y, 0]} rotation={[0.2, 0.3, 0]}>
          <torusGeometry args={[disc.r, 0.05, 12, 24, Math.PI * 1.2]} />
          <meshStandardMaterial
            color={isSelected ? '#fbbf24' : disc.col}
            emissive={isSelected ? '#d97706' : '#b45309'}
            emissiveIntensity={isSelected ? 0.8 : 0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Secretory vesicles budding off */}
      {[
        [0.4, 0.3, 0.2],
        [-0.3, -0.3, 0.1],
        [0.5, -0.1, -0.2],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ─── ENDOPLASMIC RETICULUM (ROUGH & SMOOTH) ───
export function EndoplasmicReticulum({ isSelected, onClick }) {
  return (
    <group
      position={[-0.8, -0.2, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('roughER')
      }}
    >
      {/* Wavy sheets hugging nucleus */}
      {[-0.25, 0, 0.25].map((z, idx) => (
        <group key={idx} position={[0, 0, z]} rotation={[0, 0, idx * 0.2]}>
          <mesh>
            <torusGeometry args={[0.7 + idx * 0.15, 0.06, 12, 24, Math.PI * 1.1]} />
            <meshStandardMaterial
              color={isSelected ? '#a855f7' : '#c084fc'}
              emissive={isSelected ? '#7c3aed' : '#581c87'}
              emissiveIntensity={isSelected ? 0.8 : 0.2}
              roughness={0.3}
            />
          </mesh>
          {/* Ribosome dots attached on rough ER */}
          {Array.from({ length: 8 }).map((_, rIdx) => {
            const angle = (rIdx / 8) * Math.PI * 1.1
            const r = 0.7 + idx * 0.15
            return (
              <mesh key={rIdx} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.06]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={1} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

// ─── CENTRIOLES ───
export function Centrioles({ position = [1.2, 1.2, -0.5], isSelected, onClick }) {
  return (
    <group
      position={position}
      scale={0.7}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick('centriole')
      }}
    >
      {/* Cylinder 1 */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.45, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : '#0284c7'}
          emissive={isSelected ? '#0ea5e9' : '#0369a1'}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
        />
      </mesh>
      {/* Perpendicular Cylinder 2 */}
      <mesh position={[0.2, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.45, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : '#0284c7'}
          emissive={isSelected ? '#0ea5e9' : '#0369a1'}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  )
}

// ============================================================
// 1. COMPLETE 3D ANIMAL CELL
// ============================================================
export function AnimalCell({ selectedOrganelle, onSelectOrganelle }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer Cell Membrane (Semi-Transparent sphere cutaway) */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('cellMembrane')
        }}
      >
        <sphereGeometry args={[2.5, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.85]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          transparent
          opacity={selectedOrganelle === 'cellMembrane' ? 0.6 : 0.25}
          roughness={0.1}
          transmission={0.8}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central Nucleus */}
      <group
        position={[-0.2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('nucleus')
        }}
      >
        {/* Nucleus Outer Envelope */}
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color={selectedOrganelle === 'nucleus' ? '#818cf8' : '#4f46e5'}
            emissive={selectedOrganelle === 'nucleus' ? '#6366f1' : '#312e81'}
            emissiveIntensity={selectedOrganelle === 'nucleus' ? 0.8 : 0.4}
            roughness={0.4}
          />
        </mesh>
        {/* Nucleolus inside */}
        <mesh position={[0.2, 0.1, 0.2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#4338ca" emissive="#3730a3" emissiveIntensity={0.8} />
        </mesh>
        {/* Nuclear pores on surface */}
        {Array.from({ length: 16 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 16)
          const theta = Math.sqrt(16 * Math.PI) * phi
          const x = 0.9 * Math.cos(theta) * Math.sin(phi)
          const y = 0.9 * Math.sin(theta) * Math.sin(phi)
          const z = 0.9 * Math.cos(phi)
          return (
            <mesh key={i} position={[x, y, z]}>
              <circleGeometry args={[0.05, 8]} />
              <meshBasicMaterial color="#1e1b4b" />
            </mesh>
          )
        })}
      </group>

      {/* Mitochondria scattered around */}
      <Mitochondria
        position={[1.2, -0.8, 0.8]}
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
        position={[0.5, 1.4, -0.6]}
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
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color={selectedOrganelle === 'lysosome' ? '#f97316' : '#ea580c'}
            emissive={selectedOrganelle === 'lysosome' ? '#fb923c' : '#c2410c'}
            emissiveIntensity={selectedOrganelle === 'lysosome' ? 0.9 : 0.4}
          />
        </mesh>
      ))}

      {/* Free Ribosomes (Tiny yellow spheres in cytoplasm) */}
      {Array.from({ length: 30 }).map((_, i) => {
        const r = 1.2 + Math.random() * 1.0
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        return (
          <mesh
            key={i}
            position={[
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.sin(phi) * Math.sin(theta),
              r * Math.cos(phi),
            ]}
          >
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        )
      })}
    </group>
  )
}

// ============================================================
// 2. COMPLETE 3D PLANT CELL
// ============================================================
export function PlantCell({ selectedOrganelle, onSelectOrganelle }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Rigid Polygonal/Box Cell Wall (Outer green boundary) */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('cellWall')
        }}
      >
        <boxGeometry args={[4.2, 3.2, 2.8]} />
        <meshPhysicalMaterial
          color="#047857"
          transparent
          opacity={selectedOrganelle === 'cellWall' ? 0.7 : 0.3}
          roughness={0.2}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Giant Central Vacuole (occupies most of cell) */}
      <mesh
        position={[0.2, -0.1, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('centralVacuole')
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={selectedOrganelle === 'centralVacuole' ? 0.8 : 0.4}
          roughness={0.1}
          transmission={0.8}
        />
      </mesh>

      {/* Displaced Nucleus pushed to side */}
      <mesh
        position={[-1.3, 0.6, 0.4]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectOrganelle('nucleus')
        }}
      >
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial
          color={selectedOrganelle === 'nucleus' ? '#818cf8' : '#4f46e5'}
          emissive="#312e81"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Chloroplasts (Plant cell signature) */}
      <Chloroplast
        position={[-1.4, -0.7, 0.6]}
        rotation={[0.3, 0.4, 0]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />
      <Chloroplast
        position={[1.3, 0.8, -0.5]}
        rotation={[-0.4, 0.2, 0.5]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />
      <Chloroplast
        position={[1.2, -0.8, 0.4]}
        rotation={[0.2, -0.5, 0.1]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />
      <Chloroplast
        position={[-0.8, 1.0, -0.6]}
        rotation={[0.6, 0.1, -0.3]}
        isSelected={selectedOrganelle === 'chloroplast'}
        onClick={onSelectOrganelle}
      />

      {/* Mitochondria */}
      <Mitochondria
        position={[-0.3, -1.1, 0.7]}
        rotation={[0, 0.5, 0]}
        scale={0.28}
        isSelected={selectedOrganelle === 'mitochondria'}
        onClick={onSelectOrganelle}
      />
    </group>
  )
}

// ============================================================
// 3. DETAILED NUCLEUS ARCHITECTURE
// ============================================================
export function NucleusStructureDetail({ onSelectPart, selectedPart }) {
  return (
    <group>
      {/* Outer Membrane Hemisphere Cutaway */}
      <mesh>
        <sphereGeometry args={[2.0, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshStandardMaterial
          color="#4f46e5"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          roughness={0.3}
        />
      </mesh>

      {/* Inner Nucleolus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Chromatin Fiber Filaments */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ChromatinFilament key={i} index={i} />
      ))}

      {/* Nuclear Pores on Envelope */}
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = (i / 12) * Math.PI
        const theta = (i / 12) * Math.PI * 1.5
        const x = 2.0 * Math.sin(phi) * Math.cos(theta)
        const y = 2.0 * Math.sin(phi) * Math.sin(theta)
        const z = 2.0 * Math.cos(phi)
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <torusGeometry args={[0.14, 0.03, 8, 16]} />
              <meshStandardMaterial color="#c7d2fe" emissive="#818cf8" emissiveIntensity={0.8} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function ChromatinFilament({ index }) {
  const curve = useMemo(() => {
    const pts = []
    const angleOffset = (index / 8) * Math.PI * 2
    for (let i = 0; i < 20; i++) {
      const t = i / 19
      const r = 0.8 + t * 0.9
      const a = angleOffset + t * 3
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * r,
          (Math.sin(t * 10) * 0.3) + (t - 0.5) * 1.2,
          Math.sin(a) * r
        )
      )
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [index])

  return (
    <mesh>
      <tubeGeometry args={[curve, 32, 0.02, 6, false]} />
      <meshStandardMaterial color="#a5b4fc" emissive="#6366f1" emissiveIntensity={0.3} />
    </mesh>
  )
}

// ============================================================
// 4. MITOSIS CELL DIVISION ANIMATION SCENE
// ============================================================
export function MitosisScene({ stageIndex = 0 }) {
  // Stages: 0: Interphase, 1: Prophase, 2: Metaphase, 3: Anaphase, 4: Telophase, 5: Cytokinesis
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {stageIndex === 0 && (
        // Interphase: Normal spherical cell with chromatin inside nucleus
        <group>
          <mesh>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshPhysicalMaterial color="#8b5cf6" transparent opacity={0.3} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.9, 24, 24]} />
            <meshStandardMaterial color="#4f46e5" />
          </mesh>
        </group>
      )}

      {stageIndex === 1 && (
        // Prophase: Chromosomes condensing into X shapes, spindle asters at poles
        <group>
          <mesh>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshPhysicalMaterial color="#8b5cf6" transparent opacity={0.3} />
          </mesh>
          {/* Centrosomes at poles */}
          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0, -1.6, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
          </mesh>
          {/* Condensing Chromosomes */}
          {[-0.6, 0, 0.6].map((x, i) => (
            <group key={i} position={[x, (i - 1) * 0.3, 0]}>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.45, 0.08]} />
                <meshStandardMaterial color="#ec4899" />
              </mesh>
              <mesh rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.45, 0.08]} />
                <meshStandardMaterial color="#ec4899" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {stageIndex === 2 && (
        // Metaphase: Chromosomes lined up at the equator plate!
        <group>
          <mesh>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshPhysicalMaterial color="#8b5cf6" transparent opacity={0.25} />
          </mesh>
          {/* Spindle poles */}
          <mesh position={[0, 1.7, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, -1.7, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          {/* Chromosomes at equator plate */}
          {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.55, 0.08]} />
                <meshStandardMaterial color="#ec4899" />
              </mesh>
              <mesh rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.55, 0.08]} />
                <meshStandardMaterial color="#ec4899" />
              </mesh>
              {/* Spindle fiber connecting to poles */}
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={3}
                    array={new Float32Array([0, 1.7 - 0, 0, 0, 0, 0, 0, -1.7, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#38bdf8" transparent opacity={0.4} />
              </line>
            </group>
          ))}
        </group>
      )}

      {stageIndex === 3 && (
        // Anaphase: Chromatids pulling apart to opposite poles!
        <group>
          <mesh scale={[1.1, 1.3, 1]}>
            <sphereGeometry args={[1.9, 32, 32]} />
            <meshPhysicalMaterial color="#8b5cf6" transparent opacity={0.25} />
          </mesh>
          {/* Moving North */}
          {[-0.7, 0, 0.7].map((x, i) => (
            <mesh key={`n-${i}`} position={[x, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.08, 0.45, 0.08]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          ))}
          {/* Moving South */}
          {[-0.7, 0, 0.7].map((x, i) => (
            <mesh key={`s-${i}`} position={[x, -0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.08, 0.45, 0.08]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          ))}
        </group>
      )}

      {stageIndex >= 4 && (
        // Telophase / Cytokinesis: Cleavage furrow pinching into two cells!
        <group>
          {/* Cell 1 (Upper) */}
          <group position={[0, 1.0, 0]}>
            <mesh>
              <sphereGeometry args={[1.3, 32, 32]} />
              <meshPhysicalMaterial color="#8b5cf6" transparent opacity={0.35} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#4f46e5" />
            </mesh>
          </group>

          {/* Cell 2 (Lower) */}
          <group position={[0, -1.0, 0]}>
            <mesh>
              <sphereGeometry args={[1.3, 32, 32]} />
              <meshPhysicalMaterial color="#8b5cf6" transparent opacity={0.35} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#4f46e5" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  )
}
