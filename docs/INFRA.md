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
3. ajoute les pages d'entrée de la version web pour les adresses de retour du relais (`scripts/app-entries.mjs`, D-011) ;
4. publie `dist` sur GitHub Pages.

Après chaque nouvelle version de l'application, relancer « Deploy » à la main pour mettre `/app/` à jour (D-008).

## DNS

Domaine enregistré chez Hostinger (expiration 2027-11-13). **Zone gérée par Cloudflare depuis le 2026-11-17** (offre Free, compte Cloudflare du propriétaire) : serveurs de noms `keanu.ns.cloudflare.com` et `leah.ns.cloudflare.com`, posés dans hPanel à la place de ceux d'Hostinger. Raison : le tunnel Cloudflare qui publie le relais de l'assistant (`api.plannercraft.app`) exige que la zone soit chez Cloudflare.

| Type | Nom | Valeur | Rôle |
|---|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | site (GitHub Pages) |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | site (GitHub Pages) |
| CNAME | `www` | `dvp-th30.github.io` | site |
| TXT | `@` | `google-site-verification=…` | propriété Search Console (ne pas retirer) |
| TXT | `@` | `resend-domain-verification=…` | propriété du domaine dans Resend |
| TXT | `resend._domainkey` | clé DKIM | envoi d'e-mails (Resend) |
| CNAME | `rsend`, `send` | `rsend-euw1.forge.rmta.net`, `send.forge.rmta.net` | envoi d'e-mails (Resend) |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DMARC |
| CNAME | `api` | tunnel Cloudflare (`….cfargotunnel.com`), créé par le tunnel | relais de l'assistant |

**Tous les enregistrements du site restent en « DNS only »** (nuage gris) : derrière le proxy de Cloudflare, GitHub ne pourrait plus renouveler le certificat HTTPS du domaine. Seul `api` passe par Cloudflare (il le faut pour le tunnel).

Adresses GitHub Pages tirées de la documentation (« Managing a custom domain ») le 2026-11-14. Le domaine `.app` n'est servi qu'en HTTPS : le certificat est émis par GitHub, « Enforce HTTPS » coché dans les réglages Pages.

## Reste à faire

- Vérifier le domaine dans les réglages du compte GitHub (Pages, « Verified domains ») pour qu'aucun autre compte ne puisse le réclamer.
- Vérifier en conditions réelles, sur la version web, la connexion par lien et le retour de paiement (pages d'entrée de D-011).

Aucun secret, aucune variable d'environnement.
