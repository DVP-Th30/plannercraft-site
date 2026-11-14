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

- « 16 Mo sous Windows » : taille du zip du brouillon `1.0.0-rc.1` (27 octobre 2026). **À remesurer à la sortie** : l'import PDF a été ajouté depuis.
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
