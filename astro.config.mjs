// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Site statique, servi à la racine de plannercraft.app (docs/INFRA.md).
export default defineConfig({
  site: 'https://plannercraft.app',
  integrations: [sitemap()],
});
