import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── AUTHENTIC WARM WOODEN LABORATORY BENCH (MAHOGANY / RICH WALNUT) ───
export function LabBench({ position = [0, -1.8, 0], size = [14, 0.45, 7] }) {
  return (
    <group position={position}>
      {/* Polished Solid Hardwood Lab Bench Surface (Warm Walnut / Teak) */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#5c2c16"
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>

      {/* Surface Inlay Planks for Realistic Wood Table Texture */}
      {[-2.5, -1.25, 0, 1.25, 2.5].map((z, idx) => (
        <mesh key={idx} position={[0, size[1] / 2 + 0.002, z]}>
          <planeGeometry args={[size[0] * 0.98, 0.015]} />
          <meshBasicMaterial color="#3d1b0c" opacity={0.6} transparent />
        </mesh>
      ))}

      {/* Warm Solid Wood Beveled Edges */}
      <mesh position={[0, size[1] / 2 + 0.01, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.04, 0.06]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} />
      </mesh>
      <mesh position={[0, -size[1] / 2 - 0.01, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.04, 0.06]} />
        <meshStandardMaterial color="#451a03" roughness={0.5} />
      </mesh>

      {/* Heavy Black Cast-Iron Bench Legs */}
      {[
        [-size[0] / 2 + 0.5, -2, -size[2] / 2 + 0.5],
        [size[0] / 2 - 0.5, -2, -size[2] / 2 + 0.5],
        [-size[0] / 2 + 0.5, -2, size[2] / 2 - 0.5],
        [size[0] / 2 - 0.5, -2, size[2] / 2 - 0.5],
      ].map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.12, 4, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Floor foot */}
          <mesh position={[0, -1.95, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── HIGH-VISIBILITY CRYSTAL CLEAR GLASS BEAKER (FULL LIQUID BODY VISIBLE) ───
export function Beaker({
  position = [0, 0, 0],
  radius = 0.65,
  height = 1.5,
  liquidLevel = 0.65, // 0 to 1
  liquidColor = '#10b981',
  showBubbles = false,
  showPrecipitate = false,
  precipitateColor = '#ffffff',
  label = '',
}) {
  const bubblesRef = useRef()
  const bubbleCount = 20

  const bubbleData = useMemo(() => {
    return Array.from({ length: bubbleCount }, () => ({
      x: (Math.random() - 0.5) * (radius * 1.3),
      y: Math.random() * (height * Math.max(0.2, liquidLevel)),
      z: (Math.random() - 0.5) * (radius * 1.3),
      speed: 0.4 + Math.random() * 0.5,
      size: 0.02 + Math.random() * 0.03,
    }))
  }, [bubbleCount, radius, height, liquidLevel])

  useFrame((_, delta) => {
    if (!showBubbles || !bubblesRef.current) return
    bubblesRef.current.children.forEach((child, i) => {
      const b = bubbleData[i]
      child.position.y += b.speed * delta
      const topY = -height / 2 + height * liquidLevel - 0.05
      if (child.position.y > topY) {
        child.position.y = -height / 2 + 0.08
      }
    })
  })

  const liquidActualHeight = Math.max(0.08, height * liquidLevel)

  return (
    <group position={position}>
      {/* 1. SOLID VIBRANT LIQUID BODY - RENDERED WITH FULL VOLUME VISIBILITY */}
      {liquidLevel > 0.02 && (
        <group position={[0, -height / 2 + 0.04 + liquidActualHeight / 2, 0]}>
          {/* Main cylindrical liquid volume */}
          <mesh renderOrder={1}>
            <cylinderGeometry
              args={[radius * 0.94, radius * 0.94, liquidActualHeight, 36]}
            />
            <meshStandardMaterial
              color={liquidColor}
              roughness={0.15}
              metalness={0.1}
              transparent={false}
            />
          </mesh>

          {/* Meniscus / Top Liquid Surface Disk */}
          <mesh
            position={[0, liquidActualHeight / 2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={2}
          >
            <circleGeometry args={[radius * 0.94, 36]} />
            <meshStandardMaterial
              color={liquidColor}
              roughness={0.05}
              metalness={0.25}
            />
          </mesh>
        </group>
      )}

      {/* 2. PRECIPITATE LAYER AT BOTTOM IF ANY */}
      {showPrecipitate && (
        <mesh position={[0, -height / 2 + 0.08, 0]} renderOrder={3}>
          <cylinderGeometry args={[radius * 0.93, radius * 0.93, 0.1, 36]} />
          <meshStandardMaterial
            color={precipitateColor}
            roughness={0.9}
            emissive={precipitateColor}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* 3. ACTIVE RISING BUBBLES */}
      {showBubbles && (
        <group ref={bubblesRef} renderOrder={4}>
          {bubbleData.map((b, i) => (
            <mesh key={i} position={[b.x, -height / 2 + b.y, b.z]}>
              <sphereGeometry args={[b.size, 10, 10]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {/* 4. REALISTIC GLASS WALLS (depthWrite: false so liquid behind is NEVER hidden!) */}
      <mesh position={[0, 0, 0]} renderOrder={5}>
        <cylinderGeometry args={[radius, radius, height, 36, 1, true]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.32}
          roughness={0.06}
          metalness={0.2}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glass Bottom Base */}
      <mesh position={[0, -height / 2 + 0.02, 0]} renderOrder={5}>
        <cylinderGeometry args={[radius, radius, 0.05, 36]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Beaded Glass Rim */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={6}>
        <torusGeometry args={[radius, 0.035, 16, 36]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Spout */}
      <mesh position={[radius * 0.95, height / 2 - 0.02, 0]} rotation={[0, 0, -0.6]} renderOrder={6}>
        <coneGeometry args={[0.1, 0.16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* White Graduation Lines and Labels */}
      {[0.25, 0.5, 0.75].map((lvl, i) => {
        const y = -height / 2 + height * lvl
        return (
          <group key={i} position={[radius * 0.98, y, 0]} renderOrder={7}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.015, 0.16, 0.01]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Text
              position={[0.02, 0, 0.08]}
              fontSize={0.09}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#000000"
            >
              {`${Math.round(lvl * 500)} mL`}
            </Text>
          </group>
        )
      })}

      {/* 3D Title Label */}
      {label && (
        <Text
          position={[0, height / 2 + 0.28, 0]}
          fontSize={0.13}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          renderOrder={8}
        >
          {label}
        </Text>
      )}
    </group>
  )
}

// ─── ERLENMEYER FLASK (CLEAR VISIBLE LIQUID BODY) ───
export function ErlenmeyerFlask({
  position = [0, 0, 0],
  scale = 1,
  liquidLevel = 0.5,
  liquidColor = '#0284c7',
  label = '',
}) {
  const actualH = Math.max(0.08, liquidLevel * 0.75)

  return (
    <group position={position} scale={scale}>
      {/* Liquid inside conical body (Solid visible) */}
      {liquidLevel > 0.02 && (
        <group position={[0, 0.04 + actualH / 2, 0]} renderOrder={1}>
          <mesh>
            <cylinderGeometry
              args={[
                0.82 - (0.82 - 0.28) * liquidLevel * 0.85,
                0.81,
                actualH,
                32,
              ]}
            />
            <meshStandardMaterial
              color={liquidColor}
              roughness={0.15}
              metalness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* Glass Body (depthWrite: false so liquid is never hidden) */}
      <mesh position={[0, 0.45, 0]} renderOrder={5}>
        <cylinderGeometry args={[0.3, 0.85, 0.9, 32, 1, true]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.32}
          roughness={0.05}
          metalness={0.15}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.12, 0]} renderOrder={5}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 32, 1, true]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.32}
          roughness={0.05}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.02, 0]} renderOrder={5}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 1.37, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={6}>
        <torusGeometry args={[0.22, 0.03, 16, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {label && (
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.13}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>
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
    const t = state.clock.elapsedTime * 16
    const flicker = Math.sin(t) * 0.09 + Math.cos(t * 1.7) * 0.05
    flameRef.current.scale.set(1 + flicker * 0.6, 1 + flicker * 1.3, 1 + flicker * 0.6)
    if (innerFlameRef.current) {
      innerFlameRef.current.scale.set(1 + flicker * 0.4, 1 + flicker * 0.9, 1 + flicker * 0.4)
    }
  })

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.14, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Gas connector */}
      <mesh position={[0.42, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Rubber Gas Hose */}
      <mesh position={[0.8, -0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 1.15, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Air Collar */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.18, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flame */}
      {isLit && (
        <group position={[0, 0.58, 0]}>
          <mesh ref={flameRef} position={[0, 0.42 * flameIntensity, 0]}>
            <coneGeometry args={[0.18 * flameIntensity, 0.85 * flameIntensity, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={2.5}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh ref={innerFlameRef} position={[0, 0.25 * flameIntensity, 0]}>
            <coneGeometry args={[0.09 * flameIntensity, 0.5 * flameIntensity, 24]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={3.5}
              transparent
              opacity={0.95}
            />
          </mesh>
          <pointLight color="#38bdf8" intensity={2.8 * flameIntensity} distance={5} />
        </group>
      )}
    </group>
  )
}

// ─── BURETTE SETUP ───
export function BuretteSetup({
  position = [0, 0, 0],
  liquidLevel = 0.8,
  liquidColor = '#a855f7',
  isDripping = false,
  dropProgress = 0,
}) {
  return (
    <group position={position}>
      {/* Stand Base */}
      <mesh position={[-0.8, -1.5, 0]}>
        <boxGeometry args={[0.9, 0.08, 1.3]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Stand Rod */}
      <mesh position={[-0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 4.0, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Clamp Bar */}
      <mesh position={[-0.4, 1.0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.13, 0.035, 12, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* Burette Glass Column */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 2.4, 24, 1, true]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Burette Liquid */}
      {liquidLevel > 0.02 && (
        <mesh position={[0, 0 + (liquidLevel * 2.3) / 2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, liquidLevel * 2.3, 24]} />
          <meshStandardMaterial color={liquidColor} />
        </mesh>
      )}

      {/* Stopcock */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Tip */}
      <mesh position={[0, -0.25, 0]}>
        <coneGeometry args={[0.06, 0.3, 16]} rotation={[Math.PI, 0, 0]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Falling Drop */}
      {isDripping && (
        <mesh position={[0, -0.4 - dropProgress * 0.9, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={liquidColor} emissive={liquidColor} emissiveIntensity={0.6} />
        </mesh>
      )}
    </group>
  )
}

// ─── 3D DIGITAL PH METER DEVICE ───
export function PHMeterDevice({
  position = [1.5, 0, 0],
  pH = 7.0,
}) {
  return (
    <group position={position}>
      {/* Device Body */}
      <mesh position={[0, 0.25, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.0, 1.2, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Bezel */}
      <mesh position={[0, 0.45, 0.18]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.82, 0.52, 0.03]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} />
      </mesh>

      {/* Screen Face */}
      <mesh position={[0, 0.45, 0.2]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.76, 0.46]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Digital Text directly ON screen */}
      <group position={[0, 0.45, 0.21]} rotation={[-0.3, 0, 0]}>
        <Text
          position={[0, 0.12, 0]}
          fontSize={0.06}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          LAB pH METER
        </Text>
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.2}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          {pH.toFixed(2)}
        </Text>
      </group>

      {/* Buttons */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.24]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color={i === 0 ? '#10b981' : i === 1 ? '#eab308' : '#ef4444'} />
        </mesh>
      ))}

      {/* Cable */}
      <mesh position={[-0.7, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} rotation={[0, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>

      {/* Electrode Probe */}
      <group position={[-1.7, -0.2, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.2, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  )
}

// ─── LITMUS PAPER STRIP ───
export function LitmusPaper({
  position = [0, 0, 0],
  isDipped = false,
  dippedColor = '#ef4444',
}) {
  return (
    <group position={position} rotation={[0, 0, 0.2]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.16, 0.5, 0.01]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.16, 0.4, 0.01]} />
        <meshStandardMaterial
          color={isDipped ? dippedColor : '#f8fafc'}
          roughness={0.85}
        />
      </mesh>
    </group>
  )
}

// ─── HIGH-TECH 3D BOHR ATOM WITH REAL ELECTRON SHELLS & ACTIVE ROTATION ───
export function BohrAtom({
  atomicNumber = 1,
  symbol = 'H',
  name = 'Hidrojen',
  shells = [1],
  color = '#10b981',
}) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Glowing Nucleus */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Nucleus Symbol Front & Back */}
      <Text
        position={[0, 0, 0.48]}
        fontSize={0.26}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
      <Text
        position={[0, 0, -0.48]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.26}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>

      {/* Electron Shells (Orbits) */}
      {shells.map((count, shellIdx) => {
        const radius = 1.0 + shellIdx * 0.75
        const tiltX = (shellIdx * Math.PI) / 3.5
        const tiltZ = (shellIdx * Math.PI) / 5

        return (
          <group key={shellIdx} rotation={[tiltX, 0, tiltZ]}>
            {/* Orbit Ring Guideline */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.018, 16, 64]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
            </mesh>

            {/* Electrons in this shell */}
            {Array.from({ length: count }).map((_, eIdx) => {
              const angle = (eIdx / count) * Math.PI * 2
              return (
                <ElectronParticle
                  key={eIdx}
                  radius={radius}
                  initialAngle={angle}
                  speed={2.2 - shellIdx * 0.3}
                />
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

function ElectronParticle({ radius, initialAngle, speed }) {
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
      <sphereGeometry args={[0.085, 16, 16]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#38bdf8"
        emissiveIntensity={3.0}
      />
    </mesh>
  )
}
