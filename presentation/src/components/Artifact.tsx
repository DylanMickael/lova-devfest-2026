import { lazy, Suspense } from "react";

/** Chargement différé : Three.js n’est téléchargé qu’à la première scène 3D. */
const Artifact3D = lazy(() => import("./Artifact3D"));

export function Artifact({ reduced, mode = "showcase" }: { reduced: boolean; mode?: "showcase" | "scan" }) {
  return (
    <Suspense fallback={<div className="artifact-fallback" aria-hidden="true"><i /></div>}>
      <Artifact3D reduced={reduced} mode={mode} />
    </Suspense>
  );
}
