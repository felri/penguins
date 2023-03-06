import { Canvas, useFrame} from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import { Perf } from 'r3f-perf'

import { useRef, Suspense, useEffect } from "react";
import { isMobile } from "../utils";
import * as THREE from "three";
import "./styles.css";

export function Penguin({zoom}) {
  const currentZoom = useRef(1.0);
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/PENGUIM.glb");
  const { clips, mixer } = useAnimations(animations, group);

  const config = {
    position: isMobile ? [1.5, -15, -10] : [25.5, -55.5, -50],
    scale: isMobile ? 0.09 : 0.5,
    rotate: isMobile ? [Math.PI * 0.5, 0, 0] : [0, 0, Math.PI * 0.1],
  };

  useEffect(() => {
    const clipAction = mixer.clipAction(clips[0], group.current);
    clipAction.play();
  }, [clips]);

  useFrame(() => {
    const defaultXPose = isMobile ? 1.5 : 25.5;
    const currentX = group.current.position.x;

    const factor = zoom.current ? 25.0 : 1.0;
    const currentZoomValue = currentZoom.current;

    const multiplier = THREE.MathUtils.lerp(
      currentZoomValue,
      factor,
      0.1
    );

    if (currentZoomValue !== factor) {
      group.current.position.x = THREE.MathUtils.lerp(
        currentX,
        defaultXPose * multiplier,
        0.1
      );
      group.current.position.needsUpdate = true;
      currentZoom.current = multiplier;
    }

  });

  return (
    <>
      {/* <Perf /> */}
      <ambientLight intensity={0.2} />
      <pointLight position={[40, 30, 20]} />
      <group ref={group} {...config} dispose={null}>
        <group name="Scene">
          <group name="Armature">
            <primitive object={nodes.EmperorPenguin} />
            <skinnedMesh
              name="Penguin_Emperor"
              geometry={nodes.Penguin_Emperor.geometry}
              material={materials.Material_0}
              skeleton={nodes.Penguin_Emperor.skeleton}
            />
          </group>
        </group>
      </group>
    </>
  );
}

function Wrapper({zoom}) {
  return (
    <div className="container-penguin">
      <Canvas rameloop="demand">
        <Penguin zoom={zoom} />
      </Canvas>
    </div>
  );
}

export default Wrapper;
useGLTF.preload("/PENGUIM.glb");
