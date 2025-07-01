import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function GlassStrip() {
  const meshRef = useRef();

  const geometry = new THREE.TorusGeometry(3.5, 0.1, 16, 100, Math.PI * 1.5);
  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0.1,
    metalness: 0.2,
    transmission: 1.0,
    ior: 2.33,
    thickness: 1.0,
    color: "#ffffff",
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function GlassAnimation({ position }) {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: position === "topLeft" ? "10px" : "auto",
        left: position === "topLeft" ? "10px" : "auto",
        bottom: position === "bottomRight" ? "10px" : "auto",
        right: position === "bottomRight" ? "10px" : "auto",
        width: "150px",
        height: "150px",
        zIndex: 0,
      }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        {/* <Environment files="/public/studio.hdr" /> */}
        <GlassStrip />
      </Suspense>
    </Canvas>
  );
}
