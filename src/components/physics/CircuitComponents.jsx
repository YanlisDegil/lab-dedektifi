import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── BATTERY (Vibrant Yellow / Red Terminals) ───
export function Battery({ position = [0, 0, 0], voltage = 9, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Battery Cylinder Body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.85, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Dark Brand Band */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.385, 0.385, 0.35, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Positive Nub (Red) */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Negative Cap (Metallic silver) */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.06, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Voltage 3D Text on Body */}
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

// ─── RESISTOR ───
export function Resistor({ position = [0, 0, 0], resistance = 100, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Ceramic Resistor Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.8, 20]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Lead Wires */}
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      {/* Color Bands */}
      {[-0.2, -0.06, 0.08, 0.24].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.165, 0.165, 0.06, 20]} />
          <meshStandardMaterial
            color={i === 0 ? '#b45309' : i === 1 ? '#000000' : i === 2 ? '#ef4444' : '#eab308'}
          />
        </mesh>
      ))}
      {/* Resistance Label */}
      <Text
        position={[0, 0.28, 0]}
        fontSize={0.12}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#ffffff"
      >
        {`${resistance}Ω`}
      </Text>
    </group>
  )
}

// ─── INTERACTIVE WIRE WITH GLOWING ELECTRON FLOW ───
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
      {/* Copper Wire Core */}
      <mesh
        position={mid}
        quaternion={new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        )}
      >
        <cylinderGeometry args={[0.035, 0.035, len, 12]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Moving Electron Bead */}
      {hasCurrent && (
        <mesh ref={electronRef}>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#eab308"
            emissiveIntensity={2.5}
          />
        </mesh>
      )}
    </group>
  )
}

// ─── LIGHT BULB (WITH OVERVOLTAGE BURNOUT ANIMATION) ───
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
      {/* Brass Socket */}
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
          {/* Glowing tungsten coils */}
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
        /* Broken Broken Filament */
        <group position={[0, 0.2, 0]}>
          <mesh position={[-0.04, 0, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.04, 0, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Black soot inside bulb */}
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
        color={isBurnedOut ? '#ef4444' : '#0f172a'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#ffffff"
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
      {/* Switch Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.0, 0.1, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Contacts */}
      <mesh position={[-0.35, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} />
      </mesh>
      {/* Knife Lever (Hinged at left contact) */}
      <group position={[-0.35, 0.08, 0]} rotation={[0, 0, isOn ? 0 : 0.6]}>
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.7, 0.05, 0.08]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        {/* Insulated Handle */}
        <mesh position={[0.65, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

// ============================================================
// MAIN CIRCUIT SCENE (SERIES WITH 2 BULBS, PARALLEL WITH 2 BULBS)
// ============================================================
export function CircuitScene({
  circuitType = 'series_2bulbs', // 'simple', 'series_2bulbs', 'parallel_2bulbs'
  voltage = 9,
  switchOn = true,
  isBurnedOut = false,
  onToggleSwitch,
}) {
  // In series: 2 bulbs share voltage (V / 2 each)
  // In parallel: 2 bulbs each get full voltage (V each)
  const isSeries = circuitType === 'series_2bulbs'
  const isParallel = circuitType === 'parallel_2bulbs'

  const bulbVoltage = !switchOn || isBurnedOut ? 0 : isSeries ? voltage / 2 : voltage
  const current = !switchOn || isBurnedOut ? 0 : isSeries ? voltage / 20 : (voltage / 10) * 2

  return (
    <group position={[0, 0, 0]}>
      {/* Clean Laboratory Workbench Countertop */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[11, 0.35, 6]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Grid Guide Marks on Table */}
      <gridHelper args={[10, 20, '#cbd5e1', '#e2e8f0']} position={[0, -1.61, 0]} />

      {/* Battery */}
      <Battery position={[-3.2, -0.6, 0]} voltage={voltage} scale={1.2} />

      {/* Switch */}
      <Switch position={[-1.2, 0.8, 0]} isOn={switchOn} onToggle={onToggleSwitch} scale={1.1} />

      {/* CIRCUIT CONFIGURATION 1: SERIES CIRCUIT WITH 2 BULBS */}
      {isSeries && (
        <group>
          {/* Bulb 1 */}
          <LightBulb
            position={[0.8, 0.8, 0]}
            voltageAcross={bulbVoltage}
            current={current}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 1 (V/2)"
          />
          {/* Bulb 2 */}
          <LightBulb
            position={[2.8, 0.8, 0]}
            voltageAcross={bulbVoltage}
            current={current}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 2 (V/2)"
          />

          {/* Top Wires connecting battery -> switch -> bulb1 -> bulb2 */}
          <Wire start={[-3.2, 0.8, 0]} end={[-1.6, 0.8, 0]} current={current} />
          <Wire start={[-0.8, 0.8, 0]} end={[0.4, 0.8, 0]} current={current} />
          <Wire start={[1.2, 0.8, 0]} end={[2.4, 0.8, 0]} current={current} />

          {/* Right return wire */}
          <Wire start={[3.2, 0.8, 0]} end={[3.6, 0.8, 0]} current={current} />
          <Wire start={[3.6, 0.8, 0]} end={[3.6, -1.2, 0]} current={current} />
          <Wire start={[3.6, -1.2, 0]} end={[-3.2, -1.2, 0]} current={current} />
          <Wire start={[-3.2, -1.2, 0]} end={[-3.2, -0.6, 0]} current={current} />
        </group>
      )}

      {/* CIRCUIT CONFIGURATION 2: PARALLEL CIRCUIT WITH 2 BULBS */}
      {isParallel && (
        <group>
          {/* Branch 1: Bulb 1 */}
          <LightBulb
            position={[1.5, 0.9, 0]}
            voltageAcross={bulbVoltage}
            current={current / 2}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 1 (V)"
          />
          {/* Branch 2: Bulb 2 */}
          <LightBulb
            position={[1.5, -0.4, 0]}
            voltageAcross={bulbVoltage}
            current={current / 2}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul 2 (V)"
          />

          {/* Junction splits */}
          <Wire start={[-3.2, 0.8, 0]} end={[-1.6, 0.8, 0]} current={current} />
          <Wire start={[-0.8, 0.8, 0]} end={[0.2, 0.8, 0]} current={current} />

          {/* Left Split Vertical Wire */}
          <Wire start={[0.2, 0.9, 0]} end={[0.2, -0.4, 0]} current={current} />
          <Wire start={[0.2, 0.9, 0]} end={[1.1, 0.9, 0]} current={current / 2} />
          <Wire start={[0.2, -0.4, 0]} end={[1.1, -0.4, 0]} current={current / 2} />

          {/* Right Rejoin Vertical Wire */}
          <Wire start={[1.9, 0.9, 0]} end={[2.8, 0.9, 0]} current={current / 2} />
          <Wire start={[1.9, -0.4, 0]} end={[2.8, -0.4, 0]} current={current / 2} />
          <Wire start={[2.8, 0.9, 0]} end={[2.8, -0.4, 0]} current={current} />

          {/* Return Wire */}
          <Wire start={[2.8, -0.4, 0]} end={[2.8, -1.2, 0]} current={current} />
          <Wire start={[2.8, -1.2, 0]} end={[-3.2, -1.2, 0]} current={current} />
          <Wire start={[-3.2, -1.2, 0]} end={[-3.2, -0.6, 0]} current={current} />
        </group>
      )}

      {/* CIRCUIT CONFIGURATION 3: SINGLE BULB SIMPLE CIRCUIT */}
      {!isSeries && !isParallel && (
        <group>
          <LightBulb
            position={[1.5, 0.8, 0]}
            voltageAcross={bulbVoltage}
            current={current}
            isBurnedOut={isBurnedOut}
            scale={1.2}
            label="Ampul (Tekli)"
          />
          <Wire start={[-3.2, 0.8, 0]} end={[-1.6, 0.8, 0]} current={current} />
          <Wire start={[-0.8, 0.8, 0]} end={[1.1, 0.8, 0]} current={current} />
          <Wire start={[1.9, 0.8, 0]} end={[3.0, 0.8, 0]} current={current} />
          <Wire start={[3.0, 0.8, 0]} end={[3.0, -1.2, 0]} current={current} />
          <Wire start={[3.0, -1.2, 0]} end={[-3.2, -1.2, 0]} current={current} />
          <Wire start={[-3.2, -1.2, 0]} end={[-3.2, -0.6, 0]} current={current} />
        </group>
      )}
    </group>
  )
}

export default CircuitScene
