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

## Hébergement : GitHub Pages

Activé le 2026-11-14, source « GitHub Actions », domaine personnalisé `plannercraft.app`.

`.github/workflows/deploy.yml`, à chaque poussée sur `main` et à la main :

1. relève la version publiée la plus récente de l'application, pré-versions comprises (`scripts/fetch-release.mjs`, D-009), puis construit le site ;
2. télécharge `plannercraft-<version>-web.tar.gz` de cette même version et le déplie dans `dist/app/` ; s'il n'existe aucune version publiée, le site part sans `/app/` (avertissement dans le journal) ;
3. publie `dist` sur GitHub Pages.

Après chaque nouvelle version de l'application, relancer « Deploy » à la main pour mettre `/app/` à jour (D-008).

## DNS

Domaine enregistré chez Hostinger (expiration 2027-11-13), zone gérée dans hPanel, serveurs de noms `horizon.dns-parking.com` et `orbit.dns-parking.com`. Enregistrements posés à la main le 2026-11-14, TTL 300 :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `dvp-th30.github.io` |

Adresses tirées de la documentation GitHub Pages (« Managing a custom domain ») le jour de la pose. Aucun jeton d'API Hostinger n'a été créé : un jeton Hostinger donne accès à tout le compte, sans restriction par domaine.

Le domaine `.app` n'est servi qu'en HTTPS par les navigateurs : le certificat est émis par GitHub après vérification du DNS, puis « Enforce HTTPS » se coche dans les réglages Pages.

## Reste à faire

- Publier une version de l'application : tant qu'il n'y en a pas, les boutons de téléchargement mènent à une page vide et `/app/` n'existe pas (état au 2026-11-14 : un seul brouillon, `1.0.0-rc.1`).
- Vérifier le domaine dans les réglages du compte GitHub (Pages, « Verified domains ») pour qu'aucun autre compte ne puisse le réclamer.
- Vérifier que le retour de paiement Stripe et la connexion OpenRouter de l'assistant acceptent `https://plannercraft.app/app/` (D-003).

Aucun secret, aucune variable d'environnement.
