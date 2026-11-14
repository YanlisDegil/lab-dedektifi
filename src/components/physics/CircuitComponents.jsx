import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── BATTERY (Vibrant Gold/Amber Body with Red Terminal) ───
export function Battery({ position = [0, 0, 0], voltage = 9, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.85, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.385, 0.385, 0.35, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.06, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      <Text
        position={[0, 0.4, 0.4]}
        fontSize={0.16}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`${voltage.toFixed(1)}V`}
      </Text>
    </group>
  )
}

// ─── RESISTOR / RHEOSTAT ───
export function Resistor({ position = [0, 0, 0], resistance = 100, scale = 1, isRheostat = false }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.8, 20]} />
        <meshStandardMaterial color={isRheostat ? '#38bdf8' : '#fed7aa'} roughness={0.5} />
      </mesh>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      {/* Bands */}
      {[-0.2, -0.06, 0.08, 0.24].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.165, 0.165, 0.06, 20]} />
          <meshStandardMaterial
            color={i === 0 ? '#b45309' : i === 1 ? '#000000' : i === 2 ? '#ef4444' : '#eab308'}
          />
        </mesh>
      ))}
      <Text
        position={[0, 0.28, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {isRheostat ? `Reosta: ${resistance}Ω` : `${resistance}Ω`}
      </Text>
    </group>
  )
}

// ─── INTERACTIVE WIRE WITH GLOWING ELECTRON PARTICLES ───
export function Wire({ start = [0, 0, 0], end = [1, 0, 0], current = 0 }) {
  const electronRef = useRef()
  const vStart = new THREE.Vector3(...start)
  const vEnd = new THREE.Vector3(...end)
  const dir = new THREE.Vector3().subVectors(vEnd, vStart)
  const len = dir.length()
  const mid = new THREE.Vector3().lerpVectors(vStart, vEnd, 0.5)

  const hasCurrent = Math.abs(current) > 0.001
  const speed = Math.min(3, Math.max(0.5, Math.abs(current) * 1.5))

  useFrame((state) => {
    if (!electronRef.current || !hasCurrent) return
    const t = (state.clock.elapsedTime * speed) % 1
    const p = new THREE.Vector3().lerpVectors(vStart, vEnd, t)
    electronRef.current.position.copy(p)
  })

  return (
    <group>
      <mesh
        position={mid}
        quaternion={new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        )}
      >
        <cylinderGeometry args={[0.035, 0.035, len, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
      </mesh>

      {hasCurrent && (
        <mesh ref={electronRef}>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={2.5} />
        </mesh>
      )}
    </group>
  )
}

// ─── LIGHT BULB (WITH OVERVOLTAGE BURNOUT) ───
export function LightBulb({
  position = [0, 0, 0],
  voltageAcross = 0,
  current = 0,
  isBurnedOut = false,
  scale = 1,
  label = '',
}) {
  const brightness = isBurnedOut ? 0 : Math.min(1.4, Math.max(0, voltageAcross / 9))

  return (
    <group position={position} scale={scale}>
      {/* Socket */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Screw Thread */}
      {[-0.22, -0.15, -0.08].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.185, 0.02, 12, 24]} />
          <meshStandardMaterial color="#b45309" metalness={0.8} />
        </mesh>
      ))}

      {/* Glass Bulb Globe */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshPhysicalMaterial
          color={isBurnedOut ? '#334155' : brightness > 0 ? '#fef08a' : '#f8fafc'}
          emissive={isBurnedOut ? '#000000' : '#fbbf24'}
          emissiveIntensity={brightness * 2.8}
          transparent
          opacity={isBurnedOut ? 0.85 : 0.45}
          roughness={isBurnedOut ? 0.7 : 0.05}
          transmission={isBurnedOut ? 0.1 : 0.85}
        />
      </mesh>

      {/* Filament */}
      {!isBurnedOut ? (
        <group position={[0, 0.22, 0]}>
          <mesh>
            <torusGeometry args={[0.09, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial
              color={brightness > 0 ? '#fef08a' : '#94a3b8'}
              emissive={brightness > 0 ? '#f59e0b' : '#000000'}
              emissiveIntensity={brightness * 4}
            />
          </mesh>
          {brightness > 0.05 && (
            <pointLight color="#fef08a" intensity={brightness * 4} distance={4} />
          )}
        </group>
      ) : (
        <group position={[0, 0.2, 0]}>
          <mesh position={[-0.04, 0, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.04, 0, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {/* Label under socket */}
      <Text
        position={[0, -0.45, 0]}
        fontSize={0.13}
        color={isBurnedOut ? '#ef4444' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {isBurnedOut ? 'PATLADI 💥' : label || `${voltageAcross.toFixed(1)}V`}
      </Text>
    </group>
  )
}

// ─── KNIFE SWITCH ───
export function Switch({ position = [0, 0, 0], isOn = true, onToggle, scale = 1 }) {
  return (
    <group position={position} scale={scale} onClick={onToggle}>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.0, 0.1, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.35, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} />
      </mesh>
      <group position={[-0.35, 0.08, 0]} rotation={[0, 0, isOn ? 0 : 0.6]}>
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.7, 0.05, 0.08]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        <mesh position={[0.65, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

// ============================================================
// MAIN CIRCUIT SCENE (WARM MAHOGANY WOODEN TABLE + EXPANDED DEVRE SEÇENEKLERİ)
// ============================================================
export function CircuitScene({
  circuitType = 'series_2bulbs',
  voltage = 9,
  rheostatResistance = 50,
  switchOn = true,
  isBurnedOut = false,
  isShortCircuit = false,
  onToggleSwitch,
}) {
  const isSeries = circuitType === 'series_2bulbs'
  const isParallel = circuitType === 'parallel_2bulbs'
  const isMixed = circuitType === 'mixed_3bulbs'
  const isRheostat = circuitType === 'rheostat'

  // Voltage distributions
  let bulb1Voltage = 0
  let bulb2Voltage = 0
  let bulb3Voltage = 0
  let totalCurrent = 0

  if (switchOn && !isBurnedOut && !isShortCircuit) {
    if (isSeries) {
      bulb1Voltage = voltage / 2
      bulb2Voltage = voltage / 2
      totalCurrent = voltage / 20
    } else if (isParallel) {
      bulb1Voltage = voltage
      bulb2Voltage = voltage
      totalCurrent = (voltage / 10) * 2
    } else if (isMixed) {
      // 1 bulb in series with (2 bulbs in parallel)
      // R_parallel = 10 / 2 = 5 ohm. R_total = 10 + 5 = 15 ohm.
      totalCurrent = voltage / 15
      bulb1Voltage = totalCurrent * 10 // series bulb gets 2/3 of voltage
      bulb2Voltage = totalCurrent * 5  // parallel bulbs get 1/3 of voltage
      bulb3Voltage = totalCurrent * 5
    } else if (isRheostat) {
      // Bulb in series with rheostat
      const R_tot = 10 + rheostatResistance
      totalCurrent = voltage / R_tot
      bulb1Voltage = totalCurrent * 10
    } else {
      // Single bulb
      bulb1Voltage = voltage
      totalCurrent = voltage / 10
    }
  }

  return (
    <group position={[0, 0, 0]}>
      {/* SOLID WARM MAHOGANY WOODEN LABORATORY WORKBENCH */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[12, 0.45, 6.5]} />
        <meshStandardMaterial color="#5c2c16" roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Wood plank line grooves */}
      {[-2, -0.7, 0.7, 2].map((z, i) => (
        <mesh key={i} position={[0, -1.57, z]}>
          <planeGeometry args={[11.8, 0.015]} />
          <meshBasicMaterial color="#3d1b0c" opacity={0.6} transparent />
        </mesh>
      ))}

      {/* Sturdy Table Legs */}
      {[
        [-5.5, -2.5, -2.7],
        [5.5, -2.5, -2.7],
        [-5.5, -2.5, 2.7],
        [5.5, -2.5, 2.7],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.08, 0.1, 2.2, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      ))}

      {/* Power Source: Battery */}
      <Battery position={[-3.6, -0.6, 0]} voltage={voltage} scale={1.2} />

      {/* Switch */}
      <Switch position={[-1.6, 0.8, 0]} isOn={switchOn} onToggle={onToggleSwitch} scale={1.1} />

      {/* 1. SERIES 2 BULBS */}
      {isSeries && (
        <group>
          <LightBulb
            position={[0.6, 0.8, 0]}
            voltageAcross={bulb1Voltage}
            current={totalCurrent}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 1 (V/2)"
          />
          <LightBulb
            position={[2.8, 0.8, 0]}
            voltageAcross={bulb2Voltage}
            current={totalCurrent}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 2 (V/2)"
          />
          <Wire start={[-3.6, 0.8, 0]} end={[-2.0, 0.8, 0]} current={totalCurrent} />
          <Wire start={[-1.2, 0.8, 0]} end={[0.2, 0.8, 0]} current={totalCurrent} />
          <Wire start={[1.0, 0.8, 0]} end={[2.4, 0.8, 0]} current={totalCurrent} />
          <Wire start={[3.2, 0.8, 0]} end={[3.8, 0.8, 0]} current={totalCurrent} />
          <Wire start={[3.8, 0.8, 0]} end={[3.8, -1.2, 0]} current={totalCurrent} />
          <Wire start={[3.8, -1.2, 0]} end={[-3.6, -1.2, 0]} current={totalCurrent} />
          <Wire start={[-3.6, -1.2, 0]} end={[-3.6, -0.6, 0]} current={totalCurrent} />
        </group>
      )}

      {/* 2. PARALLEL 2 BULBS */}
      {isParallel && (
        <group>
          <LightBulb
            position={[1.5, 0.9, 0]}
            voltageAcross={bulb1Voltage}
            current={totalCurrent / 2}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 1 (V)"
          />
          <LightBulb
            position={[1.5, -0.4, 0]}
            voltageAcross={bulb2Voltage}
            current={totalCurrent / 2}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 2 (V)"
          />
          <Wire start={[-3.6, 0.8, 0]} end={[-2.0, 0.8, 0]} current={totalCurrent} />
          <Wire start={[-1.2, 0.8, 0]} end={[0.2, 0.8, 0]} current={totalCurrent} />
          <Wire start={[0.2, 0.9, 0]} end={[0.2, -0.4, 0]} current={totalCurrent} />
          <Wire start={[0.2, 0.9, 0]} end={[1.1, 0.9, 0]} current={totalCurrent / 2} />
          <Wire start={[0.2, -0.4, 0]} end={[1.1, -0.4, 0]} current={totalCurrent / 2} />
          <Wire start={[1.9, 0.9, 0]} end={[2.8, 0.9, 0]} current={totalCurrent / 2} />
          <Wire start={[1.9, -0.4, 0]} end={[2.8, -0.4, 0]} current={totalCurrent / 2} />
          <Wire start={[2.8, 0.9, 0]} end={[2.8, -0.4, 0]} current={totalCurrent} />
          <Wire start={[2.8, -0.4, 0]} end={[2.8, -1.2, 0]} current={totalCurrent} />
          <Wire start={[2.8, -1.2, 0]} end={[-3.6, -1.2, 0]} current={totalCurrent} />
          <Wire start={[-3.6, -1.2, 0]} end={[-3.6, -0.6, 0]} current={totalCurrent} />
        </group>
      )}

      {/* 3. MIXED 3 BULBS (1 Series + 2 Parallel) */}
      {isMixed && (
        <group>
          {/* Series Bulb (Receives 2/3 of V) */}
          <LightBulb
            position={[0.2, 0.8, 0]}
            voltageAcross={bulb1Voltage}
            current={totalCurrent}
            isBurnedOut={isBurnedOut}
            scale={1.1}
            label="Ana Kol (2V/3)"
          />
          {/* Parallel Bulb 1 */}
          <LightBulb
            position={[2.4, 1.0, 0]}
            voltageAcross={bulb2Voltage}
            current={totalCurrent / 2}
            isBurnedOut={isBurnedOut}
            scale={1.0}
            label="Paralel 1 (V/3)"
          />
          {/* Parallel Bulb 2 */}
          <LightBulb
            position={[2.4, -0.3, 0]}
            voltageAcross={bulb3Voltage}
            current={totalCurrent / 2}
            isBurnedOut={isBurnedOut}
            scale={1.0}
            label="Paralel 2 (V/3)"
          />
          <Wire start={[-3.6, 0.8, 0]} end={[-2.0, 0.8, 0]} current={totalCurrent} />
          <Wire start={[-1.2, 0.8, 0]} end={[-0.2, 0.8, 0]} current={totalCurrent} />
          <Wire start={[0.6, 0.8, 0]} end={[1.5, 0.8, 0]} current={totalCurrent} />
          <Wire start={[1.5, 1.0, 0]} end={[1.5, -0.3, 0]} current={totalCurrent} />
          <Wire start={[1.5, 1.0, 0]} end={[2.0, 1.0, 0]} current={totalCurrent / 2} />
          <Wire start={[1.5, -0.3, 0]} end={[2.0, -0.3, 0]} current={totalCurrent / 2} />
          <Wire start={[2.8, 1.0, 0]} end={[3.5, 1.0, 0]} current={totalCurrent / 2} />
          <Wire start={[2.8, -0.3, 0]} end={[3.5, -0.3, 0]} current={totalCurrent / 2} />
          <Wire start={[3.5, 1.0, 0]} end={[3.5, -0.3, 0]} current={totalCurrent} />
          <Wire start={[3.5, -0.3, 0]} end={[3.5, -1.2, 0]} current={totalCurrent} />
          <Wire start={[3.5, -1.2, 0]} end={[-3.6, -1.2, 0]} current={totalCurrent} />
          <Wire start={[-3.6, -1.2, 0]} end={[-3.6, -0.6, 0]} current={totalCurrent} />
        </group>
      )}

      {/* 4. RHEOSTAT / ADJUSTABLE DIMMER */}
      {isRheostat && (
        <group>
          <Resistor
            position={[0.2, 0.8, 0]}
            resistance={rheostatResistance}
            isRheostat={true}
            scale={1.2}
          />
          <LightBulb
            position={[2.5, 0.8, 0]}
            voltageAcross={bulb1Voltage}
            current={totalCurrent}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label={`Ampul: ${bulb1Voltage.toFixed(1)}V`}
          />
          <Wire start={[-3.6, 0.8, 0]} end={[-2.0, 0.8, 0]} current={totalCurrent} />
          <Wire start={[-1.2, 0.8, 0]} end={[-0.4, 0.8, 0]} current={totalCurrent} />
          <Wire start={[0.8, 0.8, 0]} end={[2.1, 0.8, 0]} current={totalCurrent} />
          <Wire start={[2.9, 0.8, 0]} end={[3.5, 0.8, 0]} current={totalCurrent} />
          <Wire start={[3.5, 0.8, 0]} end={[3.5, -1.2, 0]} current={totalCurrent} />
          <Wire start={[3.5, -1.2, 0]} end={[-3.6, -1.2, 0]} current={totalCurrent} />
          <Wire start={[-3.6, -1.2, 0]} end={[-3.6, -0.6, 0]} current={totalCurrent} />
        </group>
      )}

      {/* 5. SIMPLE CIRCUIT */}
      {!isSeries && !isParallel && !isMixed && !isRheostat && (
        <group>
          <LightBulb
            position={[1.5, 0.8, 0]}
            voltageAcross={bulb1Voltage}
            current={totalCurrent}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul (Tekli)"
          />
          <Wire start={[-3.6, 0.8, 0]} end={[-2.0, 0.8, 0]} current={totalCurrent} />
          <Wire start={[-1.2, 0.8, 0]} end={[1.1, 0.8, 0]} current={totalCurrent} />
          <Wire start={[1.9, 0.8, 0]} end={[3.0, 0.8, 0]} current={totalCurrent} />
          <Wire start={[3.0, 0.8, 0]} end={[3.0, -1.2, 0]} current={totalCurrent} />
          <Wire start={[3.0, -1.2, 0]} end={[-3.6, -1.2, 0]} current={totalCurrent} />
          <Wire start={[-3.6, -1.2, 0]} end={[-3.6, -0.6, 0]} current={totalCurrent} />
        </group>
      )}
    </group>
  )
}

export default CircuitScene
