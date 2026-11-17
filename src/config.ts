import release from './data/release.json';

// Adresses utilisées par la page. Un seul endroit à modifier.
export const SITE = {
  url: 'https://plannercraft.app',
  /** Dépôt de l'application. */
  repo: 'https://github.com/DVP-Th30/plannercraft',
  /** Page de la version publiée (les trois téléchargements y sont) ; sert de repli. */
  releases: release.page,
  /** Version web de l'application, servie par ce même site (voir docs/INFRA.md). */
  webApp: '/app/',
} as const;

/** Identifiant d'un système dans `download.os` (src/i18n). */
export type OsId = 'mac' | 'win' | 'linux';

/**
 * Lien de téléchargement direct d'un système, écrit par `scripts/fetch-release.mjs` au
 * déploiement ; sans version publiée, la page des versions.
 */
export function downloadHref(os: string): string {
  const assets: Record<string, string | null> = release.assets;
  return assets[os] ?? release.page;
}
