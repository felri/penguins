import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import OpacityWrapper from "../opacityWrapper";
import { Perf } from "r3f-perf";

import { useRef, Suspense, useEffect } from "react";
import { isMobile } from "../utils";
import * as THREE from "three";
import "./styles.css";

export function Penguin() {
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

function Wrapper({ show }) {
  return (
    <OpacityWrapper duration={show ? 400 : 1000} from={1} to={0} show={show}>
      <div className="container-penguin">
        <Canvas rameloop="demand">
          <Penguin />
        </Canvas>
      </div>
    </OpacityWrapper>
  );
}

export default Wrapper;
useGLTF.preload("/PENGUIM.glb");
