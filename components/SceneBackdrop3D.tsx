
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Icosahedron, Edges, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const SceneContent: React.FC<{ isIntersecting: boolean }> = ({ isIntersecting }) => {
    const groupRef = useRef<THREE.Group>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useFrame((_, delta) => {
        if (groupRef.current && isIntersecting && !prefersReducedMotion) {
            groupRef.current.rotation.y += delta * 0.15;
            groupRef.current.rotation.x += delta * 0.1;
        }
    });

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-glow').trim();

    return (
        <>
            <group ref={groupRef}>
                <Box args={[2.5, 2.5, 2.5]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#111" transparent opacity={0} />
                    <Edges scale={1} threshold={15} color={new THREE.Color(themeColor).multiplyScalar(0.3)} />
                </Box>
                <Icosahedron args={[1, 0]} position={[0, 0, 0]}>
                     <meshStandardMaterial color="#111" transparent opacity={0} />
                    <Edges scale={1} threshold={15} color={new THREE.Color(themeColor).multiplyScalar(0.8)} />
                </Icosahedron>
            </group>

            <Environment preset="studio" />
            <pointLight position={[10, 10, 10]} intensity={150} color={themeColor} />
            <pointLight position={[-10, -10, -10]} intensity={50} color="white" />
        </>
    );
};


const SceneBacktop3D: React.FC<{ isIntersecting: boolean }> = ({ isIntersecting }) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <div className="absolute inset-0 -z-10 rounded-md overflow-hidden opacity-50">
            <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 6], fov: 35 }}
            >
                <SceneContent isIntersecting={isIntersecting} />
                {!prefersReducedMotion && (
                    // FIX: The 'disableNormalPass' prop is deprecated. Replaced with 'enableNormalPass={false}' for equivalent functionality.
                    <EffectComposer enableNormalPass={false}>
                        <Bloom intensity={0.2} mipmapBlur luminanceThreshold={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
};

export default React.memo(SceneBacktop3D);