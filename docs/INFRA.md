# Infrastructure

## Dépôts

- Site : `DVP-Th30/plannercraft-site` (ce dépôt, public).
- Application : `DVP-Th30/plannercraft` (public). Ses versions publiées fournissent les téléchargements et la version web.

## Local

- Node ≥ 22.23.4 (`.nvmrc`, `nvm use`), pnpm (version dans `package.json`, champ `packageManager`).
- `pnpm dev` sert `http://localhost:4321`. Astro détache le serveur : `pnpm astro dev stop` l'arrête, `pnpm astro dev logs` montre ses journaux.
- Télémétrie d'Astro désactivée sur le poste (`pnpm astro telemetry disable`).

## Référencement

- **Google Search Console** : propriété « Domaine » `plannercraft.app` (couvre `www` et `/app/`), créée le 2026-11-16 dans le compte Google `pricebox.fr` du propriétaire. Preuve de propriété : un enregistrement TXT `google-site-verification=…` à la racine de la zone DNS (Hostinger). Le retirer fait perdre la propriété.
- **Plan du site** déclaré : `https://plannercraft.app/sitemap-index.xml`.

## Intégration continue

`.github/workflows/ci.yml`, sur chaque poussée vers `main` et chaque PR : `pnpm check`, puis `pnpm build`.

## Hébergement : GitHub Pages (pas encore activé)

`.github/workflows/deploy.yml`, lancement manuel :

1. relève la version publiée la plus récente de l'application, pré-versions comprises (`scripts/fetch-release.mjs`, D-009), puis construit le site ;
2. télécharge `plannercraft-<version>-web.tar.gz` de cette même version et le déplie dans `dist/app/` ; s'il n'existe aucune version publiée, le site part sans `/app/` (avertissement dans le journal) ;
3. publie `dist` sur GitHub Pages.

État au 2026-11-14 : aucune version publique de l'application (un seul brouillon, `1.0.0-rc.1`). Tant que c'est le cas, les boutons de téléchargement mènent à une page vide et `/app/` n'existe pas.

### À faire pour la mise en ligne

1. Publier une version de l'application.
2. Dans les réglages du dépôt : Pages, source « GitHub Actions ».
3. Lancer le workflow « Deploy ».
4. Domaine personnalisé `plannercraft.app` dans les réglages Pages, puis DNS chez Hostinger (le domaine y est enregistré, serveurs de noms `dns-parking.com`) : quatre enregistrements A et quatre AAAA vers GitHub Pages pour `plannercraft.app`, un CNAME `www` vers `dvp-th30.github.io`. Adresses à reprendre dans la documentation GitHub au moment de la pose.
5. Cocher « Enforce HTTPS » (obligatoire : le domaine `.app` n'est servi qu'en HTTPS).
6. Passer `deploy.yml` en déclenchement sur `main` (D-008).

Aucun secret, aucune variable d'environnement.
