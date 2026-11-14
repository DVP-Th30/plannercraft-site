# plannercraft-site

Page d'accueil de [PlannerCraft](https://github.com/DVP-Th30/plannercraft), logiciel de planification de projet libre et gratuit. Site statique (Astro), en français et en anglais, destiné à `plannercraft.app`.

## Lancer en local

Node 22.23.4 ou plus récent (`nvm use`), pnpm.

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm check    # vérification des types
pnpm build    # site statique dans dist/
```

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — composants, scène d'ouverture, textes
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — pourquoi ces choix
- [`docs/INFRA.md`](docs/INFRA.md) — hébergement, déploiement, DNS

## Licence

Au choix, [MIT](LICENSE-MIT) ou [Apache 2.0](LICENSE-APACHE), comme l'application.
