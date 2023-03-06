import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Text from "../text";
import { Canvas, useFrame } from "@react-three/fiber";
import Papa from "papaparse";
import { OrbitControls, useGLTF, Merged, useTexture } from "@react-three/drei";
import { isMobile } from "../utils";
import { Perf } from "r3f-perf";

function Image({ url, position, rotation, scale }) {
  const texture = useTexture(url);
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} attach="geometry" />
      <meshBasicMaterial
        attach="material"
        map={texture}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function Penguin({ i, d, Blue, Green, Red_1, Red_2, Red_3, Red_4 }) {
  const meshRef = useRef();
  const x = d.bill_depth * 140 - 75;
  const y = d.bill_length * 150 - 70;
  const z = d.body_mass * 150 - 80;
  const randomNumber = Math.random();
  const [hovered, setHovered] = useState(false);

  const initialRandomRotation = (i) => [
    randomNumber * 2 * Math.PI * i,
    randomNumber * 2 * Math.PI * i,
    randomNumber * 2 * Math.PI * i,
  ];

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }, [hovered]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.01;
      meshRef.current.rotation.needUpdate = true;
    }

    if (hovered) {
      if (meshRef.current.scale.x < 1.7) {
        meshRef.current.scale.x += 0.1;
        meshRef.current.scale.y += 0.1;
        meshRef.current.scale.z += 0.1;
      }
    } else {
      if (meshRef.current.scale.x > 1.3) {
        meshRef.current.scale.x -= 0.1;
        meshRef.current.scale.y -= 0.1;
        meshRef.current.scale.z -= 0.1;
      }
    }
  });

  const color =
    d.species === "Adelie" ? (
      <Blue />
    ) : d.species === "Gentoo" ? (
      <Green />
    ) : d.species === "Chinstrap" ? (
      <Red_1 />
    ) : null;

  return (
    <Red_2
      scale={1.3}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() =>
        console.log({
          mass: d.body_mass_g,
          bill_length: d.bill_length_mm,
          bill_depth: d.bill_depth_mm,
        })
      }
      ref={meshRef}
      key={i}
      position={[x, y, z]}
      rotation={initialRandomRotation(i)}
    >
      {color}
      <Red_3 />
      <Red_4 />
    </Red_2>
  );
}

function Penguins({ position, color = "black", data, minMax }) {
  const meshRef = useRef();
  const ref = useRef();
  const { nodes } = useGLTF("/dotgraphpenguin.glb");

  return (
    <Merged meshes={nodes} ref={ref} rotation={[0, 0, 0]}>
      {(meshs) =>
        data.map((d, i) => <Penguin key={i} d={d} i={i} {...meshs} />)
      }
    </Merged>
  );
}

function Tick({
  position,
  rotation,
  min,
  max,
  inside,
  bottom,
  inverse,
  inverseBottom,
}) {
  const tickCount = 10; // number of tick marks to create
  // calculate the tick interval
  const tickInterval = (max - min) / (tickCount - 1);

  const positionText = inverse
    ? [4, -3.5, 0]
    : bottom
    ? [4, -3.5, 0]
    : inverseBottom
    ? [9, -1.4, 0]
    : inside
    ? [-13, -1.3, 0]
    : [3, -1, 0];
  const rotationText = inverse
    ? [0, 0, Math.PI * 0.5]
    : inverseBottom
    ? [0, Math.PI, 0]
    : bottom
    ? [0, 0, Math.PI * 0.5]
    : rotation;
  // generate an array of tick values
  const tickValues = Array.from({ length: tickCount }, (_, i) =>
    (min + i * tickInterval).toFixed(2)
  );
  return (
    <group position={position} rotation={rotation}>
      {tickValues.map((tickValue, i) => (
        <mesh key={i} position={[0, i * 15, 0]}>
          <mesh
            rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]}
            position={[-2, 0, 0]}
          >
            <cylinderGeometry args={[0.4, 0.4, 4, 4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>

          <Text
            position={positionText}
            rotation={rotationText}
            size={4}
            text={tickValue}
          />
        </mesh>
      ))}
    </group>
  );
}

function TopTick({ position, rotation, color }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 10, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Axis({
  position,
  rotation,
  color,
  min = 0,
  max = 100,
  inside,
  bottom,
  inverse,
  inverseBottom,
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, Math.PI * 0.5, 0]}>
        <TopTick rotation={[Math.PI * 0.5, 0, 0]} position={[0, 75, 0]} />
        <TopTick rotation={[Math.PI * 0.5, 0, 0]} position={[0, -75, 0]} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 150, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Tick
        inverseBottom={inverseBottom}
        inverse={inverse}
        position={[2, -70, 0]}
        rotation={[0, 0, 0]}
        min={min}
        max={max}
        inside={inside}
        bottom={bottom}
      />
    </group>
  );
}

function Texts({ minMax }) {
  return (
    <group>
      <Axis
        position={[-84, 0, 77]}
        rotation={[0, Math.PI * 0.5, 0]}
        color="#ffffff"
        min={minMax.bill_length.min}
        max={minMax.bill_length.max}
      />
      <Axis
        position={[75, 0, -84]}
        rotation={[0, 0, 0]}
        color="#ffffff"
        min={minMax.bill_length.min}
        max={minMax.bill_length.max}
        inside
      />
      <Axis
        position={[0, -75, -84]}
        rotation={[0, 0, -Math.PI * 0.5]}
        color="#ffffff"
        min={minMax.body_mass.min}
        max={minMax.body_mass.max}
        bottom
      />
      <Axis
        position={[-84, -75, 2]}
        rotation={[Math.PI * 0.5, Math.PI * 0.5, Math.PI]}
        color="#ffffff"
        bottom
        inverse
        min={minMax.bill_depth.min}
        max={minMax.bill_depth.max}
      />
      <Axis
        position={[75, -84, 2]}
        rotation={[Math.PI * 0.5, 0, Math.PI * 1]}
        color="#ffffff"
        inverseBottom
        min={minMax.bill_depth.min}
        max={minMax.bill_depth.max}
      />
      <Axis
        position={[0, -84, 77]}
        rotation={[Math.PI * 1.5, 0, Math.PI * 1.5]}
        color="#ffffff"
        min={minMax.body_mass.min}
        max={minMax.body_mass.max}
        bottom
      />

      <Text
        position={[-84, 72, 70]}
        rotation={[0, Math.PI * 0.5, 0]}
        size={10}
        text="Bill Length"
      />
      <Text
        position={[-84, 72, 23]}
        rotation={[0, Math.PI * 0.5, 0]}
        size={5}
        text="cm"
      />

      <Text
        position={[-84, -71, -17]}
        rotation={[0, Math.PI * 0.5, 0]}
        size={10}
        text="Bill Depth"
      />
      <Text
        position={[-84, -71, -60]}
        rotation={[0, Math.PI * 0.5, 0]}
        size={5}
        text="cm"
      />
      <Text
        position={[15, 72, -84]}
        rotation={[0, 0, 0]}
        size={10}
        text="Bill Length"
      />
      <Text position={[61, 72, -84]} rotation={[0, 0, 0]} size={5} text="cm" />
      <Text
        position={[-71, -70, -84]}
        rotation={[0, 0, 0]}
        size={10}
        text="Body Mass"
      />
      <Text
        position={[-20, -70, -84]}
        rotation={[0, 0, 0]}
        size={5}
        text="kg"
      />
      <Text
        position={[-72, -84, 73]}
        rotation={[Math.PI * -0.5, Math.PI * 2, Math.PI * 2]}
        size={10}
        text="Body Mass"
      />
      <Text
        position={[-20, -84, 73]}
        rotation={[Math.PI * -0.5, Math.PI * 2, Math.PI * 2]}
        size={5}
        text="kg"
      />
      <Text
        position={[11, -84, -70]}
        rotation={[Math.PI * -0.5, Math.PI * 2, Math.PI * 2]}
        size={10}
        text="Bill Depth"
      />
      <Text
        position={[57, -84, -70]}
        rotation={[Math.PI * -0.5, Math.PI * 2, Math.PI * 2]}
        size={5}
        text="cm"
      />
    </group>
  );
}

function PenguinPlot() {
  const lightRef = useRef();
  const [data, setData] = useState([]);

  const normalize = (value, min, max) => {
    return (value - min) / (max - min);
  };

  const minMax = {
    body_mass: {
      min: 2.5,
      max: 6.3,
    },
    bill_length: {
      min: 3.2,
      max: 5.9,
    },
    bill_depth: {
      min: 1.3,
      max: 2.2,
    },
  };

  useEffect(() => {
    Papa.parse("/penguins.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const dataNormalized = results.data.map((d) => {
          return {
            ...d,
            body_mass: normalize(d.body_mass_g, 2500, 6300),
            bill_length: normalize(d.bill_length_mm, 32, 62),
            bill_depth: normalize(d.bill_depth_mm, 13, 21),
          };
        });
        setData(dataNormalized);
      },
    });
  }, []);

  return (
    <>
      <Perf />
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI * 0.5}
        maxAzimuthAngle={Math.PI * 0.5}
        minAzimuthAngle={0}
        minZoom={isMobile ? 2 : 3}
        repeatKeys={true}
      />
      <ambientLight intensity={0.2} />
      <pointLight position={[20, 0, 150]}  ref={lightRef}  intensity={.6}/>
      {/* {lightRef.current && <pointLightHelper args={[lightRef.current]} />} */}

      <group>
        <mesh>
          <Texts minMax={minMax} />
          <Image
            position={[18, -84, 38]}
            rotation={[-Math.PI * 0.5, 0, 0]}
            scale={100}
            url="/bgcube1.png"
          />
          <Image
            position={[-84, 50, -38]}
            rotation={[0, Math.PI * 0.5, 0]}
            scale={100}
            url="/bgcube2.png"
          />

          <boxGeometry args={[170, 170, 170]} />
          <meshStandardMaterial
            color={new THREE.Color(0x75aedc)}
            side={THREE.BackSide}
          />
        </mesh>
        <group rotation={[0, Math.PI * 0.5, 0]}>
          <Penguins color={"black"} data={data} minMax={minMax} />
        </group>
      </group>
    </>
  );
}

function Wrapper() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        rameloop="demand"
        orthographic
        camera={{
          position: [170, 40, 200],
          zoom: isMobile ? 2.5 : 4,
        }}
      >
        <PenguinPlot />
      </Canvas>
    </div>
  );
}

export default Wrapper;
