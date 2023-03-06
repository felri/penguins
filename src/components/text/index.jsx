import { useMemo, useRef } from "react";
import { Text3D } from "@react-three/drei";
import { useSpring, animated } from "react-spring";
import * as THREE from "three";

const AnimatedText = animated(Text3D);

export default function Text({ text, hovered, color, ...props }) {
  const mesh = useRef(null);

  const config = useMemo(
    () => ({
      font: '/helvetiker_regular.typeface.json',
    }),
    []
  );

  const spring = useSpring({
    scale: hovered ? .8 : 0.7,
  });

  return (
    <>
      <mesh
        position={[2, 2, 2]}
        ref={mesh}
      >
        <planeGeometry 
          args={[1, 1]} 
          attach="geometry"
        />
        <meshStandardMaterial
          attach="material"
          transparent
          opacity={0}
        />
      </mesh>

      <AnimatedText
        ref={mesh}
        font={config.font}
        letterSpacing={0.1}
        {...props}
        {...spring}
      >
        {text}
        <meshStandardMaterial
          side={THREE.BackSide}
          attach="material"
          color={color || "#fff"}
        />
      </AnimatedText>
    </>
  );
}
