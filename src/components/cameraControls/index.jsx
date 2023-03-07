import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { isMobile } from "../utils";

function CameraControls() {

  return (
    <OrbitControls
      maxPolarAngle={Math.PI * 0.5}
      maxAzimuthAngle={Math.PI * 0.5}
      minAzimuthAngle={0}
      minZoom={isMobile ? 2 : 3}
    />
  );
}

export default CameraControls;
