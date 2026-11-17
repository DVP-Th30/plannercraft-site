// Textes de la page, une langue par fichier. Toute phrase affichée vient d'ici.
import { en } from './en';
import { fr } from './fr';

export type Lang = 'fr' | 'en';

export interface Copy {
  lang: Lang;
  meta: { title: string; description: string };
  nav: { why: string; ai: string; download: string; github: string; main: string; switchTo: string; switchHref: string; switchLang: Lang };
  hero: { slogan: string; download: string; browser: string; platforms: string };
  pitch: { title: string; sub: string };
  /** Huit tâches, dans l'ordre de `TASKS` (src/lib/tunnel.ts), puis le jalon. */
  gantt: { tasks: string[]; milestone: string; alt: string };
  familiar: { title: string; sub: string; alt: string };
  tiles: {
    light: { eyebrow: string; title: string; sub: string; figure: string };
    browser: { eyebrow: string; title: string; sub: string; cta: string };
    pdf: { eyebrow: string; title: string; sub: string };
    ai: { eyebrow: string; title: string; sub: string; prompt: string; proposal: string; accept: string; refuse: string };
  };
  access: { title: string; sub: string; account: { title: string; sub: string }; key: { title: string; sub: string } };
  download: { title: string; sub: string; os: { name: string; detail: string; id: 'mac' | 'win' | 'linux' }[]; browser: string; source: string };
  /** Pages de retour de Stripe pour un achat fait depuis l'application de bureau (D-012). */
  payment: { successTitle: string; successSub: string; cancelTitle: string; cancelSub: string; webApp: string; home: string };
  footer: { legal: string };
}

export const copies: Record<Lang, Copy> = { fr, en };
