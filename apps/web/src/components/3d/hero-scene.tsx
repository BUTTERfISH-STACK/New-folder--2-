'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Stars, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  OrbitControls,
  Environment,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';

// Floating torus knot
function FloatingTorusKnot({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial 
          color={color} 
          speed={2} 
          distort={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Glowing icosahedron
function GlowingIcosahedron({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1.2, 0]} />
        <MeshWobbleMaterial 
          color={color} 
          factor={0.2} 
          speed={1}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

// Floating spheres
function FloatingSphere({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.1}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Particle ring
function ParticleRing() {
  const points = useMemo(() => {
    const p = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 5 + Math.random() * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    p.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return p;
  }, []);
  
  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.attributes.position.count}
          array={points.attributes.position.array}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#d4af37"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene component
export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 20]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#a855f7" />
        
        {/* Stars background */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Sparkles */}
        <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#d4af37" />
        
        {/* Main 3D objects */}
        <FloatingTorusKnot position={[3, 1, -2]} color="#d4af37" speed={0.8} />
        <FloatingTorusKnot position={[-3, -1, -1]} color="#06b6d4" speed={1.2} />
        
        <GlowingIcosahedron position={[-2, 2, -3]} color="#a855f7" />
        <GlowingIcosahedron position={[2, -2, -2]} color="#22d3ee" />
        
        {/* Small floating spheres */}
        <FloatingSphere position={[4, -1, -1]} color="#d4af37" scale={0.5} />
        <FloatingSphere position={[-4, 1, -2]} color="#06b6d4" scale={0.4} />
        <FloatingSphere position={[0, 3, -3]} color="#a855f7" scale={0.3} />
        
        {/* Particle ring */}
        <ParticleRing />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
