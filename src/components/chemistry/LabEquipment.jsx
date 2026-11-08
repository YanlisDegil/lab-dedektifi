import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── BRIGHT, PROFESSIONAL LABORATORY COUNTERTOP ───
export function LabBench({ position = [0, -1.8, 0], size = [14, 0.4, 7] }) {
  return (
    <group position={position}>
      {/* Light Clean Ceramic/Granite Lab Bench Surface */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Bench Beveled Edge Trim (Anodized Aluminum / Blue-Green Accent) */}
      <mesh position={[0, size[1] / 2 + 0.01, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.03, 0.08]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -size[1] / 2 - 0.01, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.03, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Metallic Stand Legs */}
      {[
        [-size[0] / 2 + 0.4, -2, -size[2] / 2 + 0.4],
        [size[0] / 2 - 0.4, -2, -size[2] / 2 + 0.4],
        [-size[0] / 2 + 0.4, -2, size[2] / 2 - 0.4],
        [size[0] / 2 - 0.4, -2, size[2] / 2 - 0.4],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.09, 0.09, 4, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// ─── HIGH-VISIBILITY CRYSTAL CLEAR GLASS BEAKER ───
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
  const bubbleCount = 24

  const bubbleData = useMemo(() => {
    return Array.from({ length: bubbleCount }, () => ({
      x: (Math.random() - 0.5) * (radius * 1.3),
      y: Math.random() * (height * Math.max(0.2, liquidLevel)),
      z: (Math.random() - 0.5) * (radius * 1.3),
      speed: 0.4 + Math.random() * 0.6,
      size: 0.02 + Math.random() * 0.035,
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

  return (
    <group position={position}>
      {/* Outer Glass Wall (High Specular, Realistic Glass) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius, height, 36, 1, true]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.35}
          roughness={0.03}
          transmission={0.92}
          thickness={0.3}
          ior={1.52}
          reflectivity={0.9}
        />
      </mesh>

      {/* Glass Bottom Base */}
      <mesh position={[0, -height / 2 + 0.02, 0]}>
        <cylinderGeometry args={[radius, radius, 0.05, 36]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          transparent
          opacity={0.6}
          roughness={0.08}
          transmission={0.88}
        />
      </mesh>

      {/* Rim Beaded Lip */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.035, 16, 36]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Spout / Pouring Lip */}
      <mesh position={[radius * 0.95, height / 2 - 0.02, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.1, 0.16, 16]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.4}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>

      {/* Graduation Markings (mL Lines) - High Contrast White */}
      {[0.2, 0.4, 0.6, 0.8].map((lvl, i) => {
        const y = -height / 2 + height * lvl
        return (
          <group key={i} position={[radius * 0.98, y, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.015, 0.14, 0.01]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Text
              position={[0.02, 0, 0.08]}
              fontSize={0.08}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
            >
              {`${Math.round(lvl * 500)} mL`}
            </Text>
          </group>
        )
      })}

      {/* VIBRANT LIQUID BODY - Clearly visible from all angles */}
      {liquidLevel > 0.02 && (
        <group position={[0, -height / 2 + 0.03 + (height * liquidLevel) / 2, 0]}>
          <mesh>
            <cylinderGeometry
              args={[radius * 0.96, radius * 0.96, height * liquidLevel, 36]}
            />
            <meshStandardMaterial
              color={liquidColor}
              transparent
              opacity={0.88}
              roughness={0.12}
              metalness={0.15}
            />
          </mesh>

          {/* Meniscus / Liquid Top Surface */}
          <mesh
            position={[0, (height * liquidLevel) / 2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[radius * 0.96, 36]} />
            <meshStandardMaterial
              color={liquidColor}
              roughness={0.05}
              metalness={0.2}
            />
          </mesh>
        </group>
      )}

      {/* Precipitate layer at bottom */}
      {showPrecipitate && (
        <mesh position={[0, -height / 2 + 0.06, 0]}>
          <cylinderGeometry args={[radius * 0.95, radius * 0.95, 0.09, 36]} />
          <meshStandardMaterial
            color={precipitateColor}
            roughness={0.95}
            emissive={precipitateColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* Active Reaction Bubbles */}
      {showBubbles && (
        <group ref={bubblesRef}>
          {bubbleData.map((b, i) => (
            <mesh key={i} position={[b.x, -height / 2 + b.y, b.z]}>
              <sphereGeometry args={[b.size, 10, 10]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
            </mesh>
          ))}
        </group>
      )}

      {/* 3D Label */}
      {label && (
        <Text
          position={[0, height / 2 + 0.28, 0]}
          fontSize={0.13}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#ffffff"
        >
          {label}
        </Text>
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
      {/* Conical Flask Body */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.3, 0.85, 0.9, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.92}
          ior={1.5}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.92}
        />
      </mesh>
      {/* Flask Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} />
        <meshPhysicalMaterial color="#cbd5e1" transparent opacity={0.5} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 1.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 16, 32]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Liquid inside conical body */}
      {liquidLevel > 0.04 && (
        <mesh position={[0, 0.03 + (liquidLevel * 0.72) / 2, 0]}>
          <cylinderGeometry
            args={[
              0.85 - (0.85 - 0.3) * liquidLevel * 0.85,
              0.83,
              liquidLevel * 0.72,
              32,
            ]}
          />
          <meshStandardMaterial
            color={liquidColor}
            transparent
            opacity={0.9}
            roughness={0.1}
          />
        </mesh>
      )}

      {label && (
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.12}
          color="#0f172a"
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#ffffff"
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
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Gas connector */}
      <mesh position={[0.42, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Rubber Gas Tubing */}
      <mesh position={[0.8, -0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>
      {/* Chimney / Barrel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 1.15, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Air Control Collar */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.18, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flame */}
      {isLit && (
        <group position={[0, 0.58, 0]}>
          {/* Outer Flame */}
          <mesh ref={flameRef} position={[0, 0.42 * flameIntensity, 0]}>
            <coneGeometry args={[0.18 * flameIntensity, 0.85 * flameIntensity, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={2.2}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Hot Inner Blue Core */}
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
          <pointLight color="#38bdf8" intensity={2.5 * flameIntensity} distance={5} />
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
      {/* Stand Vertical Rod */}
      <mesh position={[-0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 4.0, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Clamp Bar */}
      <mesh position={[-0.4, 1.0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      {/* Clamp Ring */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.13, 0.035, 12, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* Burette Glass Column */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 2.4, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>

      {/* Burette Liquid */}
      {liquidLevel > 0.02 && (
        <mesh position={[0, 0 + (liquidLevel * 2.3) / 2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, liquidLevel * 2.3, 24]} />
          <meshStandardMaterial color={liquidColor} transparent opacity={0.9} />
        </mesh>
      )}

      {/* Stopcock valve */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Burette Tip */}
      <mesh position={[0, -0.25, 0]}>
        <coneGeometry args={[0.06, 0.3, 16]} rotation={[Math.PI, 0, 0]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} transmission={0.9} />
      </mesh>

      {/* Falling Liquid Drop */}
      {isDripping && (
        <mesh position={[0, -0.4 - dropProgress * 0.9, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={liquidColor} emissive={liquidColor} emissiveIntensity={0.6} />
        </mesh>
      )}
    </group>
  )
}

// ─── 3D DIGITAL PH METER DEVICE (NO FLOATING HTML BEHIND MESH) ───
export function PHMeterDevice({
  position = [1.5, 0, 0],
  pH = 7.0,
}) {
  return (
    <group position={position}>
      {/* Device Body (Angled Tabletop Meter) */}
      <mesh position={[0, 0.25, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.0, 1.2, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Bezel frame */}
      <mesh position={[0, 0.45, 0.18]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.82, 0.52, 0.03]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} />
      </mesh>

      {/* LCD Glass Screen */}
      <mesh position={[0, 0.45, 0.2]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.76, 0.46]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* 3D Rendered Digital Text directly ON screen face */}
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

      {/* Buttons on face */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.24]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color={i === 0 ? '#10b981' : i === 1 ? '#eab308' : '#ef4444'} />
        </mesh>
      ))}

      {/* Heavy Flexible Probe Cable */}
      <mesh position={[-0.7, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} rotation={[0, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>

      {/* Electrode Stand & Submerged Probe */}
      <group position={[-1.7, -0.2, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.2, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glass Sensing Bulb */}
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
      {/* Upper Dry Handle */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.16, 0.5, 0.01]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {/* Dipped Sensitive Region */}
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

// ─── 3D BOHR ATOM WITH REAL ELECTRON SHELLS ───
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
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      {/* Glowing High-Tech Nucleus */}
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Nucleus Symbol 3D Text */}
      <Text
        position={[0, 0, 0.46]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>

      {/* Electron Orbit Shells */}
      {shells.map((count, shellIdx) => {
        const radius = 0.95 + shellIdx * 0.7
        const tiltX = (shellIdx * Math.PI) / 4
        const tiltZ = (shellIdx * Math.PI) / 6

        return (
          <group key={shellIdx} rotation={[tiltX, 0, tiltZ]}>
            {/* Orbit Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.016, 16, 64]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
            </mesh>

            {/* Electrons in this shell */}
            {Array.from({ length: count }).map((_, eIdx) => {
              const angle = (eIdx / count) * Math.PI * 2
              return (
                <ElectronParticle
                  key={eIdx}
                  radius={radius}
                  initialAngle={angle}
                  speed={2.0 - shellIdx * 0.25}
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
      <sphereGeometry args={[0.075, 14, 14]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#38bdf8"
        emissiveIntensity={2.5}
      />
    </mesh>
  )
}
