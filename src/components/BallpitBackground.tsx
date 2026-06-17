import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

type BallpitBackgroundProps = {
  count?: number
}

type BallSeed = {
  id: number
  radius: number
  position: [number, number, number]
  color: string
  roughness: number
  metalness: number
}

const COLORS = ['#fb923c', '#f59e0b', '#facc15', '#fed7aa', '#78716c', '#38bdf8']

export default function BallpitBackground({ count = 34 }: BallpitBackgroundProps) {
  return (
    <div aria-hidden="true" className="ballpit-background">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 14], zoom: 54 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[-5, 6, 8]} intensity={2.4} color="#fff7ed" />
        <directionalLight position={[6, -3, 5]} intensity={0.95} color="#38bdf8" />
        <Physics gravity={[0, -18, 0]} timeStep={1 / 60}>
          <BallpitScene count={count} />
        </Physics>
        <Environment preset="city" blur={0.8} />
      </Canvas>
    </div>
  )
}

function BallpitScene({ count }: Required<BallpitBackgroundProps>) {
  const cursor = useRef<RapierRigidBody>(null)
  const ballBodies = useRef<Array<RapierRigidBody | null>>([])
  const pointer = useRef(new THREE.Vector2(999, 999))
  const { viewport } = useThree()
  const bounds = useMemo(() => {
    const halfWidth = Math.max(7.8, viewport.width / 2 + 1.4)
    const halfHeight = Math.max(5.6, viewport.height / 2 + 1.1)

    return { halfWidth, halfHeight }
  }, [viewport.height, viewport.width])

  const balls = useMemo<BallSeed[]>(() => {
    return Array.from({ length: count }, (_, id) => {
      const radius = 0.28 + Math.random() * 0.42
      const x = (Math.random() - 0.5) * Math.min(12, bounds.halfWidth * 1.35)
      const y = -1.4 + Math.random() * Math.min(7, bounds.halfHeight * 1.2)
      const z = (Math.random() - 0.5) * 0.45
      const color = COLORS[id % COLORS.length]

      return {
        id,
        radius,
        position: [x, y, z],
        color,
        roughness: 0.34 + Math.random() * 0.28,
        metalness: color === '#38bdf8' ? 0.35 : 0.18,
      }
    })
  }, [bounds.halfHeight, bounds.halfWidth, count])

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * viewport.width
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * viewport.height
    }

    const hidePointer = () => {
      pointer.current.set(999, 999)
    }

    window.addEventListener('pointermove', updatePointer)
    window.addEventListener('pointerleave', hidePointer)
    return () => {
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('pointerleave', hidePointer)
    }
  }, [viewport.height, viewport.width])

  useFrame(() => {
    cursor.current?.setNextKinematicTranslation({
      x: pointer.current.x,
      y: pointer.current.y,
      z: 0,
    })

    for (const body of ballBodies.current) {
      if (!body) continue
      const translation = body.translation()
      const centerPull = -translation.x * 0.045
      const floorLift = translation.y < -bounds.halfHeight + 2 ? 0.18 : 0

      body.addForce({ x: centerPull, y: floorLift, z: -translation.z * 0.12 }, true)
    }
  })

  return (
    <>
      <RigidBody ref={cursor} type="kinematicPosition" colliders={false}>
        <BallCollider args={[1.15]} />
      </RigidBody>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[bounds.halfWidth + 0.8, 0.65, 1.8]} position={[0, -bounds.halfHeight, 0]} />
        <CuboidCollider args={[0.65, bounds.halfHeight + 0.8, 1.8]} position={[-bounds.halfWidth, 0, 0]} />
        <CuboidCollider args={[0.65, bounds.halfHeight + 0.8, 1.8]} position={[bounds.halfWidth, 0, 0]} />
        <CuboidCollider args={[bounds.halfWidth + 0.8, 0.65, 1.8]} position={[0, bounds.halfHeight, 0]} />
        <CuboidCollider args={[bounds.halfWidth + 0.8, bounds.halfHeight + 0.8, 0.2]} position={[0, 0, -1.1]} />
        <CuboidCollider args={[bounds.halfWidth + 0.8, bounds.halfHeight + 0.8, 0.2]} position={[0, 0, 1.1]} />
      </RigidBody>

      {balls.map((ball, index) => (
        <RigidBody
          key={ball.id}
          ref={(body) => {
            ballBodies.current[index] = body
          }}
          position={ball.position}
          colliders={false}
          restitution={0.78}
          friction={0.18}
          linearDamping={0.28}
          angularDamping={0.34}
        >
          <BallCollider args={[ball.radius]} />
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[ball.radius, 32, 24]} />
            <meshStandardMaterial
              color={ball.color}
              roughness={ball.roughness}
              metalness={ball.metalness}
              emissive={ball.color}
              emissiveIntensity={ball.color === '#38bdf8' ? 0.08 : 0.035}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}
