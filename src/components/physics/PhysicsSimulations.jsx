import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Line } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// 1. PENDULUM SCENE (WITH ADJUSTABLE BOB WEIGHT & VISUAL MATERIAL)
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

  // Bob size scales with cube root of mass
  const bobRadius = 0.12 * Math.cbrt(mass)

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
        <mesh position={[0, -length / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, length, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Shiny Pendulum Bob with Visual Weight Appearance */}
        <group position={[0, -length, 0]}>
          <mesh>
            <sphereGeometry args={[bobRadius, 32, 32]} />
            <meshStandardMaterial
              color={mass < 0.5 ? '#f59e0b' : mass > 3 ? '#475569' : '#38bdf8'}
              emissive={mass < 0.5 ? '#b45309' : mass > 3 ? '#1e293b' : '#0284c7'}
              emissiveIntensity={0.6}
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>
          <Text
            position={[0, -bobRadius - 0.22, 0]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            {`${mass.toFixed(1)} kg`}
          </Text>
        </group>
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
// 3. DETAILED 3D EARTH GLOBE & GEOMAGNETIC SHIELD (MAGNETOSPHERE)
// ============================================================
export function EarthMagnetismScene({ showFieldLines = true, showSolarWind = true }) {
  const earthRef = useRef()
  const magnetosphereRef = useRef()

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
    if (magnetosphereRef.current) {
      magnetosphereRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  // Dipole curves around Earth
  const earthDipoleLines = useMemo(() => {
    const curves = []
    const lineCount = 14
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const radius = 2.4 + (i % 3) * 0.9
      const points = []
      for (let step = 0; step <= 32; step++) {
        const theta = (step / 32) * Math.PI
        const r = radius * Math.sin(theta)
        const x = Math.cos(angle) * r
        const y = 3.2 * Math.cos(theta)
        const z = Math.sin(angle) * r
        points.push(new THREE.Vector3(x, y, z))
      }
      curves.push(new THREE.CatmullRomCurve3(points))
    }
    return curves
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* 23.5 Degree Axial Tilt of Earth */}
      <group rotation={[0, 0, 0.41]}>
        {/* ROTATING EARTH GLOBE */}
        <group ref={earthRef}>
          {/* Deep Navy Ocean Sphere */}
          <mesh>
            <sphereGeometry args={[1.5, 48, 48]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>

          {/* Procedural Continents (Eurasia, Americas, Africa landmasses) */}
          {[
            // Africa/Europe
            { pos: [0, 0.4, 1.4], size: [0.6, 0.8, 0.2] },
            // Asia
            { pos: [0.8, 0.6, 1.0], size: [0.9, 0.7, 0.2] },
            // North America
            { pos: [-0.9, 0.7, -0.9], size: [0.8, 0.7, 0.2] },
            // South America
            { pos: [-0.6, -0.5, -1.2], size: [0.5, 0.8, 0.2] },
            // Australia
            { pos: [1.1, -0.6, -0.7], size: [0.5, 0.4, 0.2] },
            // Antarctica ice cap
            { pos: [0, -1.45, 0], size: [0.9, 0.2, 0.9] },
            // Arctic ice cap
            { pos: [0, 1.45, 0], size: [0.8, 0.2, 0.8] },
          ].map((land, idx) => (
            <mesh key={idx} position={land.pos}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color={land.pos[1] > 1.2 || land.pos[1] < -1.2 ? '#f8fafc' : '#15803d'}
                roughness={0.8}
              />
            </mesh>
          ))}

          {/* Translucent Atmosphere Glow Layer */}
          <mesh>
            <sphereGeometry args={[1.58, 36, 36]} />
            <meshStandardMaterial
              color="#7dd3fc"
              transparent
              opacity={0.18}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/* Geographic Rotational Axis Pole Pin */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3.8, 12]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} />
        </mesh>
        <Text position={[0, 2.1, 0]} fontSize={0.18} color="#ffffff">
          Coğrafi Kuzey (North)
        </Text>
        <Text position={[0, -2.1, 0]} fontSize={0.18} color="#ffffff">
          Coğrafi Güney (South)
        </Text>

        {/* Polar Aurora Glow Rings (Kutup Işıkları - Aurora Borealis / Australis) */}
        <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.06, 12, 36]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#10b981"
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, -1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.06, 12, 36]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#8b5cf6"
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Earth's Giant Geomagnetic Field Lines (Magnetosphere) */}
      {showFieldLines && (
        <group ref={magnetosphereRef} rotation={[0, 0, 0.41 - 0.2]}>
          {earthDipoleLines.map((curve, idx) => (
            <mesh key={idx}>
              <tubeGeometry args={[curve, 48, 0.02, 8, false]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.8}
                transparent
                opacity={0.45}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Solar Wind Charged Particles Deflected around Earth */}
      {showSolarWind && (
        <group position={[-5, 0, 0]}>
          {Array.from({ length: 24 }).map((_, i) => (
            <SolarParticle key={i} index={i} />
          ))}
        </group>
      )}
    </group>
  )
}

function SolarParticle({ index }) {
  const ref = useRef()
  const yOffset = (index - 12) * 0.25
  const zOffset = (index % 5 - 2) * 0.4

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 2.5 + index * 0.3) % 4
    ref.current.position.x = -5 + t * 3.5
    // Deflect outward around Earth's magnetosphere boundary
    const distFromOrigin = Math.sqrt(ref.current.position.x ** 2 + yOffset ** 2)
    if (distFromOrigin < 2.5) {
      ref.current.position.y = yOffset * 1.5
    } else {
      ref.current.position.y = yOffset
    }
  })

  return (
    <mesh ref={ref} position={[-5, yOffset, zOffset]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={2} />
    </mesh>
  )
}

// ============================================================
// 4. SOLAR SYSTEM & HELIOSPHERIC SHIELD SCENE
// ============================================================
export function SolarSystemMagnetismScene() {
  const earthOrbitRef = useRef()
  const sunRef = useRef()

  useFrame((state) => {
    if (earthOrbitRef.current) {
      earthOrbitRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* GLOWING CENTRAL SUN */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.4, 36, 36]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>
      <pointLight color="#fef08a" intensity={4} distance={20} />

      {/* Sun Solar Magnetic Flares / Corona Loops */}
      {[-0.6, 0.2, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, i * 1.5, 0]}>
          <torusGeometry args={[1.6, 0.04, 12, 32, Math.PI]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#ea580c"
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* Earth Orbit Circle Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 0.015, 8, 64]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.5} />
      </mesh>

      {/* Earth Orbiting with its Magnetosphere Shield */}
      <group ref={earthOrbitRef}>
        <group position={[4.5, 0, 0]}>
          {/* Earth Body */}
          <mesh>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} />
          </mesh>
          {/* Earth's Bow Shock / Protective Magnetic Cavity */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.65, 0.03, 12, 24, Math.PI]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.5}
            />
          </mesh>
          <Text position={[0, 0.55, 0]} fontSize={0.14} color="#ffffff">
            Dünya (Manyetosfer)
          </Text>
        </group>
      </group>
    </group>
  )
}

// ============================================================
// 5. STANDARD LAB BAR MAGNET (NO COMPASS CLUTTER)
// ============================================================
export function BarMagnetScene({ showFieldLines = true }) {
  const lines = useMemo(() => {
    const curves = []
    const lineCount = 14
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
    <group position={[0, 0, 0]}>
      {/* North Pole Half (Red Metallic) */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
      </mesh>
      <Text position={[0, 0.6, 0.31]} fontSize={0.32} color="#ffffff">
        N
      </Text>
      <Text position={[0, 0.6, -0.31]} rotation={[0, Math.PI, 0]} fontSize={0.32} color="#ffffff">
        N
      </Text>

      {/* South Pole Half (Blue Metallic) */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#2563eb" roughness={0.2} metalness={0.6} />
      </mesh>
      <Text position={[0, -0.6, 0.31]} fontSize={0.32} color="#ffffff">
        S
      </Text>
      <Text position={[0, -0.6, -0.31]} rotation={[0, Math.PI, 0]} fontSize={0.32} color="#ffffff">
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
                opacity={0.45}
                emissive="#0284c7"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

// ============================================================
// 6. PROJECTILE MOTION SCENE (0 - 200 METERS WITH CLEAR METERS)
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

  const distanceMarkers = [0, 20, 40, 60, 80, 100, 150, 200]

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[4, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 6]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>

      {distanceMarkers.map((meter) => {
        const xPos = meter * scale + startX
        return (
          <group key={meter} position={[xPos, -1.23, 0]}>
            <mesh>
              <boxGeometry args={[0.06, 0.02, 1.4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
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

      <Line
        points={trajectoryPoints}
        color="#38bdf8"
        lineWidth={3}
        dashed
        dashScale={40}
        dashSize={0.2}
        gapSize={0.1}
      />

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
