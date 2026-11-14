import type { Copy } from './index';

// Texte validé par le propriétaire le 2026-11-14 (docs/DECISIONS.md, D-004).
export const fr: Copy = {
  lang: 'fr',
  meta: {
    title: 'PlannerCraft — le planning de projet, libre et gratuit',
    description:
      'Logiciel de planification Gantt gratuit et open source, pour macOS, Windows, Linux et le navigateur. Import de plannings PDF, assistant IA, échange XML avec MS Project.',
  },
  nav: {
    why: 'Pourquoi',
    ai: 'IA',
    download: 'Télécharger',
    github: 'GitHub',
    main: 'Navigation principale',
    switchTo: 'English',
    switchHref: '/en/',
    switchLang: 'en',
  },
  hero: {
    slogan: 'Le planning de projet, libre et gratuit.',
    download: 'Télécharger',
    browser: 'Ouvrir dans le navigateur',
    platforms: 'macOS, Windows, Linux.',
  },
  pitch: {
    title: 'Fini, la licence.',
    sub: 'Planifiez comme dans MS Project, dans un logiciel libre et gratuit.',
  },
  gantt: {
    tasks: [
      'Études et permis',
      'Terrassement',
      'Fondations',
      'Gros œuvre',
      'Charpente et couverture',
      'Menuiseries',
      'Second œuvre',
      'Finitions',
    ],
    milestone: 'Réception',
    alt: 'Planning de Gantt d’exemple : huit tâches en cascade, des études à la réception.',
  },
  familiar: {
    title: 'Le planning tel que vous le connaissez.',
    sub: 'Une interface familière, et un moteur de calcul écrit d’après les règles documentées de MS Project.',
    alt: 'PlannerCraft : le ruban, la table des tâches et le diagramme de Gantt d’un planning de construction.',
  },
  tiles: {
    light: {
      eyebrow: 'Poids plume',
      title: 'Ultra léger.',
      sub: '16 Mo à télécharger sous Windows. Pas d’installeur, pas de compte.',
      figure: '16 Mo',
    },
    browser: {
      eyebrow: 'En ligne',
      title: 'Existe aussi dans le navigateur.',
      sub: 'Rien à installer.',
      cta: 'Ouvrir dans le navigateur',
    },
    pdf: {
      eyebrow: 'Import PDF',
      title: 'Éditez un planning depuis un PDF.',
      sub: 'Importez un planning reçu en PDF et modifiez-le.',
    },
    ai: {
      eyebrow: 'Assistant',
      title: 'IA native.',
      sub: 'Posez vos questions, demandez des modifications. Chaque changement attend votre validation.',
      prompt: 'Décale le second œuvre de deux semaines',
      proposal: 'Proposition : 18 dates déplacées',
      accept: 'Accepter',
      refuse: 'Refuser',
    },
  },
  access: {
    title: 'Créez un compte, ou apportez votre clé.',
    sub: 'L’assistant IA est optionnel. Deux façons de l’activer.',
    account: {
      title: 'Créez un compte',
      sub: 'Sans mot de passe. Des crédits de 5 €, 20 € ou 50 €, sans abonnement.',
    },
    key: {
      title: 'Apportez votre clé',
      sub: 'BYOK : branchez votre compte OpenRouter et payez-lui vos appels directement.',
    },
  },
  download: {
    title: 'Téléchargez PlannerCraft.',
    sub: 'Gratuit. Sans inscription.',
    os: [
      { id: 'mac', name: 'macOS', detail: 'DMG universel' },
      { id: 'win', name: 'Windows', detail: 'ZIP 64 bits' },
      { id: 'linux', name: 'Linux', detail: 'tar.gz 64 bits' },
    ],
    browser: 'Ouvrir dans le navigateur',
    source: 'Code source sur GitHub',
  },
  footer: {
    legal:
      'Licence MIT ou Apache 2.0. Microsoft Project est une marque de Microsoft Corporation ; PlannerCraft est un projet indépendant.',
  },
};
