import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Line, Sphere, Html, Trail } from '@react-three/drei'
import * as THREE from 'three'
import {
  calcPendulum,
  calcProjectile,
  projectilePos,
  waveY,
} from '../../data/physics'

// ============================================================
// 1. PENDULUM SCENE
// ============================================================
export function PendulumScene({
  length = 2.0, // meters
  mass = 1.0, // kg
  gravity = 9.81, // m/s²
  angle0Deg = 30, // degrees
  isPlaying = true,
}) {
  const pivotRef = useRef()
  const bobRef = useRef()
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

  // Current instantaneous values
  const currentAngle = angle0Rad * Math.cos(omega * time)
  const currentThetaDeg = (currentAngle * 180) / Math.PI
  const hMax = length * (1 - Math.cos(angle0Rad))
  const hCurrent = length * (1 - Math.cos(currentAngle))
  const vMax = Math.sqrt(2 * gravity * hMax)
  const vCurrent = Math.sqrt(Math.max(0, 2 * gravity * (hMax - hCurrent)))
  const pe = mass * gravity * hCurrent
  const ke = 0.5 * mass * vCurrent * vCurrent
  const totalE = pe + ke

  return (
    <group position={[0, 1.5, 0]}>
      {/* Pivot base on ceiling */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 24]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.5, 0.08, 0.6]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Rotating Pendulum Assembly */}
      <group ref={pivotRef}>
        {/* Rod / String */}
        <mesh position={[0, -length / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, length, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Pendulum Bob */}
        <mesh ref={bobRef} position={[0, -length, 0]}>
          <sphereGeometry args={[0.15 * Math.cbrt(mass), 32, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Energy Monitor In-Scene Overlay */}
      <Html position={[2.2, -0.5, 0]} distanceFactor={6}>
        <div className="bg-dark-900/90 border border-dark-700 p-3 rounded-xl w-44 text-xs select-none shadow-xl">
          <div className="text-[10px] uppercase font-bold text-physics mb-2">
            Enerji Dönüşümü
          </div>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] text-dark-300">
                <span>Potansiyel (PE)</span>
                <span className="font-mono text-amber-400">{pe.toFixed(2)} J</span>
              </div>
              <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-75"
                  style={{ width: `${totalE > 0 ? (pe / totalE) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-dark-300">
                <span>Kinetik (KE)</span>
                <span className="font-mono text-emerald-400">{ke.toFixed(2)} J</span>
              </div>
              <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${totalE > 0 ? (ke / totalE) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-dark-800 text-[10px] flex justify-between text-dark-400">
              <span>Hız:</span>
              <span className="text-white font-mono">{vCurrent.toFixed(2)} m/s</span>
            </div>
            <div className="text-[10px] flex justify-between text-dark-400">
              <span>Açı:</span>
              <span className="text-white font-mono">{currentThetaDeg.toFixed(1)}°</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}

// ============================================================
// 2. WAVE SCENE
// ============================================================
export function WaveScene({
  amplitude = 0.8,
  frequency = 1.0,
  speed = 2.0,
  mode = 'single', // 'single', 'interference', 'standing'
}) {
  const lineRef = useRef()
  const pointCount = 100
  const width = 8

  // Calculate wave vertices on each frame
  useFrame((state) => {
    if (!lineRef.current) return
    const t = state.clock.elapsedTime
    const positions = lineRef.current.geometry.attributes.position.array

    for (let i = 0; i < pointCount; i++) {
      const x = (i / (pointCount - 1)) * width - width / 2
      let y = 0

      if (mode === 'single') {
        const k = (2 * Math.PI) / 3 // wavelength = 3m
        y = amplitude * Math.sin(2 * Math.PI * frequency * t - k * x)
      } else if (mode === 'interference') {
        // Two interfering waves
        const k = (2 * Math.PI) / 3
        const y1 = amplitude * Math.sin(2 * Math.PI * frequency * t - k * x)
        const y2 = amplitude * Math.sin(2 * Math.PI * frequency * t + k * x)
        y = y1 + y2
      } else if (mode === 'standing') {
        // Standing wave: 2A sin(kx) cos(wt)
        const k = (Math.PI * 2) / 4
        y = 2 * amplitude * Math.sin(k * (x + width / 2)) * Math.cos(2 * Math.PI * frequency * t)
      }

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = 0
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true
  })

  // Initial line points
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
        <lineBasicMaterial color="#38bdf8" linewidth={3} />
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
        <lineBasicMaterial color="#334155" transparent opacity={0.5} />
      </line>

      {/* Wave Beads on the wave for better 3D depth */}
      {Array.from({ length: 16 }).map((_, i) => (
        <WaveBead
          key={i}
          x={(i / 15) * width - width / 2}
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
      y = 2 * amplitude * Math.sin(k * (x + 4)) * Math.cos(2 * Math.PI * frequency * t)
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
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.8} />
    </mesh>
  )
}

// ============================================================
// 3. MAGNETIC FIELD SCENE
// ============================================================
export function MagneticFieldScene({
  showFieldLines = true,
  solenoidCurrent = 2.0, // Amperes
  magnetPosition = [0, 0, 0],
}) {
  const lines = useMemo(() => {
    // Generate dipole field lines around a bar magnet
    const curves = []
    const lineCount = 14
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const radius = 1.0 + (i % 3) * 0.5
      const points = []
      for (let step = 0; step <= 32; step++) {
        const theta = (step / 32) * Math.PI
        const r = radius * Math.sin(theta)
        const x = Math.cos(angle) * r
        const y = 1.6 * Math.cos(theta)
        const z = Math.sin(angle) * r
        points.push(new THREE.Vector3(x, y, z))
      }
      curves.push(new THREE.CatmullRomCurve3(points))
    }
    return curves
  }, [])

  return (
    <group position={magnetPosition}>
      {/* North Pole (Red) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 1.0, 0.5]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.4} />
      </mesh>
      <Html position={[0, 0.5, 0.26]} center distanceFactor={6}>
        <div className="text-white font-black text-lg select-none">N</div>
      </Html>

      {/* South Pole (Blue) */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.5, 1.0, 0.5]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.4} />
      </mesh>
      <Html position={[0, -0.5, 0.26]} center distanceFactor={6}>
        <div className="text-white font-black text-lg select-none">S</div>
      </Html>

      {/* Animated Magnetic Field Lines */}
      {showFieldLines && (
        <group>
          {lines.map((curve, idx) => (
            <mesh key={idx}>
              <tubeGeometry args={[curve, 40, 0.015, 8, false]} />
              <meshStandardMaterial
                color="#60a5fa"
                transparent
                opacity={0.35}
                emissive="#38bdf8"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Compass Needles in orbit */}
      {[
        [-1.8, 0, 0],
        [1.8, 0, 0],
        [0, 1.8, 0],
        [0, -1.8, 0],
      ].map((pos, idx) => (
        <CompassWidget key={idx} position={pos} />
      ))}
    </group>
  )
}

function CompassWidget({ position }) {
  return (
    <group position={position}>
      {/* Compass housing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Red North needle */}
      <mesh position={[0, 0.1, 0.03]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.06, 0.2, 12]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Blue South needle */}
      <mesh position={[0, -0.1, 0.03]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.06, 0.2, 12]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  )
}

// ============================================================
// 4. PROJECTILE MOTION SCENE
// ============================================================
export function ProjectileScene({
  v0 = 25, // m/s
  angleDeg = 45, // degrees
  gravity = 9.81, // m/s²
  isFired = false,
  flightTimeProgress = 0, // 0 to 1
}) {
  const angleRad = (angleDeg * Math.PI) / 180
  const tTotal = (2 * v0 * Math.sin(angleRad)) / gravity
  const xMax = (v0 * v0 * Math.sin(2 * angleRad)) / gravity
  const yMax = (v0 * Math.sin(angleRad)) ** 2 / (2 * gravity)

  // Current projectile coordinates
  const currentTime = flightTimeProgress * tTotal
  const currentX = v0 * Math.cos(angleRad) * currentTime
  const currentY = Math.max(0, v0 * Math.sin(angleRad) * currentTime - 0.5 * gravity * currentTime * currentTime)

  // Trajectory curve points (scaled to 3D scene size)
  const scale = 0.12 // scale meters to 3D scene units
  const trajectoryPoints = useMemo(() => {
    const pts = []
    const steps = 50
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tTotal
      const px = v0 * Math.cos(angleRad) * t * scale - 4
      const py = (v0 * Math.sin(angleRad) * t - 0.5 * gravity * t * t) * scale - 1.2
      pts.push(new THREE.Vector3(px, py, 0))
    }
    return pts
  }, [v0, angleRad, gravity, tTotal, scale])

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Plane with Distance Grid */}
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Distance meter markers */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <group key={i} position={[x, -1.22, 0]}>
          <mesh>
            <boxGeometry args={[0.04, 0.02, 1.0]} />
            <meshBasicMaterial color="#475569" />
          </mesh>
        </group>
      ))}

      {/* Cannon / Launcher */}
      <group position={[-4, -1.2, 0]}>
        {/* Base stand */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.3, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Barrel tilted at angle */}
        <group rotation={[0, 0, angleRad]}>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.18, 0.9, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Trajectory Guide Arc */}
      <Line
        points={trajectoryPoints}
        color="#38bdf8"
        lineWidth={2}
        dashed
        dashScale={50}
        dashSize={0.2}
        gapSize={0.1}
      />

      {/* Projectile Ball */}
      {isFired && (
        <mesh position={[currentX * scale - 4, currentY * scale - 1.2, 0]}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={1.2}
          />
        </mesh>
      )}

      {/* Peak height indicator */}
      <group position={[(xMax / 2) * scale - 4, yMax * scale - 1.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, 0.3, 0]} center distanceFactor={6}>
          <div className="bg-dark-900/90 border border-dark-700 text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
            h_max: {yMax.toFixed(1)} m
          </div>
        </Html>
      </group>
    </group>
  )
}
