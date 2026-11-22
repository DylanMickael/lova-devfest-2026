# LOVA — Numéro spécial DevFest 2026

Pitch interactif du projet **LOVA — L’héritage malagasy prend vie** (DevFest 2026, hackathon *Preserving the Art*), en neuf pages : 1. « L’art est mort » — ou pas ? ; 2. le contexte (480 000+ artisans et artistes) ; 3. la problématique ; 4. LOVA, la couverture ; 5. comment ça marche (IA, réalité augmentée, blockchain) ; 6. les outils ; 7. l’architecture en un diagramme ; 8. le business plan ; 9. merci et l’équipe.
Le contenu reprend la documentation du dépôt `devfest2026` : README, MVP, architecture et service NFT. Le business plan est une projection de travail, à valider avec les premiers partenaires.

- **En ligne (serveur)** : https://lova.132-145-17-50.sslip.io/
- **Miroir GitHub Pages** : https://dylanmickael.github.io/lova-devfest-2026/

## Lancer en local

```sh
cd presentation
npm install
npm run dev        # http://localhost:4180
npm run build      # tsc + build de production dans presentation/dist/
```

## Pendant la présentation

| Touche | Action |
|---|---|
| `→` `Espace` / `←` | Page suivante / précédente (la page se tourne) |
| `Début` / `Fin` | Une / quatrième de couverture |
| `O` | Sommaire |
| `R` | Rejouer l’animation de la page |
| `M` | Bruitages on/off |
| `F` | Plein écran |

On peut aussi naviguer par balayage tactile. L’URL `#n` ouvre la page *n*. Les rubriques de la couverture (page 4) mènent aux pages correspondantes.

## Direction artistique

Le numéro suit le [`DESIGN.md`](https://github.com/songomby-D1/devfest2026/blob/develop/DESIGN.md) de LOVA : un musée qui a l’allure d’un pas de tir.

- **Fonds** : chaque page choisit son fond, en alternance clair et sombre : papier `#FBFAF4` (`paper`), ciel `#CCE6F6 → #B8DAF1` (`sand`), galerie `#0D0C0B` sous un projecteur chaud (`ink`), indigo `#1F2A5C` (`wine`). L’en-tête et le HUD suivent la page affichée.
- **Accent** : un seul, le lime `#C0FE04`. Il surligne le mot clé du titre sur fond clair, l’écrit sur fond sombre, et remplit l’axe de progression, le focus et la sélection.
- **Typographies** (OFL, auto-hébergées en WOFF2) : TikTok Sans pour les titres (700, largeur 120, capitales) et le texte, Departure Mono pour l’interface (en-tête, HUD, surtitres, étiquettes), Geist Mono pour les chiffres et les données.
- **Grille** : trois colonnes à marge `clamp(16px, 4.36vw, 72px)`, repères visibles et deux horizontales à 33,2 % et 68,7 % avec des croix aux croisements. Interface plate, filets de 1 px ; la profondeur va aux œuvres.
- **Motion** : le tourne-page est un balayage `clip-path` ; les titres montent ligne à ligne (1,2 s, 80 ms de décalage, `cubic-bezier(.22, 1, .36, 1)`), les paragraphes montent de 12 px. `prefers-reduced-motion` rend tout instantané.
- **Visuels** : œuvres malagasy du domaine public ou CC0 (Wikimedia Commons), créditées là où elles apparaissent : aloalo mahafaly (page 1), couple sakalava du Metropolitan Museum of Art (page 2), portraits de Ranavalona Ire, Radama II et Ranavalona II (page 3), *Andrianampoinimerina* et *Radama Ier* de Philippe-Auguste Ramanankirahina (1860–1915) en couverture. Ailleurs, des motifs tissés génératifs en palette lamba et une statuette 3D procédurale. Les références de token sont des spécimens étiquetés.
- **Export PDF** : `exports/LOVA-DevFest-2026.pdf`, une capture par page en 16:9, animations à leur état final.

## Code

```
presentation/src/
  App.tsx                 Coque : tourne-page, titre courant, folio, sommaire, clavier et tactile
  deck/                   Chorégraphie GSAP déclarative (data-*), bruitages Web Audio, contenus, œuvres et crédits, types
  components/
    Primitives.tsx        Stage, surtitre, titre, chapô, légende, filet
    Print.tsx             Code-barres, tampon, fiche de lot (NFT présenté comme un lot de catalogue)
    GenArt.tsx            Motifs tissés génératifs, déterministes
    Artifact3D.tsx        Statuette procédurale React Three Fiber (vitrine ou scan LiDAR), chargée à la demande
  slides/                 Pitch.tsx : les neuf scènes du pitch ; index.ts fixe la pagination
  assets/                 Polices de marque (OFL) et œuvres reproduites (WebP)
  styles/                 base (papiers, polices), chrome (coque), editorial (composants), pages
```

Stack : React 19, TypeScript 7, Vite 8, GSAP 3.15, motion, three + React Three Fiber.

## Déploiement sur le serveur

Le conteneur `lova-deck` (image `caddy:2.10-alpine`, déjà présente pour le Caddy public) sert `presentation/dist` en lecture seule sur le réseau Docker `ades`. Le Caddy public d’`ades-it-ecosystem` termine le TLS via le fichier `/opt/ades/sites/lova.caddy`, prévu pour les sites propres à l’hôte et jamais écrasé par la CI.

```sh
# Mettre à jour la présentation : rebuild, le conteneur sert aussitôt la nouvelle version.
(cd presentation && npm ci && npm run build)

# Première installation (déjà faite)
docker compose -f deploy/compose.yml up -d
cp deploy/lova.caddy /opt/ades/sites/lova.caddy
docker exec ades-it-ecosystem-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec ades-it-ecosystem-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Le conteneur est limité à 64 Mo de RAM et 0,25 CPU, avec un système de fichiers en lecture seule. Les assets versionnés sont servis avec un cache immuable d’un an, et le HTML sans cache.

GitHub Pages reste reconstruit à chaque push sur `main` (`.github/workflows/pages.yml`).
