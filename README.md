# LOVA — Présentation DevFest 2026

Présentation interactive plein écran du projet **LOVA — L’héritage malagasy prend vie**, présenté au DevFest 2026 (hackathon *Preserving the Art*).
Le contenu reprend la documentation du dépôt `devfest2026` : README, MVP, architecture et service NFT.

## Lancer

```sh
cd presentation
npm install
npm run dev        # http://localhost:4180
npm run build      # tsc + build de production dans presentation/dist/
npm run preview    # sert le build sur http://localhost:4180
```

Le build est statique (`base: "./"`) et se publie tel quel sur n’importe quel hébergement de fichiers.

## Commandes pendant la présentation

| Touche | Action |
|---|---|
| `→` `Espace` `PageDown` / `←` `PageUp` | Diapositive suivante / précédente |
| `Début` / `Fin` | Première / dernière |
| `T` | Bascule **jour / nuit** (révélation circulaire depuis l’interrupteur) |
| `O` | Sommaire |
| `R` | Rejouer l’animation de la diapositive |
| `M` | Bruitages on/off |
| `F` | Plein écran |

Navigation tactile par balayage horizontal. L’URL `#n` ouvre directement la diapositive *n*. Le thème et le son sont mémorisés dans le navigateur.

## Déroulé (21 blocs)

0. Couverture · L’œuvre en volume (3D) · Sommaire
1. **Le constat** : des œuvres hors de portée, notre réponse
2. **L’expérience** : visiter le musée, contribuer, du bureau à l’iPhone (LiDAR)
3. **La confiance** : revue humaine, NFT de provenance, ce que le token prouve et ne prouve pas
4. **La plateforme** : architecture, du clic au bloc, équipe, démonstration, et après
5. Misaotra

## Architecture du code

```
presentation/src/
  App.tsx                 Coque : navigation, transitions de scène, dock, sommaire, interrupteur de thème
  deck/
    choreo.ts             Chorégraphie déclarative GSAP (data-split, data-in, data-draw, data-count, data-scramble…)
    theme.ts              Thème jour/nuit : store externe + View Transitions API
    sfx.ts                Bruitages synthétisés en Web Audio (aucun fichier)
    content.ts, types.ts  Contenus partagés et types des scènes
  components/
    TokenCard.tsx         Carte NFT holographique (inclinaison 3D, film irisé, reflets)
    GenArt.tsx, genart.ts Motifs tissés génératifs et empreintes d’exemple, déterministes
    Artifact3D.tsx        Statuette procédurale React Three Fiber (vitrine ou scan LiDAR), chargée à la demande
    Backdrop.tsx          Fond animé : halos, treillis de blocs, projecteur, grain
    ChainProgress.tsx     Progression en chaîne de blocs
    Primitives.tsx        Stage, titres, puces, icônes
  slides/                 Une scène par fonction, regroupées par partie
  styles/                 tokens.css (thèmes), deck.css (coque), components.css, slides.css
```

- **Stack** : React 19, TypeScript 7, Vite 8, GSAP 3.15 (SplitText, DrawSVG, ScrambleText), motion, three + React Three Fiber.
- **Thèmes** : toutes les couleurs viennent des jetons CSS de `tokens.css`. Changer de thème ne provoque aucun rendu React.
- **Accessibilité** : `prefers-reduced-motion` est respecté, un bouton fige les animations, les contrôles sont nommés pour les lecteurs d’écran et la navigation se fait entièrement au clavier.
- **Performance** : Three.js est découpé dans un fragment chargé seulement à la première scène 3D.

## Honnêteté des visuels

Le dépôt LOVA n’embarque pas d’images patrimoniales tant que leurs droits ne sont pas validés (D18). La présentation n’utilise donc que des visuels **générés** : motifs tissés, statuette procédurale. Les numéros de token, empreintes sha256 et hashes de transaction affichés sont des **exemples** étiquetés comme tels (« Aperçu illustratif », « exemple »), pas des transactions réelles.
