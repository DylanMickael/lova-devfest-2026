import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../deck/theme";

/**
 * Artefact procédural — aucun modèle téléchargé (droits des œuvres non
 * encore validés). Un profil de statuette sculptée est tourné (LatheGeometry),
 * cannelé, posé sur un socle, et entouré d’un anneau de blocs : l’œuvre et sa
 * chaîne de provenance.
 *   mode="showcase"  matière physique irisée, rotation lente
 *   mode="scan"      nuage de points + nappe laser qui balaie, façon LiDAR
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
    const pts = curve.getPoints(120).map(p => new THREE.Vector2(Math.max(0.001, p.x * (1 + 0.035 * Math.sin(p.y * 30))), p.y - 1.33));
    const geo = new THREE.LatheGeometry(pts, 96);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

const PALETTE = {
  dark: { body: "#5a2a1c", sheen: "#e7c08f", ring: "#c8a174", point: "#f6d7a7", laser: "#8fe3ff" },
  light: { body: "#c9a57a", sheen: "#ffffff", ring: "#7e2a20", point: "#67271f", laser: "#7e2a20" },
} as const;

function Sculpture({ mode, reduced, colors }: { mode: Mode; reduced: boolean; colors: (typeof PALETTE)[keyof typeof PALETTE] }) {
  const geo = useSculpture();
  const group = useRef<THREE.Group>(null);
  const laser = useRef<THREE.Mesh>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * (mode === "scan" ? 0.35 : 0.22);
    // Parallaxe douce au pointeur
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.12, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, state.pointer.x * 0.12, 3, delta);
    if (laser.current) {
      const t = reduced ? 0.5 : (Math.sin(state.clock.elapsedTime * 1.1) + 1) / 2;
      laser.current.position.y = -1.33 + t * 2.7;
      const s = 0.25 + Math.sin(Math.PI * t) * 0.45;
      laser.current.scale.setScalar(s * 2.2 + 0.4);
    }
    if (pointsMat.current) pointsMat.current.opacity = 0.65 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
  });

  return (
    <group ref={group}>
      {mode === "showcase" ? (
        <mesh geometry={geo} castShadow>
          <meshPhysicalMaterial color={colors.body} roughness={0.32} metalness={0.35} clearcoat={1} clearcoatRoughness={0.18}
            iridescence={1} iridescenceIOR={1.6} sheen={1} sheenColor={colors.sheen} sheenRoughness={0.4} />
        </mesh>
      ) : (
        <>
          <points geometry={geo}>
            <pointsMaterial ref={pointsMat} color={colors.point} size={0.022} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
          </points>
          <mesh geometry={geo}>
            <meshBasicMaterial color={colors.point} wireframe transparent opacity={0.08} />
          </mesh>
          <mesh ref={laser} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.36, 0.38, 96]} />
            <meshBasicMaterial color={colors.laser} transparent opacity={0.95} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      {/* Socle */}
      <mesh position={[0, -1.47, 0]}>
        <cylinderGeometry args={[0.95, 1.02, 0.28, 64]} />
        <meshStandardMaterial color={mode === "scan" ? colors.point : "#15110e"} roughness={0.55} metalness={0.2} wireframe={mode === "scan"} transparent opacity={mode === "scan" ? 0.15 : 1} />
      </mesh>
    </group>
  );
}

function BlockRing({ reduced, color }: { reduced: boolean; color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const ring = useRef<THREE.Group>(null);
  const COUNT = 28;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (ring.current && !reduced) ring.current.rotation.y -= delta * 0.18;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      const bob = reduced ? 0 : Math.sin(t * 1.4 + i * 0.7) * 0.05;
      dummy.position.set(Math.cos(a) * 1.75, bob, Math.sin(a) * 1.75);
      dummy.rotation.set(t * 0.3 + i, a, 0);
      const s = i % 4 === 0 ? 0.11 : 0.07;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={ring} rotation={[0.32, 0, -0.12]} position={[0, 0.1, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.22} emissive={color} emissiveIntensity={0.25} />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.004, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Dust({ reduced, color }: { reduced: boolean; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.2 + Math.random() * 2.4, a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r, Math.random() * 4 - 2, Math.sin(a) * r], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, delta) => { if (ref.current && !reduced) ref.current.rotation.y += delta * 0.04; });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={color} size={0.018} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}

export default function Artifact3D({ reduced, mode = "showcase" }: Props) {
  const theme = useTheme();
  const colors = PALETTE[theme];
  return (
    <Canvas className="artifact-canvas" dpr={[1, 2]} camera={{ position: [0, 0.35, 5.4], fov: 38 }} gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? "demand" : "always"} aria-hidden="true">
      <ambientLight intensity={theme === "dark" ? 0.25 : 0.6} />
      <directionalLight position={[3, 4, 2]} intensity={theme === "dark" ? 1.6 : 1.2} color="#ffe6c4" />
      <pointLight position={[-3, 1, -2]} intensity={6} color={theme === "dark" ? "#8f7bff" : "#c8a174"} distance={8} />
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.05} floatIntensity={reduced ? 0 : 0.35}>
        <Sculpture mode={mode} reduced={reduced} colors={colors} />
        <BlockRing reduced={reduced} color={colors.ring} />
      </Float>
      <Dust reduced={reduced} color={colors.point} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[6, 2, 1]} color="#fff1dc" />
        <Lightformer form="rect" intensity={2.4} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} color="#ff9bc8" />
        <Lightformer form="rect" intensity={2.4} position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} color="#8ed8ff" />
        <Lightformer form="ring" intensity={1.6} position={[0, -2, -4]} scale={3} color="#c8a174" />
      </Environment>
    </Canvas>
  );
}
