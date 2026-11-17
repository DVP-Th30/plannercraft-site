# Décisions

## D-001 — Astro en site statique (2026-11-14)

Astro génère deux pages HTML, gère les deux langues par simple dossier et n'envoie presque pas de JavaScript.

- Écarté : un fichier HTML écrit à la main (deux langues à tenir synchronisées à la main).
- Écarté : Next.js (trop lourd pour une page).

## D-002 — Dépôt séparé de l'application (2026-11-14)

La règle 8 du dépôt `plannercraft` interdit le JavaScript et le TypeScript écrits à la main. Le site vit donc dans `plannercraft-site`.

## D-003 — Version web servie sous `/app/` (2026-11-14)

Le même site GitHub Pages sert la page d'accueil et l'application web : un seul hébergement, un seul réglage DNS. C'est possible parce que la version web est construite avec des adresses relatives (`public_url = "./"` dans son `Trunk.toml`).

- Écarté : `app.plannercraft.app` (second site Pages, second enregistrement DNS).
- **Non vérifié** : que le retour de paiement Stripe et la connexion OpenRouter de l'assistant acceptent cette adresse côté serveur (`plannercraft-relay`).

## D-004 — Texte de la page (2026-11-14)

Direction visuelle A (« tunnel de barres ») et formulations choisies par le propriétaire, en français, au « vous ». MS Project est nommé clairement là où c'est utile ; l'anglais est une traduction à faire relire.

Garde-fous : aucune promesse absolue (« tout », « identique »), aucun prix de MS Project, compatibilité annoncée par le XML seulement. Les chiffres viennent du dépôt de l'application :

- « 23 Mo sous Windows » : taille du zip de la bêta publique `1.0.0-rc.2` (23,2 Mo, 15 novembre 2026 ; 16 Mo au brouillon `1.0.0-rc.1` du 27 octobre, avant l'import PDF et la lecture des `.mpp`). À remesurer à chaque version publiée.
- Crédits de 5 €, 20 € et 50 € : `docs/user/assistant.md` de l'application.

## D-005 — Scène d'ouverture en canvas 2D, sans bibliothèque d'animation (2026-11-14)

Le déroulé des barres est une interpolation de cinq grandeurs par barre ; la progression se lit dans la position de scroll. Une trentaine de barres : un canvas 2D suffit, et le script pèse environ 6 Ko.

- Écarté : GSAP ScrollTrigger (dépendance et licence propre pour un besoin que quelques lignes couvrent).
- Écarté : animer un SVG (les attributs d'arc ne s'interpolent pas proprement vers une droite).

## D-006 — Polices auto-hébergées (2026-11-14)

`@fontsource-variable` plutôt que Google Fonts : aucune requête vers un tiers, donc pas de bandeau de consentement à prévoir.

## D-007 — TypeScript 6, pas 7 (2026-11-14)

`astro check` (0.9.12) refuse TypeScript 7.0. On reste en 6 jusqu'à ce que la vérification le prenne en charge.

## D-008 — Mise en ligne en deux temps (2026-11-14)

Le déploiement ne se lançait qu'à la main tant que le propriétaire n'avait pas validé la page. Après son feu vert, le 2026-11-14 : GitHub Pages activé, domaine `plannercraft.app` déclaré, DNS posé chez Hostinger, et `deploy.yml` se déclenche désormais à chaque poussée sur `main`.

La version web sous `/app/` n'est rafraîchie qu'à un déploiement du site : après une nouvelle version de l'application, relancer « Deploy » à la main.

- Écarté pour l'instant : un déclenchement depuis le dépôt de l'application (il faudrait un jeton entre les deux dépôts) ou un déploiement planifié chaque nuit (des runs pour rien la plupart du temps).

## D-009 — Téléchargements directs, relevés au déploiement (2026-11-15)

Demande du propriétaire pour la bêta publique : un clic sur « Télécharger » doit donner le fichier du système du visiteur.

- `scripts/fetch-release.mjs`, lancé par `deploy.yml` avant la construction, lit la version publiée la plus récente de l'application (pré-versions comprises, brouillons exclus) et écrit `src/data/release.json` : étiquette, page de la version, adresse de chaque fichier (DMG, zip Windows, archive Linux, paquet web). `src/config.ts` en tire `downloadHref(os)`.
- Chaque bouton de système est un lien direct vers son fichier, valable sans JavaScript. Le bouton principal de l'ouverture garde l'ancre `#download` ; un script lui donne le lien direct du système reconnu (`data-download`, `src/layouts/Base.astro`). Téléphones et tablettes : aucun système reconnu (leur identité contient « Mac » ou « Linux »), le bouton mène aux trois téléchargements.
- Le fichier versionné `src/data/release.json` ne porte que les liens de repli (page des versions) : la CI et le poste local construisent sans réseau.
- Écarté : `releases/latest/download/<fichier>` de GitHub. « Latest » ignore les pré-versions, et la bêta en est une (`1.0.0-rc.2`) ; les noms de fichier portent en plus le numéro de version.
- Écarté : interroger l'API de GitHub depuis le navigateur du visiteur (requête vers un tiers au chargement, limite de débit anonyme).
- Conséquence : une nouvelle version de l'application n'apparaît sur le site qu'au déploiement suivant (workflow « Deploy »).

## D-010 — Référencement : ce que la page déclare aux moteurs (2026-11-16)

Demande du propriétaire : faire référencer le site.

- `robots.txt` ouvre tout le site et donne l'adresse du plan du site. La version web sous `/app/` reste ouverte elle aussi : c'est une application, les moteurs n'y trouvent presque rien à lire, et rien ne justifie de la leur interdire.
- Les données structurées annoncent le logiciel à 0 € : il est gratuit, et les crédits de l'assistant sont un achat à part, facultatif. Pas de note ni d'avis : il n'en existe pas.
- Images de partage fabriquées sur le poste et versionnées, plutôt qu'à chaque construction : la CI n'a pas à embarquer un navigateur pour deux images qui changent rarement.
- Écarté : rendre l'image avec `sharp` à partir d'un SVG. Le texte dépendrait des polices installées sur la machine qui construit.
- Écarté : modifier le titre ou la description pour y placer d'autres mots-clés. Ce texte a été validé par le propriétaire (D-004) ; une retouche se décide avec lui.
- Écarté pour l'instant : IndexNow (clé publique à héberger et appel à chaque déploiement) pour un site de deux pages ; la déclaration du plan du site aux moteurs suffit (`docs/INFRA.md`).

## D-011 — Adresses de retour du relais pour la version web (2026-11-17)

Le relais envoie l'utilisateur de la version web vers `https://plannercraft.app/app/login?token=…` (lien de connexion) et `…/app/credits/success` ou `…/app/credits/cancel` (retour de Stripe). L'application lit ces chemins au démarrage, mais GitHub Pages n'avait aucun fichier à ces adresses : 404.

- Le déploiement écrit `app/login.html`, `app/credits/success.html` et `app/credits/cancel.html`, copies de `app/index.html` avec `<base href="/app/">` (`scripts/app-entries.mjs`). GitHub Pages sert `login.html` pour `/app/login` sans redirection, donc le chemin reste celui que l'application attend ; la balise `<base>` garde les fichiers de l'application résolus sous `/app/`.
- Écarté : une page `404.html` qui chargerait l'application (renvoie un code 404, et tout chemin inconnu du site ouvrirait l'application).
- Écarté : des dossiers `login/index.html` (GitHub ajoute alors une barre finale, `/app/login/`, et l'application ne reconnaît plus `/credits/success`).
- L'application de bureau n'est pas concernée : elle se connecte par code et suit le paiement par le solde.

## D-012 — Pages de retour de paiement pour l'application de bureau (2026-11-17)

Un achat de crédits lancé depuis l'application de bureau ouvre Stripe dans le navigateur. Au retour, il tombait sur la version web (`/app/credits/success`), où l'utilisateur n'est pas connecté. Le relais renvoie désormais un achat du bureau vers `/credits/success/` ou `/credits/cancel/` du site (décision D10 du relais) : une page simple, « Paiement reçu, revenez dans PlannerCraft », avec un lien vers la version web pour qui payait depuis le navigateur avec une version de l'application qui ne précise pas son origine.

- Une seule page en français puis en anglais : le relais ne connaît pas la langue de l'application.
- Hors référencement : `noindex`, exclues du plan du site, sans aperçu de partage (`utility` dans `Base.astro`).
- Les crédits arrivent par le webhook de Stripe, jamais par cette page : elle n'affiche que ce que Stripe a dit au navigateur.

