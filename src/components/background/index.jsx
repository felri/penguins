import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import vertexShader from "./main.vert";
import fragmentShader from "./main.frag";
import * as THREE from "three";

function Backgroung({ isToggled }) {
  const meshRef = useRef();
  const shaderMaterialRef = useRef();
  const [mouse, setMouse] = useState([0, 0]);
  const resolution = [window.innerWidth, window.innerHeight];

  useEffect(() => {
    const handleResize = () => {
      resolution[0] = window.innerWidth;
      resolution[1] = window.innerHeight;
      meshRef.current.material.uniforms.u_resolution.value = resolution;
      meshRef.current.material.uniforms.u_resolution.needsUpdate = true;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.material.uniforms.u_time.value = clock.elapsedTime;
    meshRef.current.material.uniforms.u_mouse.value = mouse;
    const currentZoom = isToggled.current ? 1.0 : 2.0;
    const meshZoom = meshRef.current.material.uniforms.u_zoom.value;
    if (currentZoom !== meshZoom) {
      meshRef.current.material.uniforms.u_zoom.value = THREE.MathUtils.lerp(
        meshZoom,
        currentZoom,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={resolution} />
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_zoom: { value: 2.0 },
          u_time: { value: 0 },
          u_mouse: { value: mouse },
          u_resolution: { value: resolution },
        }}
      />
    </mesh>
  );
}

function CanvasWrapper({ isToggled }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <Canvas rameloop="demand">
        <Backgroung isToggled={isToggled} />
      </Canvas>
    </div>
  );
}

export default CanvasWrapper;
