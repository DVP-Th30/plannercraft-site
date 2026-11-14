# Architecture

## Pile

- **Astro 7**, sortie statique : deux pages HTML (`/` en français, `/en/` en anglais), aucun framework côté navigateur.
- **TypeScript** strict ; le seul script notable est la scène d'ouverture (`src/lib/stage.ts`, environ 6 Ko).
- **Polices** Inter et Inter Tight, auto-hébergées par `@fontsource-variable` (ce sont celles de l'application).
- **Images** optimisées à la construction par `astro:assets` (WebP, trois largeurs).

## Arborescence

| Chemin | Rôle |
|---|---|
| `src/pages/index.astro`, `src/pages/en/index.astro` | Une ligne chacune : `<Landing lang="…" />` |
| `src/components/Landing.astro` | Ordre des blocs de la page |
| `src/components/Stage.astro` | Scène d'ouverture : tunnel, grand titre, planning |
| `src/components/Familiar.astro` | Rapprochement avec MS Project et capture de l'application |
| `src/components/BarStrip.astro` | Bande décorative de barres, animée au scroll en CSS seul |
| `src/components/Tiles.astro` | Quatre blocs : légèreté, navigateur, import PDF, IA |
| `src/components/Access.astro` | Compte avec crédits, ou clé personnelle |
| `src/components/Download.astro` | Téléchargements, version navigateur, pied de page |
| `src/components/Nav.astro`, `Logo.astro` | Navigation flottante, logo dessiné en CSS |
| `src/layouts/Base.astro` | En-tête HTML, balises de référencement, deux petits scripts |
| `src/i18n/` | Tous les textes (`fr.ts`, `en.ts`), typés par `Copy` |
| `src/lib/tunnel.ts` | Géométrie du tunnel et du planning d'arrivée (source unique) |
| `src/lib/stage.ts` | Rendu canvas et progression au scroll |
| `src/config.ts` | Adresses : dépôt, page des versions, version web |
| `src/styles/global.css` | Jetons (couleurs, polices, espacements) et bases |

## La scène d'ouverture

Le tunnel est fait de sept anneaux de barres courbes. Rayons et épaisseurs croissent d'environ 19 % d'un anneau au suivant, et les anneaux tournent en sens alternés : c'est ce qui donne l'illusion de profondeur.

**Deux modes**, choisis par la classe `js-live` que `Base.astro` pose sur `<html>` avant le premier affichage :

- **statique** (pas de JavaScript, ou préférence « moins de mouvement ») : le tunnel est un SVG généré à la construction, suivi du titre et d'un planning en HTML ;
- **animé** : `.stage` fait trois écrans de haut et contient un bloc collant d'un écran. Un canvas 2D y dessine le tunnel ; la position de scroll dans `.stage` donne une progression de 0 à 1.

**L'entrée.** En mode animé, le premier écran part du blanc. Les anneaux se dessinent l'un après l'autre du centre vers l'extérieur (chaque barre s'allonge en tournant), puis le logo et le texte apparaissent : environ 2 s en tout (constante `INTRO` de `stage.ts`). Si la page est rechargée plus bas que le premier écran, l'entrée est sautée. Le SVG ne sert donc qu'au mode statique ; si le script n'a pas démarré après 4 s, `js-live` est retirée et la page y revient.

**Le déroulé.** Chaque barre est un arc de cercle décrit par cinq grandeurs : milieu, direction, longueur, courbure, épaisseur. Dans le tunnel la courbure vaut 1 / rayon ; dans le planning elle vaut 0. `stage.ts` interpole ces grandeurs : l'arc s'ouvre et s'aplatit jusqu'à devenir une barre droite.

- Huit barres (anneaux 1 et 2, champ `task` dans `tunnel.ts`) deviennent les huit tâches du planning ; un losange devient le jalon.
- Les autres barres s'envolent : leur anneau grossit et s'efface, comme si l'on traversait le tunnel.
- Jalons de la progression (constantes en tête de `stage.ts`) : le texte du premier écran s'efface vers 0,03 ; les barres se déroulent de 0,10 à 0,75 ; le titre apparaît à 0,50 ; libellés, lignes et liens à 0,74.

Le planning s'aligne sur la colonne de texte du titre, dont `stage.ts` lit la position. Sous 760 px de large, les libellés des tâches ne sont pas dessinés.

## Les textes

Toute phrase affichée vient de `src/i18n/fr.ts` ou `en.ts`. Les libellés des tâches du planning passent au canvas par l'attribut `data-labels` de `.stage`.

## Ce qui dépend de l'application

- La capture `src/assets/gantt-fr.png` est une capture de test du dépôt de l'application (1280 × 720, interface française). À remplacer par des captures en haute définition, une par langue.
- Les liens de téléchargement pointent tous vers la page de la dernière version publiée (`SITE.releases`).
- La version web est servie sous `/app/` par le déploiement (`docs/INFRA.md`).
