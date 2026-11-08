// ============================================================
// CircuitComponents.jsx — 3D procedural circuit parts (R3F)
// ============================================================
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'

// ======================== Battery ============================
export function Battery({ position = [0, 0, 0], voltage = 9, scale = 1 }) {
  const group = useRef()

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Main body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Positive cap */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Positive terminal nub */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#ef4444" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Negative cap */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.05, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Body stripe */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.15, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 0.38, 0.37]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {voltage}V
      </Text>
      {/* + sign */}
      <Text
        position={[0.22, 0.82, 0.3]}
        fontSize={0.14}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        +
      </Text>
      {/* − sign */}
      <Text
        position={[0.22, 0.05, 0.3]}
        fontSize={0.14}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        −
      </Text>
    </group>
  )
}

// ======================== Resistor ===========================
export function Resistor({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  resistance = 100,
  colorBands = null,
  scale = 1,
}) {
  // Derive color bands from resistance value
  const bands = useMemo(() => {
    if (colorBands) return colorBands
    const BAND_COLORS = [
      '#1a1a1a', '#8B4513', '#FF0000', '#FF8C00',
      '#FFD700', '#00AA00', '#0000FF', '#8B00FF',
      '#808080', '#FFFFFF',
    ]
    const s = String(Math.round(resistance))
    const d1 = parseInt(s[0]) || 0
    const d2 = parseInt(s[1]) || 0
    const zeros = Math.max(0, s.length - 2)
    return [BAND_COLORS[d1], BAND_COLORS[d2], BAND_COLORS[zeros], '#FFD700']
  }, [resistance, colorBands])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Lead wires */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 12]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>
      {/* Color bands */}
      {bands.map((c, i) => (
        <mesh key={i} position={[-0.17 + i * 0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.105, 0.105, 0.04, 12]} />
          <meshStandardMaterial color={c} roughness={0.4} />
        </mesh>
      ))}
      {/* Resistance label */}
      <Text
        position={[0, 0.18, 0]}
        fontSize={0.07}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {resistance}Ω
      </Text>
    </group>
  )
}

// ==================== Wire with Current Particles ============
export function Wire({ start = [0, 0, 0], end = [1, 0, 0], current = 0, color = '#60a5fa' }) {
  const meshRef = useRef()
  const particlesRef = useRef()
  const particleCount = 12

  const { direction, length, midpoint, rotation } = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const d = e.clone().sub(s)
    const l = d.length()
    const mid = s.clone().add(e).clone().multiplyScalar(0.5)
    // Rotation to align cylinder along direction
    const up = new THREE.Vector3(0, 1, 0)
    const quat = new THREE.Quaternion().setFromUnitVectors(up, d.clone().normalize())
    const euler = new THREE.Euler().setFromQuaternion(quat)
    return { direction: d.normalize(), length: l, midpoint: [mid.x, mid.y, mid.z], rotation: euler }
  }, [start, end])

  // Particle positions as instanced attribute
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!particlesRef.current || Math.abs(current) < 0.001) return
    const t = clock.getElapsedTime()
    const speed = Math.min(Math.abs(current) * 0.5, 3)
    for (let i = 0; i < particleCount; i++) {
      const offset = ((t * speed + (i / particleCount)) % 1)
      const pos = new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), offset)
      dummy.position.set(pos.x, pos.y, pos.z)
      dummy.scale.setScalar(0.025 + Math.abs(current) * 0.005)
      dummy.updateMatrix()
      particlesRef.current.setMatrixAt(i, dummy.matrix)
    }
    particlesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Wire tube */}
      <mesh position={midpoint} rotation={rotation}>
        <cylinderGeometry args={[0.025, 0.025, length, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Current particles */}
      {Math.abs(current) > 0.001 && (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </instancedMesh>
      )}
    </group>
  )
}

// ====================== Light Bulb ==========================
export function LightBulb({ position = [0, 0, 0], current = 0, scale = 1 }) {
  const glassRef = useRef()
  const lightRef = useRef()
  const brightness = Math.min(Math.abs(current) / 0.15, 1)

  useFrame(() => {
    if (glassRef.current) {
      glassRef.current.material.emissiveIntensity = brightness * 2.5
      glassRef.current.material.opacity = 0.3 + brightness * 0.5
    }
    if (lightRef.current) {
      lightRef.current.intensity = brightness * 4
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Base / socket */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.25, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Thread on socket */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.13, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Glass bulb */}
      <mesh ref={glassRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={0}
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>
      {/* Filament */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.15, 4]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={brightness * 4}
          toneMapped={false}
        />
      </mesh>
      {/* Point light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.3, 0]}
        color="#fbbf24"
        intensity={0}
        distance={3}
        decay={2}
      />
    </group>
  )
}

// ======================== Switch ============================
export function Switch({ position = [0, 0, 0], isOn = true, onToggle, scale = 1 }) {
  return (
    <group position={position} scale={scale} onClick={onToggle}>
      {/* Base plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.08, 0.25]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Terminal A */}
      <mesh position={[-0.12, 0.06, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Terminal B */}
      <mesh position={[0.12, 0.06, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lever */}
      <mesh
        position={[isOn ? 0 : -0.06, 0.12, 0]}
        rotation={[0, 0, isOn ? 0 : Math.PI / 6]}
      >
        <boxGeometry args={[0.22, 0.04, 0.04]} />
        <meshStandardMaterial
          color={isOn ? '#3b82f6' : '#6b7280'}
          emissive={isOn ? '#3b82f6' : '#000000'}
          emissiveIntensity={isOn ? 0.5 : 0}
        />
      </mesh>
      {/* Status label */}
      <Text
        position={[0, -0.08, 0.14]}
        fontSize={0.06}
        color={isOn ? '#60a5fa' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {isOn ? 'AÇIK' : 'KAPALI'}
      </Text>
    </group>
  )
}

// ======================== Ammeter ============================
export function Ammeter({ position = [0, 0, 0], current = 0, maxCurrent = 1, scale = 1 }) {
  const needleRef = useRef()
  const normalised = Math.min(Math.abs(current) / maxCurrent, 1)
  const targetAngle = -Math.PI / 4 + normalised * (Math.PI / 2)

  useFrame(() => {
    if (needleRef.current) {
      needleRef.current.rotation.z += (targetAngle - needleRef.current.rotation.z) * 0.08
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Case */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.01, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Scale arc marks */}
      {Array.from({ length: 11 }).map((_, i) => {
        const a = -Math.PI / 4 + (i / 10) * (Math.PI / 2)
        const r = 0.25
        return (
          <mesh key={i} position={[Math.sin(a) * r, 0.075, Math.cos(a) * r]}>
            <boxGeometry args={[0.01, 0.01, 0.03]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        )
      })}
      {/* Needle */}
      <group ref={needleRef} position={[0, 0.08, 0]}>
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.012, 0.22, 4]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
      </group>
      {/* Center pivot */}
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 0.08, -0.18]}
        fontSize={0.06}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        A
      </Text>
      {/* Value overlay */}
      <Html position={[0, -0.15, 0]} center distanceFactor={3}>
        <div
          style={{
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 8,
            padding: '2px 8px',
            color: '#60a5fa',
            fontSize: 11,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {Math.abs(current).toFixed(3)} A
        </div>
      </Html>
    </group>
  )
}

// ======================== Voltmeter ==========================
export function Voltmeter({ position = [0, 0, 0], voltage = 0, maxVoltage = 12, scale = 1 }) {
  const needleRef = useRef()
  const normalised = Math.min(Math.abs(voltage) / maxVoltage, 1)
  const targetAngle = -Math.PI / 4 + normalised * (Math.PI / 2)

  useFrame(() => {
    if (needleRef.current) {
      needleRef.current.rotation.z += (targetAngle - needleRef.current.rotation.z) * 0.08
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Case */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.01, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Scale marks */}
      {Array.from({ length: 11 }).map((_, i) => {
        const a = -Math.PI / 4 + (i / 10) * (Math.PI / 2)
        const r = 0.25
        return (
          <mesh key={i} position={[Math.sin(a) * r, 0.075, Math.cos(a) * r]}>
            <boxGeometry args={[0.01, 0.01, 0.03]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        )
      })}
      {/* Needle */}
      <group ref={needleRef} position={[0, 0.08, 0]}>
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.012, 0.22, 4]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <Text
        position={[0, 0.08, -0.18]}
        fontSize={0.06}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        V
      </Text>
      <Html position={[0, -0.15, 0]} center distanceFactor={3}>
        <div
          style={{
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8,
            padding: '2px 8px',
            color: '#4ade80',
            fontSize: 11,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {Math.abs(voltage).toFixed(2)} V
        </div>
      </Html>
    </group>
  )
}

// ============= Full Circuit Assembly Scene ===================
export function CircuitScene({ config, voltage, switchOn }) {
  const { resistors, type } = config

  // Calculate circuit values
  const totalR =
    type === 'series'
      ? resistors.reduce((a, b) => a + b, 0)
      : 1 / resistors.reduce((acc, r) => acc + 1 / r, 0)
  const current = switchOn ? voltage / totalR : 0

  if (type === 'parallel') {
    return <ParallelCircuitLayout resistors={resistors} voltage={voltage} current={current} switchOn={switchOn} />
  }

  // Simple / Series layout
  const count = resistors.length
  const spacing = 1.6

  return (
    <group>
      {/* Battery */}
      <Battery position={[-3, 0, 0]} voltage={voltage} />

      {/* Switch */}
      <Switch position={[-1.5, 0.5, 0]} isOn={switchOn} scale={1.2} />

      {/* Resistors in series */}
      {resistors.map((r, i) => (
        <Resistor
          key={i}
          position={[-0.3 + i * spacing, 0.5, 0]}
          resistance={r}
          scale={1.4}
        />
      ))}

      {/* Light bulb */}
      <LightBulb position={[count * spacing - 0.5, 0, 0]} current={current} scale={1.3} />

      {/* Ammeter */}
      <Ammeter
        position={[-2, -1.2, 0]}
        current={current}
        maxCurrent={voltage / 10}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.9}
      />

      {/* Voltmeter */}
      <Voltmeter
        position={[count * spacing + 0.8, -1.2, 0]}
        voltage={switchOn ? voltage : 0}
        maxVoltage={15}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.9}
      />

      {/* Top wire */}
      <Wire start={[-3, 1, 0]} end={[-1.5, 1, 0]} current={current} />
      <Wire start={[-1.5, 1, 0]} end={[count * spacing - 0.5, 1, 0]} current={current} />

      {/* Bottom wire */}
      <Wire start={[-3, -0.5, 0]} end={[count * spacing - 0.5, -0.5, 0]} current={current} />

      {/* Vertical wires */}
      <Wire start={[-3, -0.5, 0]} end={[-3, 1, 0]} current={current} />
      <Wire start={[count * spacing - 0.5, -0.5, 0]} end={[count * spacing - 0.5, 1, 0]} current={current} />

      {/* Ground plane */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#0c1222" transparent opacity={0.5} />
      </mesh>
      <gridHelper args={[12, 24, '#1e3a5f', '#0d1f3c']} position={[0, -2, 0]} />
    </group>
  )
}

// Parallel layout helper
function ParallelCircuitLayout({ resistors, voltage, current, switchOn }) {
  const branchSpacing = 1.2

  return (
    <group>
      <Battery position={[-3.5, 0, 0]} voltage={voltage} />
      <Switch position={[-2, 0.5, 0]} isOn={switchOn} scale={1.2} />
      <LightBulb position={[3, 0, 0]} current={current} scale={1.3} />

      {/* Parallel resistor branches */}
      {resistors.map((r, i) => {
        const y = (i - (resistors.length - 1) / 2) * branchSpacing
        const branchCurrent = switchOn ? voltage / r : 0
        return (
          <group key={i}>
            <Resistor position={[0.5, y, 0]} resistance={r} scale={1.3} />
            <Wire start={[-1, y, 0]} end={[0.5 - 0.85, y, 0]} current={branchCurrent} />
            <Wire start={[0.5 + 0.85, y, 0]} end={[2, y, 0]} current={branchCurrent} />
          </group>
        )
      })}

      {/* Junction wires */}
      <Wire
        start={[-1, -(resistors.length - 1) / 2 * branchSpacing, 0]}
        end={[-1, (resistors.length - 1) / 2 * branchSpacing, 0]}
        current={current}
      />
      <Wire
        start={[2, -(resistors.length - 1) / 2 * branchSpacing, 0]}
        end={[2, (resistors.length - 1) / 2 * branchSpacing, 0]}
        current={current}
      />

      {/* Main wires */}
      <Wire start={[-3.5, 1, 0]} end={[-1, 1, 0]} current={current} />
      <Wire start={[-1, 1, 0]} end={[-1, (resistors.length - 1) / 2 * branchSpacing, 0]} current={current} />
      <Wire start={[2, (resistors.length - 1) / 2 * branchSpacing, 0]} end={[2, 1, 0]} current={current} />
      <Wire start={[2, 1, 0]} end={[3, 1, 0]} current={current} />

      <Wire start={[-3.5, -1, 0]} end={[-1, -1, 0]} current={current} />
      <Wire start={[-1, -1, 0]} end={[-1, -(resistors.length - 1) / 2 * branchSpacing, 0]} current={current} />
      <Wire start={[2, -(resistors.length - 1) / 2 * branchSpacing, 0]} end={[2, -1, 0]} current={current} />
      <Wire start={[2, -1, 0]} end={[3, -1, 0]} current={current} />

      {/* Battery verticals */}
      <Wire start={[-3.5, -1, 0]} end={[-3.5, 1, 0]} current={current} />
      <Wire start={[3, -1, 0]} end={[3, 1, 0]} current={current} />

      {/* Ammeter */}
      <Ammeter
        position={[-2.5, -1.8, 0]}
        current={current}
        maxCurrent={voltage / 10}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.9}
      />

      {/* Ground */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#0c1222" transparent opacity={0.5} />
      </mesh>
      <gridHelper args={[12, 24, '#1e3a5f', '#0d1f3c']} position={[0, -2.5, 0]} />
    </group>
  )
}

export default CircuitScene
