import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Statuette procédurale — aucun modèle téléchargé (droits des œuvres non
 * encore validés). Un profil sculpté est tourné (LatheGeometry), cannelé
 * comme une pièce de bois tourné, puis éclairé comme en studio photo.
 *   mode="showcase"  bois de rose verni, rotation lente : la « photo » de une
 *   mode="scan"      nuage de points et nappe laser qui balaie, façon LiDAR
 */

type Mode = "showcase" | "scan";
type Props = { reduced: boolean; mode?: Mode };

const PROFILE: [number, number][] = [
  [0.001, 0], [0.62, 0], [0.62, 0.08], [0.47, 0.16], [0.41, 0.42], [0.54, 0.78], [0.6, 1.06],
  [0.5, 1.42], [0.3, 1.72], [0.21, 1.9], [0.3, 2.06], [0.37, 2.26], [0.33, 2.46], [0.19, 2.6], [0.001, 2.66],
];

function useSculpture() {
  return useMemo(() => {
    const curve = new THREE.SplineCurve(PROFILE.map(([x, y]) => new THREE.Vector2(x, y)));
    const pts = curve.getPoints(120).map(p => new THREE.Vector2(Math.max(0.001, p.x * (1 + 0.03 * Math.sin(p.y * 30))), p.y - 1.33));
    const geo = new THREE.LatheGeometry(pts, 96);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Sculpture({ mode, reduced }: { mode: Mode; reduced: boolean }) {
  const geo = useSculpture();
  const group = useRef<THREE.Group>(null);
  const laser = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * (mode === "scan" ? 0.4 : 0.18);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.08, 3, delta);
    if (laser.current) {
      const t = reduced ? 0.5 : (Math.sin(state.clock.elapsedTime * 1.1) + 1) / 2;
      laser.current.position.y = -1.33 + t * 2.7;
      laser.current.scale.setScalar(0.9 + Math.sin(Math.PI * t) * 1.1);
    }
  });

  return (
    <group ref={group}>
      {mode === "showcase" ? (
        <mesh geometry={geo}>
          {/* Matière « ballon » de DESIGN.md : brillante, gonflée, en terre cuite lamba. */}
          <meshPhysicalMaterial color="#b4472a" roughness={0.2} metalness={0} clearcoat={1} clearcoatRoughness={0.06} sheen={0.35} sheenColor="#ffe8be" />
        </mesh>
      ) : (
        <>
          <points geometry={geo}>
            <pointsMaterial color="#f0c58a" size={0.022} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
          </points>
          <mesh ref={laser} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.36, 0.38, 96]} />
            <meshBasicMaterial color="#c0fe04" transparent opacity={0.95} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      <mesh position={[0, -1.47, 0]}>
        <cylinderGeometry args={[0.95, 1.02, 0.28, 64]} />
        {mode === "showcase"
          ? <meshPhysicalMaterial color="#000000" roughness={0.3} clearcoat={0.6} />
          : <meshBasicMaterial color="#f0c58a" wireframe transparent opacity={0.18} />}
      </mesh>
    </group>
  );
}

export default function Artifact3D({ reduced, mode = "showcase" }: Props) {
  return (
    <Canvas className="artifact-canvas" dpr={[1, 1.5]} camera={{ position: [0, 0.2, 5.6], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"} aria-hidden="true">
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={1.8} color="#fff0dc" />
      <directionalLight position={[-4, 1, -2]} intensity={0.6} color="#ffd2a6" />
      <Sculpture mode={mode} reduced={reduced} />
      {mode === "showcase" && <ContactShadows position={[0, -1.62, 0]} opacity={0.5} scale={6} blur={2.6} far={2} frames={1} />}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[6, 2, 1]} color="#fff4e6" />
        <Lightformer form="rect" intensity={1.4} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} color="#ffd9b0" />
        <Lightformer form="rect" intensity={1} position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} color="#e6e0d6" />
      </Environment>
    </Canvas>
  );
}
