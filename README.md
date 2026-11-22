# LOVA — Numéro spécial DevFest 2026

Présentation interactive du projet **LOVA — L’héritage malagasy prend vie** (DevFest 2026, hackathon *Preserving the Art*), composée comme un magazine : une, édito, sommaire, ouvertures de partie, reportage, enquête, ours, quatrième de couverture.
Le contenu reprend la documentation du dépôt `devfest2026` : README, MVP, architecture et service NFT.

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

On peut aussi naviguer par balayage tactile. L’URL `#n` ouvre la page *n*. Les titres de la une, du sommaire et des ouvertures de partie sont cliquables.

## Direction artistique

- **Papiers** : chaque page choisit son fond, en alternance clair et sombre : ivoire (`paper`), sable (`sand`), encre (`ink`), lie-de-vin (`wine`). Le titre courant et le folio suivent la page affichée.
- **Typographies** : Bodoni Moda pour la manchette et les titres, Archivo condensé pour les chiffres et la titraille, Newsreader pour le texte courant, IBM Plex Mono pour les données.
- **Motion** : le tourne-page est un balayage `clip-path` ; les titres montent ligne à ligne, les filets se tracent, les schémas se dessinent. Pas de flou, de mode de fusion ni de `backdrop-filter` : l’animation reste fluide sur une machine modeste.
- **Visuels** : motifs tissés génératifs et statuette 3D procédurale. Aucune image patrimoniale n’est reproduite tant que ses droits ne sont pas validés. Les références de token sont des spécimens étiquetés.

## Code

```
presentation/src/
  App.tsx                 Coque : tourne-page, titre courant, folio, sommaire, clavier et tactile
  deck/                   Chorégraphie GSAP déclarative (data-*), bruitages Web Audio, contenus, types
  components/
    Primitives.tsx        Stage, surtitre, titre, chapô, légende, filet
    Print.tsx             Code-barres, tampon, fiche de lot (NFT présenté comme un lot de catalogue)
    GenArt.tsx            Motifs tissés génératifs, déterministes
    Artifact3D.tsx        Statuette procédurale React Three Fiber (vitrine ou scan LiDAR), chargée à la demande
  slides/                 Une scène par page, regroupées par partie ; index.ts fixe la pagination
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
