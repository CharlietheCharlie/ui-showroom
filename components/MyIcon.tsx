"use client";

import { Canvas } from "@react-three/fiber";
import {
  Center,
  Environment,
  Float,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

function LogoModel() {
  const scene = useGLTF("/my-icon.glb");

  useEffect(() => {
    scene.scene.traverse((child: any) => {
      if ((child as any).geometry) {
        (child as any).material = new THREE.MeshStandardMaterial({
          color: "silver",
          metalness: 0.9, // 越接近 1 越金屬
          roughness: 0.2, // 越接近 0 越光滑
        });
      }
    });
  }, [scene]);

  return <primitive object={scene.scene} />;
}

export default function MyIcon() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <pointLight position={[0, 2, 5]} intensity={1.2} />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} />
      <Float speed={2} rotationIntensity={1.4} floatIntensity={1.5}>
        <group scale={1.5} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Suspense fallback={null}>
            <Center>
              <LogoModel />
            </Center>
          </Suspense>
        </group>
      </Float>
    </Canvas>
  );
}
