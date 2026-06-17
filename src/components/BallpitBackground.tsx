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
  impulse: [number, number, number]
  torque: [number, number, number]
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
        <Physics gravity={[0, -9.5, 0]} timeStep={1 / 60}>
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
    const halfWidth = Math.max(5.8, viewport.width / 2)
    const halfHeight = Math.max(4.1, viewport.height / 2)
    const wall = 0.55

    return { halfWidth, halfHeight, wall }
  }, [viewport.height, viewport.width])

  const balls = useMemo<BallSeed[]>(() => {
    return Array.from({ length: count }, (_, id) => {
      const radius = 0.28 + Math.random() * 0.42
      const x = (Math.random() - 0.5) * Math.max(1, (bounds.halfWidth - 1.1) * 1.6)
      const y = -bounds.halfHeight + 1.4 + Math.random() * Math.max(1, bounds.halfHeight * 1.55)
      const z = (Math.random() - 0.5) * 0.45
      const color = COLORS[id % COLORS.length]

      return {
        id,
        radius,
        position: [x, y, z],
        impulse: [(Math.random() - 0.5) * 0.42, Math.random() * 0.26, 0],
        torque: [(Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.08],
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

  useFrame((_, delta) => {
    cursor.current?.setNextKinematicTranslation({
      x: pointer.current.x,
      y: pointer.current.y,
      z: 0,
    })

    for (let index = 0; index < ballBodies.current.length; index += 1) {
      const body = ballBodies.current[index]
      const ball = balls[index]
      if (!body || !ball) continue

      const velocity = body.linvel()
      const speed = Math.hypot(velocity.x, velocity.y, velocity.z)
      if (speed < 0.22) {
        body.wakeUp()
        body.applyImpulse({ x: ball.impulse[0] * delta * 0.9, y: ball.impulse[1] * delta * 0.35, z: 0 }, true)
      }

      body.applyTorqueImpulse(
        {
          x: ball.torque[0] * delta * 0.28,
          y: ball.torque[1] * delta * 0.28,
          z: ball.torque[2] * delta * 0.28,
        },
        true,
      )
    }
  })

  return (
    <>
      <RigidBody ref={cursor} type="kinematicPosition" colliders={false}>
        <BallCollider args={[0.95]} />
      </RigidBody>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[bounds.halfWidth + bounds.wall, bounds.wall, 1.8]}
          position={[0, -bounds.halfHeight - bounds.wall, 0]}
        />
        <CuboidCollider
          args={[bounds.wall, bounds.halfHeight + bounds.wall, 1.8]}
          position={[-bounds.halfWidth - bounds.wall, 0, 0]}
        />
        <CuboidCollider
          args={[bounds.wall, bounds.halfHeight + bounds.wall, 1.8]}
          position={[bounds.halfWidth + bounds.wall, 0, 0]}
        />
        <CuboidCollider
          args={[bounds.halfWidth + bounds.wall, bounds.wall, 1.8]}
          position={[0, bounds.halfHeight + bounds.wall, 0]}
        />
        <CuboidCollider args={[bounds.halfWidth + bounds.wall, bounds.halfHeight + bounds.wall, 0.2]} position={[0, 0, -1.1]} />
        <CuboidCollider args={[bounds.halfWidth + bounds.wall, bounds.halfHeight + bounds.wall, 0.2]} position={[0, 0, 1.1]} />
      </RigidBody>

      {balls.map((ball, index) => (
        <RigidBody
          key={ball.id}
          ref={(body) => {
            ballBodies.current[index] = body
          }}
          position={ball.position}
          colliders={false}
          restitution={0.58}
          friction={0.42}
          linearDamping={0.82}
          angularDamping={0.72}
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
