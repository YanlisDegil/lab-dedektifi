import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

// ─── LABORATORY BENCH ───
export function LabBench({ position = [0, -1.8, 0], size = [12, 0.4, 6] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Front edge accent */}
      <mesh position={[0, size[1] / 2 + 0.01, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.04, 0.06]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} />
      </mesh>
      {/* Table legs */}
      {[
        [-size[0] / 2 + 0.3, -2, -size[2] / 2 + 0.3],
        [size[0] / 2 - 0.3, -2, -size[2] / 2 + 0.3],
        [-size[0] / 2 + 0.3, -2, size[2] / 2 - 0.3],
        [size[0] / 2 - 0.3, -2, size[2] / 2 - 0.3],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// ─── BEAKER ───
export function Beaker({
  position = [0, 0, 0],
  radius = 0.6,
  height = 1.4,
  liquidLevel = 0.65, // 0 to 1
  liquidColor = '#38bdf8',
  showBubbles = false,
  showPrecipitate = false,
  precipitateColor = '#ffffff',
  label = '',
}) {
  const bubblesRef = useRef()
  const bubbleCount = 20

  const bubbleData = useMemo(() => {
    return Array.from({ length: bubbleCount }, () => ({
      x: (Math.random() - 0.5) * (radius * 1.4),
      y: Math.random() * (height * liquidLevel),
      z: (Math.random() - 0.5) * (radius * 1.4),
      speed: 0.3 + Math.random() * 0.5,
      size: 0.02 + Math.random() * 0.03,
    }))
  }, [bubbleCount, radius, height, liquidLevel])

  useFrame((_, delta) => {
    if (!showBubbles || !bubblesRef.current) return
    bubblesRef.current.children.forEach((child, i) => {
      const b = bubbleData[i]
      child.position.y += b.speed * delta
      if (child.position.y > height * liquidLevel - height / 2) {
        child.position.y = -height / 2 + 0.05
      }
    })
  })

  return (
    <group position={position}>
      {/* Beaker Glass Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.9}
          thickness={0.2}
          ior={1.5}
        />
      </mesh>

      {/* Beaker Glass Bottom */}
      <mesh position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, 0.04, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          roughness={0.1}
          transmission={0.9}
        />
      </mesh>

      {/* Beaker Rim */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.03, 16, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.2} />
      </mesh>

      {/* Graduation Marks */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <group key={i} position={[radius * 0.98, y, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.01, 0.08, 0.005]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Liquid Mesh */}
      {liquidLevel > 0.05 && (
        <group position={[0, -height / 2 + (height * liquidLevel) / 2, 0]}>
          <mesh>
            <cylinderGeometry
              args={[radius * 0.96, radius * 0.96, height * liquidLevel, 32]}
            />
            <meshStandardMaterial
              color={liquidColor}
              transparent
              opacity={0.85}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
          {/* Top liquid surface meniscus */}
          <mesh position={[0, (height * liquidLevel) / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius * 0.96, 32]} />
            <meshStandardMaterial
              color={liquidColor}
              transparent
              opacity={0.9}
              roughness={0.05}
            />
          </mesh>
        </group>
      )}

      {/* Precipitate layer at the bottom if reaction creates precipitate */}
      {showPrecipitate && (
        <mesh position={[0, -height / 2 + 0.04, 0]}>
          <cylinderGeometry args={[radius * 0.94, radius * 0.94, 0.08, 32]} />
          <meshStandardMaterial color={precipitateColor} roughness={0.9} />
        </mesh>
      )}

      {/* Rising Bubbles */}
      {showBubbles && (
        <group ref={bubblesRef}>
          {bubbleData.map((b, i) => (
            <mesh key={i} position={[b.x, -height / 2 + b.y, b.z]}>
              <sphereGeometry args={[b.size, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* Optional Label */}
      {label && (
        <Html position={[0, height / 2 + 0.3, 0]} center distanceFactor={8}>
          <div className="bg-dark-900/90 border border-dark-700 px-2.5 py-1 rounded-md text-[11px] text-white whitespace-nowrap shadow-lg">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── ERLENMEYER FLASK ───
export function ErlenmeyerFlask({
  position = [0, 0, 0],
  scale = 1,
  liquidLevel = 0.5,
  liquidColor = '#f43f5e',
  label = '',
}) {
  return (
    <group position={position} scale={scale}>
      {/* Conical body */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 0.9, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.9}
          ior={1.5}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.04, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.025, 16, 32]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Liquid inside conical flask */}
      {liquidLevel > 0.05 && (
        <mesh position={[0, 0.02 + (liquidLevel * 0.7) / 2, 0]}>
          <cylinderGeometry
            args={[
              0.8 - (0.8 - 0.3) * liquidLevel * 0.8,
              0.78,
              liquidLevel * 0.7,
              32
            ]}
          />
          <meshStandardMaterial
            color={liquidColor}
            transparent
            opacity={0.88}
            roughness={0.1}
          />
        </mesh>
      )}

      {label && (
        <Html position={[0, 1.6, 0]} center distanceFactor={8}>
          <div className="bg-dark-900/90 border border-dark-700 px-2 py-0.5 rounded text-[11px] text-white">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── TEST TUBE & RACK ───
export function TestTube({
  position = [0, 0, 0],
  liquidLevel = 0.5,
  liquidColor = '#10b981',
  scale = 1,
  rotation = [0, 0, 0],
}) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Tube body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>
      {/* Rounded bottom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>
      {/* Liquid */}
      {liquidLevel > 0.05 && (
        <group position={[0, 0.05 + (liquidLevel * 0.8) / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.11, 0.11, liquidLevel * 0.8, 24]} />
            <meshStandardMaterial color={liquidColor} transparent opacity={0.85} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ─── BUNSEN BURNER ───
export function BunsenBurner({ position = [0, 0, 0], isLit = true, flameIntensity = 1 }) {
  const flameRef = useRef()
  const innerFlameRef = useRef()

  useFrame((state) => {
    if (!isLit || !flameRef.current) return
    const t = state.clock.elapsedTime * 14
    const flicker = Math.sin(t) * 0.08 + Math.cos(t * 1.5) * 0.04
    flameRef.current.scale.set(1 + flicker * 0.5, 1 + flicker * 1.2, 1 + flicker * 0.5)
    if (innerFlameRef.current) {
      innerFlameRef.current.scale.set(1 + flicker * 0.3, 1 + flicker * 0.8, 1 + flicker * 0.3)
    }
  })

  return (
    <group position={position}>
      {/* Heavy circular base */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.12, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Gas inlet connector */}
      <mesh position={[0.4, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
        <meshStandardMaterial color="#b45309" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Gas Hose */}
      <mesh position={[0.7, -0.65, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} />
      </mesh>
      {/* Burner chimney / tube */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.1, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Air adjustment collar */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Flame when active */}
      {isLit && (
        <group position={[0, 0.55, 0]}>
          {/* Outer blue-violet flame cone */}
          <mesh ref={flameRef} position={[0, 0.4 * flameIntensity, 0]}>
            <coneGeometry args={[0.16 * flameIntensity, 0.8 * flameIntensity, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.8}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Inner intense light blue/white cone */}
          <mesh ref={innerFlameRef} position={[0, 0.25 * flameIntensity, 0]}>
            <coneGeometry args={[0.09 * flameIntensity, 0.5 * flameIntensity, 24]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={3}
              transparent
              opacity={0.95}
            />
          </mesh>
          {/* Flame light illumination */}
          <pointLight color="#38bdf8" intensity={2 * flameIntensity} distance={4} />
        </group>
      )}
    </group>
  )
}

// ─── BURETTE & RETORT STAND ───
export function BuretteSetup({
  position = [0, 0, 0],
  liquidLevel = 0.8, // 0 empty to 1 full
  liquidColor = '#a855f7',
  isDripping = false,
  dropProgress = 0,
}) {
  return (
    <group position={position}>
      {/* Retort Stand Base */}
      <mesh position={[-0.8, -1.5, 0]}>
        <boxGeometry args={[0.8, 0.08, 1.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Retort Stand Rod */}
      <mesh position={[-0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 4.0, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Clamp attached to rod */}
      <mesh position={[-0.4, 1.0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.12, 0.03, 12, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Burette Glass Column */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>

      {/* Burette Liquid column */}
      {liquidLevel > 0.05 && (
        <mesh position={[0, 0 + (liquidLevel * 2.3) / 2, 0]}>
          <cylinderGeometry args={[0.075, 0.075, liquidLevel * 2.3, 24]} />
          <meshStandardMaterial color={liquidColor} transparent opacity={0.85} />
        </mesh>
      )}

      {/* Stopcock valve */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Burette Tip */}
      <mesh position={[0, -0.25, 0]}>
        <coneGeometry args={[0.06, 0.3, 16]} rotation={[Math.PI, 0, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>

      {/* Falling Drop */}
      {isDripping && (
        <mesh position={[0, -0.4 - dropProgress * 0.7, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={liquidColor} emissive={liquidColor} emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  )
}

// ─── PH METER ───
export function PHMeterDevice({
  position = [1.2, 0, 0],
  pH = 7.0,
  probePosition = [0, -0.2, 0],
}) {
  return (
    <group position={position}>
      {/* Device Body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 1.1, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Screen Frame */}
      <mesh position={[0, 0.35, 0.155]}>
        <boxGeometry args={[0.7, 0.45, 0.02]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
      {/* Digital pH Display */}
      <Html position={[0, 0.35, 0.17]} center transform distanceFactor={5}>
        <div className="bg-sky-950/90 text-sky-300 font-mono font-bold text-center px-2 py-1 rounded border border-sky-400 select-none">
          <div className="text-[9px] tracking-widest text-sky-400">DIGITAL pH</div>
          <div className="text-xl leading-none text-emerald-400 font-black">{pH.toFixed(2)}</div>
        </div>
      </Html>
      {/* Power button */}
      <mesh position={[-0.2, -0.05, 0.16]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      {/* Cal button */}
      <mesh position={[0.2, -0.05, 0.16]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Wire from meter to probe */}
      <mesh position={[-0.45, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 12]} rotation={[0, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* Submerged Probe */}
      <group position={[-1.2, -0.3, 0]}>
        {/* Probe shaft */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass bulb sensor */}
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </group>
  )
}

// ─── LITMUS PAPER STRIP ───
export function LitmusPaper({
  position = [0, 0, 0],
  color = '#e2e8f0',
  isDipped = false,
  dippedColor = '#ef4444',
}) {
  return (
    <group position={position} rotation={[0, 0, 0.15]}>
      {/* Upper dry paper */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.14, 0.45, 0.008]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Lower dipped paper */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.14, 0.35, 0.008]} />
        <meshStandardMaterial
          color={isDipped ? dippedColor : color}
          roughness={0.9}
        />
      </mesh>
    </group>
  )
}

// ─── 3D BOHR ATOM MODEL FOR PERIODIC TABLE ───
export function BohrAtom({
  atomicNumber = 6,
  symbol = 'C',
  name = 'Karbon',
  shells = [2, 4],
  color = '#10b981',
}) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Nucleus (Protons & Neutrons Cluster) */}
      <Float speed={3} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        {/* Additional proton/neutron surface spheres */}
        {Array.from({ length: Math.min(atomicNumber, 12) }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / Math.min(atomicNumber, 12))
          const theta = Math.sqrt(Math.min(atomicNumber, 12) * Math.PI) * phi
          const x = 0.35 * Math.cos(theta) * Math.sin(phi)
          const y = 0.35 * Math.sin(theta) * Math.sin(phi)
          const z = 0.35 * Math.cos(phi)
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#ef4444' : '#3b82f6'}
                roughness={0.4}
              />
            </mesh>
          )
        })}
      </Float>

      {/* Electron Orbit Shells */}
      {shells.map((count, shellIdx) => {
        const radius = 0.9 + shellIdx * 0.65
        const tilt = [
          (shellIdx * Math.PI) / 4,
          (shellIdx * Math.PI) / 6,
          (shellIdx * Math.PI) / 8,
        ]

        return (
          <group key={shellIdx} rotation={tilt}>
            {/* Orbit Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.012, 16, 64]} />
              <meshBasicMaterial color={color} transparent opacity={0.35} />
            </mesh>

            {/* Electrons on this shell */}
            {Array.from({ length: count }).map((_, eIdx) => {
              const angle = (eIdx / count) * Math.PI * 2
              return (
                <ElectronParticle
                  key={eIdx}
                  radius={radius}
                  initialAngle={angle}
                  speed={1.5 + shellIdx * 0.4}
                  color={color}
                />
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

function ElectronParticle({ radius, initialAngle, speed, color }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + initialAngle
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.z = Math.sin(t) * radius
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#38bdf8"
        emissiveIntensity={2}
      />
    </mesh>
  )
}
