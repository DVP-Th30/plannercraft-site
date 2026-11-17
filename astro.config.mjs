// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Site statique, servi à la racine de plannercraft.app (docs/INFRA.md).
export default defineConfig({
  site: 'https://plannercraft.app',
  // Le plan du site déclare les deux langues de chaque page (balises hreflang).
  integrations: [sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } } })],
});
