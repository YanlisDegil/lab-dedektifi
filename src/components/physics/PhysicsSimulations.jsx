import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Line } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// 1. PENDULUM SCENE
// ============================================================
export function PendulumScene({
  length = 2.0,
  mass = 1.0,
  gravity = 9.81,
  angle0Deg = 30,
  isPlaying = true,
}) {
  const pivotRef = useRef()
  const [time, setTime] = useState(0)

  const omega = Math.sqrt(gravity / length)
  const angle0Rad = (angle0Deg * Math.PI) / 180

  useFrame((_, delta) => {
    if (!isPlaying) return
    setTime((t) => t + delta)
    const currentAngle = angle0Rad * Math.cos(omega * (time + delta))
    if (pivotRef.current) {
      pivotRef.current.rotation.z = currentAngle
    }
  })

  return (
    <group position={[0, 1.6, 0]}>
      {/* Ceiling Pivot Mount */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 24]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Rotating Pendulum Assembly */}
      <group ref={pivotRef}>
        {/* String/Rod */}
        <mesh position={[0, -length / 2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, length, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Shiny Pendulum Bob */}
        <mesh position={[0, -length, 0]}>
          <sphereGeometry args={[0.18 * Math.cbrt(mass), 32, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
      </group>
    </group>
  )
}

// ============================================================
// 2. WAVE SCENE
// ============================================================
export function WaveScene({
  amplitude = 0.8,
  frequency = 1.0,
  mode = 'single',
}) {
  const lineRef = useRef()
  const pointCount = 100
  const width = 9

  useFrame((state) => {
    if (!lineRef.current) return
    const t = state.clock.elapsedTime
    const positions = lineRef.current.geometry.attributes.position.array

    for (let i = 0; i < pointCount; i++) {
      const x = (i / (pointCount - 1)) * width - width / 2
      let y = 0

      if (mode === 'single') {
        const k = (2 * Math.PI) / 3
        y = amplitude * Math.sin(2 * Math.PI * frequency * t - k * x)
      } else if (mode === 'interference') {
        const k = (2 * Math.PI) / 3
        y =
          amplitude * Math.sin(2 * Math.PI * frequency * t - k * x) +
          amplitude * Math.sin(2 * Math.PI * frequency * t + k * x)
      } else if (mode === 'standing') {
        const k = (Math.PI * 2) / 4
        y = 2 * amplitude * Math.sin(k * (x + width / 2)) * Math.cos(2 * Math.PI * frequency * t)
      }

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = 0
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true
  })

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(pointCount * 3)
    for (let i = 0; i < pointCount; i++) {
      pos[i * 3] = (i / (pointCount - 1)) * width - width / 2
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
    }
    return pos
  }, [pointCount, width])

  return (
    <group position={[0, 0, 0]}>
      {/* Wave Line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointCount}
            array={initialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" linewidth={3.5} />
      </line>

      {/* Axis Guide */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-width / 2, 0, 0, width / 2, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" transparent opacity={0.6} />
      </line>

      {/* Wave Beads */}
      {Array.from({ length: 18 }).map((_, i) => (
        <WaveBead
          key={i}
          x={(i / 17) * width - width / 2}
          amplitude={amplitude}
          frequency={frequency}
          mode={mode}
        />
      ))}
    </group>
  )
}

function WaveBead({ x, amplitude, frequency, mode }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    let y = 0
    if (mode === 'single') {
      const k = (2 * Math.PI) / 3
      y = amplitude * Math.sin(2 * Math.PI * frequency * t - k * x)
    } else if (mode === 'standing') {
      const k = (Math.PI * 2) / 4
      y = 2 * amplitude * Math.sin(k * (x + 4.5)) * Math.cos(2 * Math.PI * frequency * t)
    } else {
      const k = (2 * Math.PI) / 3
      y =
        amplitude * Math.sin(2 * Math.PI * frequency * t - k * x) +
        amplitude * Math.sin(2 * Math.PI * frequency * t + k * x)
    }
    meshRef.current.position.set(x, y, 0)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.09, 14, 14]} />
      <meshStandardMaterial color="#60a5fa" emissive="#0284c7" emissiveIntensity={1} />
    </mesh>
  )
}

// ============================================================
// 3. MAGNETIC FIELD SCENE (NO SEE-THROUGH TEXT - REAL 3D LABELS)
// ============================================================
export function MagneticFieldScene({
  showFieldLines = true,
  magnetPosition = [0, 0, 0],
}) {
  const lines = useMemo(() => {
    const curves = []
    const lineCount = 16
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const radius = 1.1 + (i % 3) * 0.6
      const points = []
      for (let step = 0; step <= 32; step++) {
        const theta = (step / 32) * Math.PI
        const r = radius * Math.sin(theta)
        const x = Math.cos(angle) * r
        const y = 1.8 * Math.cos(theta)
        const z = Math.sin(angle) * r
        points.push(new THREE.Vector3(x, y, z))
      }
      curves.push(new THREE.CatmullRomCurve3(points))
    }
    return curves
  }, [])

  return (
    <group position={magnetPosition}>
      {/* North Pole Half (Red Metallic) */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* North 'N' on Front Face */}
      <Text
        position={[0, 0.6, 0.31]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        N
      </Text>
      {/* North 'N' on Back Face */}
      <Text
        position={[0, 0.6, -0.31]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        N
      </Text>

      {/* South Pole Half (Blue Metallic) */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#2563eb" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* South 'S' on Front Face */}
      <Text
        position={[0, -0.6, 0.31]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        S
      </Text>
      {/* South 'S' on Back Face */}
      <Text
        position={[0, -0.6, -0.31]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        S
      </Text>

      {/* Field Lines */}
      {showFieldLines && (
        <group>
          {lines.map((curve, idx) => (
            <mesh key={idx}>
              <tubeGeometry args={[curve, 40, 0.016, 8, false]} />
              <meshStandardMaterial
                color="#38bdf8"
                transparent
                opacity={0.4}
                emissive="#0284c7"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Compass Needles around the magnet */}
      {[
        [-2.0, 0, 0],
        [2.0, 0, 0],
        [0, 2.2, 0],
        [0, -2.2, 0],
        [-1.6, 1.4, 0],
        [1.6, 1.4, 0],
      ].map((pos, idx) => (
        <CompassWidget key={idx} position={pos} />
      ))}
    </group>
  )
}

function CompassWidget({ position }) {
  return (
    <group position={position}>
      {/* Brass Case */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Dial Face */}
      <mesh position={[0, 0, 0.045]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>
      {/* Red North needle */}
      <mesh position={[0, 0.11, 0.05]}>
        <coneGeometry args={[0.065, 0.22, 12]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Blue South needle */}
      <mesh position={[0, -0.11, 0.05]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.065, 0.22, 12]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      {/* Center Pivot Pin */}
      <mesh position={[0, 0, 0.06]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  )
}

// ============================================================
// 4. PROJECTILE MOTION SCENE (EXPANDED TO 200 METERS WITH CLEAR METERS)
// ============================================================
export function ProjectileScene({
  v0 = 25,
  angleDeg = 45,
  gravity = 9.81,
  isFired = false,
  flightTimeProgress = 0,
}) {
  const angleRad = (angleDeg * Math.PI) / 180
  const tTotal = (2 * v0 * Math.sin(angleRad)) / gravity
  const xMax = (v0 * v0 * Math.sin(2 * angleRad)) / gravity
  const yMax = (v0 * Math.sin(angleRad)) ** 2 / (2 * gravity)

  // Scene scaling: fit up to 200 meters into view
  const scale = 0.08
  const startX = -6

  const currentTime = flightTimeProgress * tTotal
  const currentX = v0 * Math.cos(angleRad) * currentTime
  const currentY = Math.max(0, v0 * Math.sin(angleRad) * currentTime - 0.5 * gravity * currentTime * currentTime)

  const trajectoryPoints = useMemo(() => {
    const pts = []
    const steps = 60
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tTotal
      const px = v0 * Math.cos(angleRad) * t * scale + startX
      const py = (v0 * Math.sin(angleRad) * t - 0.5 * gravity * t * t) * scale - 1.2
      pts.push(new THREE.Vector3(px, py, 0))
    }
    return pts
  }, [v0, angleRad, gravity, tTotal, scale, startX])

  // Distance markers in meters (0m to 200m)
  const distanceMarkers = [0, 20, 40, 60, 80, 100, 150, 200]

  return (
    <group position={[0, 0, 0]}>
      {/* Light Green Grassy Landing Ground */}
      <mesh position={[4, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 6]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>

      {/* Runway White Distance Lines & 3D Meter Labels */}
      {distanceMarkers.map((meter) => {
        const xPos = meter * scale + startX
        return (
          <group key={meter} position={[xPos, -1.23, 0]}>
            {/* White ground stripe */}
            <mesh>
              <boxGeometry args={[0.06, 0.02, 1.4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* 3D Meter Text (Clearly visible from above and side) */}
            <Text
              position={[0, 0.02, 0.9]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.22}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {`${meter}m`}
            </Text>
          </group>
        )
      })}

      {/* Cannon / Firing Battery */}
      <group position={[startX, -1.2, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.3, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <group rotation={[0, 0, angleRad]}>
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.2, 0.95, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Parabolic Trajectory Guide Line */}
      <Line
        points={trajectoryPoints}
        color="#38bdf8"
        lineWidth={3}
        dashed
        dashScale={40}
        dashSize={0.2}
        gapSize={0.1}
      />

      {/* Glowing Bright Gold/Orange Cannonball with High Visibility */}
      {isFired && (
        <group position={[currentX * scale + startX, currentY * scale - 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#ea580c"
              emissiveIntensity={2.5}
              roughness={0.1}
            />
          </mesh>
          <pointLight color="#f59e0b" intensity={3} distance={3} />
        </group>
      )}

      {/* Maximum Height Indicator */}
      <group position={[(xMax / 2) * scale + startX, yMax * scale - 1.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.18}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0f172a"
        >
          {`h_max: ${yMax.toFixed(1)} m`}
        </Text>
      </group>
    </group>
  )
}
