# plannercraft-site — consignes du dépôt

Page d'accueil de PlannerCraft (`plannercraft.app`) : site statique Astro, français et anglais. Le dépôt de l'application est `DVP-Th30/plannercraft` ; ce site vit à part parce que ce dépôt interdit le JavaScript écrit à la main.

Lire au démarrage :
- `docs/ARCHITECTURE.md` — composants, scène d'ouverture (tunnel qui se déroule en planning), textes
- `docs/DECISIONS.md` — choix et alternatives écartées (prioritaire : tout choix non évident y est tracé)
- `docs/INFRA.md` — hébergement GitHub Pages, déploiement, DNS, version web sous `/app/`

## Règles

- Langue : documentation, commentaires et messages en français ; identifiants de code en anglais. Commits `type(scope): description` en anglais.
- **Chaque affirmation de la page doit être vraie et vérifiable dans le dépôt de l'application** (tailles, plateformes, prix des crédits, compatibilité). Pas de « tout », pas d'« identique », pas de chiffre non mesuré. La compatibilité MS Project passe par le XML, pas par les `.mpp`.
- Tout texte affiché vient de `src/i18n/` ; une phrase ajoutée en français l'est aussi en anglais dans le même commit.
- La géométrie du tunnel a une seule source : `src/lib/tunnel.ts` (lue par le SVG statique et par le canvas).
- La page doit rester lisible sans JavaScript et avec « moins de mouvement » : le mode statique de `Stage.astro` n'est pas optionnel.
- Aucune requête vers un tiers au chargement (polices auto-hébergées, pas de traceur).
- Checks avant tout commit : `pnpm check`, `pnpm build`. Les lister dans le compte-rendu.
- Node ≥ 22.23.4 (`nvm use`), pnpm. Serveur local : `pnpm dev` (Astro le détache : `pnpm astro dev stop` pour l'arrêter).
