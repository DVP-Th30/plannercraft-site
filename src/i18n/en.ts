import type { Copy } from './index';

// Traduction du texte français validé (docs/DECISIONS.md, D-004). À faire relire par le propriétaire.
export const en: Copy = {
  lang: 'en',
  meta: {
    title: 'PlannerCraft — free, open-source project planning',
    description:
      'Free, open-source Gantt planning software for macOS, Windows, Linux and the browser. PDF schedule import, AI assistant, XML exchange with MS Project.',
  },
  nav: {
    why: 'Why',
    ai: 'AI',
    download: 'Download',
    github: 'GitHub',
    main: 'Main navigation',
    switchTo: 'Français',
    switchHref: '/',
    switchLang: 'fr',
  },
  hero: {
    slogan: 'Project planning, free and open source.',
    download: 'Download',
    browser: 'Open in browser',
    platforms: 'macOS, Windows, Linux.',
  },
  pitch: {
    title: 'Done with licenses.',
    sub: 'Plan the way you do in MS Project, in free, open-source software.',
  },
  gantt: {
    tasks: [
      'Design and permits',
      'Earthworks',
      'Foundations',
      'Structure',
      'Roofing',
      'Windows and doors',
      'Interior works',
      'Finishes',
    ],
    milestone: 'Handover',
    alt: 'Sample Gantt schedule: eight cascading tasks, from design to handover.',
  },
  familiar: {
    title: 'Planning as you know it.',
    sub: 'A familiar interface, and a scheduling engine written from MS Project’s documented rules.',
    alt: 'PlannerCraft: the ribbon, the task table and the Gantt chart of a construction schedule (French interface).',
  },
  tiles: {
    light: {
      eyebrow: 'Featherweight',
      title: 'Ultra light.',
      sub: 'A 23 MB download on Windows. No installer, no account.',
      figure: '23 MB',
    },
    browser: {
      eyebrow: 'Online',
      title: 'Also runs in your browser.',
      sub: 'Nothing to install.',
      cta: 'Open in browser',
    },
    pdf: {
      eyebrow: 'PDF import',
      title: 'Edit a schedule from a PDF.',
      sub: 'Import a schedule you received as a PDF, and edit it.',
    },
    ai: {
      eyebrow: 'Assistant',
      title: 'AI native.',
      sub: 'Ask questions, request changes. Every change waits for your approval.',
      prompt: 'Push the interior works back two weeks',
      proposal: 'Proposal: 18 dates moved',
      accept: 'Accept',
      refuse: 'Decline',
    },
  },
  access: {
    title: 'Create an account, or bring your own key.',
    sub: 'The AI assistant is optional. Two ways to turn it on.',
    account: {
      title: 'Create an account',
      sub: 'No password. Credits of €5, €20 or €50, no subscription.',
    },
    key: {
      title: 'Bring your own key',
      sub: 'BYOK: connect your OpenRouter account and pay it directly for your calls.',
    },
  },
  download: {
    title: 'Download PlannerCraft.',
    sub: 'Free. No sign-up.',
    os: [
      { id: 'mac', name: 'macOS', detail: 'Universal DMG' },
      { id: 'win', name: 'Windows', detail: '64-bit ZIP' },
      { id: 'linux', name: 'Linux', detail: '64-bit tar.gz' },
    ],
    browser: 'Open in browser',
    source: 'Source code on GitHub',
  },
  footer: {
    legal:
      'MIT or Apache 2.0 license. Microsoft Project is a trademark of Microsoft Corporation; PlannerCraft is an independent project.',
  },
};
