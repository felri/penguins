import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import vertexShader from "./main.vert";
import fragmentShader from "./main.frag";
import { Transition } from "react-transition-group";
import * as THREE from "three";
import "./styles.css";

// function Backgroung() {
//   const meshRef = useRef();
//   const shaderMaterialRef = useRef();
//   const [mouse, setMouse] = useState([0, 0]);
//   const resolution = [window.innerWidth, window.innerHeight];

//   useEffect(() => {
//     const handleResize = () => {
//       resolution[0] = window.innerWidth;
//       resolution[1] = window.innerHeight;
//       meshRef.current.material.uniforms.u_resolution.value = resolution;
//       meshRef.current.material.uniforms.u_resolution.needsUpdate = true;
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useFrame(({ clock }) => {
//     if (!meshRef.current) return;
//     meshRef.current.material.uniforms.u_time.value = clock.elapsedTime;
//   });

//   return (
//     <mesh ref={meshRef}>
//       <planeGeometry args={resolution} />
//       <shaderMaterial
//         ref={shaderMaterialRef}
//         vertexShader={vertexShader}
//         fragmentShader={fragmentShader}
//         uniforms={{
//           u_zoom: { value: 2.0 },
//           u_time: { value: 0 },
//           u_mouse: { value: mouse },
//           u_resolution: { value: resolution },
//         }}
//       />
//     </mesh>
//   );
// }

function Mountain() {
  return (
    <>
      <div className="mountain">
        <div className="mountain-shadow" />
        <div className="snow-shadow" />
        <div className="snow" />
        <div className="snow-jagged" />
        <div className="snow-jagged-shadow" />
      </div>
    </>
  );
}

function Cloud({ size }) {
  return (
    <div className={size}>
      <div className="cloud"></div>
    </div>
  );
}
function CanvasWrapper({ showBackground }) {
  return (
    <div className="background-container">
      <Mountain />
      <div className="back-mountain-container">
        <Mountain />
      </div>
      <div className="front-mountain-container">
        <Mountain />
      </div>
      <Cloud size="x1" />
      <Cloud size="x2" />
      <Cloud size="x3" />
      <Cloud size="x4" />
      <Cloud size="x5" />
    </div>
  );
}

export default CanvasWrapper;
