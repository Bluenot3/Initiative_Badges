import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Icosahedron, Edges, Environment, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Particle Component
const SceneParticles: React.FC<{ count: number, themeColor: string }> = ({ count, themeColor }) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate random points in a sphere volume once
    const [sphere] = useState(() => {
        const numPoints = count;
        const positions = new Float32Array(numPoints * 3);
        const radius = 3;
        for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * Math.cbrt(Math.random()); // Distribute points within a sphere volume
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
        }
        return positions;
    });

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.02; // Slow rotation for ambience
        }
    });

    return (
        <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={themeColor}
                size={0.012}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    );
};


const SceneContent: React.FC<{ isIntersecting: boolean }> = ({ isIntersecting }) => {
    const boxRef = useRef<THREE.Mesh>(null);
    const icosaRef = useRef<THREE.Mesh>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useFrame(({ clock }, delta) => {
        if (isIntersecting && !prefersReducedMotion) {
            if (boxRef.current) {
                boxRef.current.rotation.y += delta * 0.1;
                boxRef.current.rotation.x += delta * 0.05;
            }
            if (icosaRef.current) {
                icosaRef.current.rotation.y += delta * 0.2;
                icosaRef.current.rotation.z += delta * 0.15;
                // Add a gentle "breathing" animation
                const scale = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.05;
                icosaRef.current.scale.set(scale, scale, scale);
            }
        }
    });

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-glow').trim();

    return (
        <>
            <Box ref={boxRef} args={[2.5, 2.5, 2.5]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#111" transparent opacity={0} />
                <Edges scale={1} threshold={15} color={new THREE.Color(themeColor).multiplyScalar(0.3)} />
            </Box>
            <Icosahedron ref={icosaRef} args={[1, 1]} position={[0, 0, 0]}>
                 <meshStandardMaterial color="#111" transparent opacity={0} />
                <Edges scale={1} threshold={15} color={new THREE.Color(themeColor).multiplyScalar(0.8)} />
            </Icosahedron>
            
            {isIntersecting && !prefersReducedMotion && <SceneParticles count={4000} themeColor={themeColor} />}

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
                    <EffectComposer enableNormalPass={false}>
                        <Bloom intensity={0.25} mipmapBlur luminanceThreshold={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
};

export default React.memo(SceneBacktop3D);