// Données du tunnel de barres et du planning qu'il devient.
// Source unique : le SVG statique (Stage.astro) et le rendu canvas (stage.ts) lisent ce fichier.

/** Repère de dessin : le tunnel est conçu pour un écran de 1440 × 900, puis mis à l'échelle. */
export const DESIGN_W = 1440;
export const DESIGN_H = 900;

export const INK = '#0B0B0F';

export const COLORS = {
  violet: '#7719AA',
  red: '#FF4B3A',
  yellow: '#FFC61A',
  cyan: '#17B4E3',
  magenta: '#E5278F',
  green: '#23B866',
  orange: '#FF8A1F',
  blue: '#2A6BF2',
} as const;

export interface Arc {
  /** Angle de départ en degrés (0 = à droite, sens horaire). */
  start: number;
  /** Ouverture en degrés. */
  sweep: number;
  color: string;
  /** Indice de la tâche que cette barre devient ; absent : la barre s'envole. */
  task?: number;
}

export interface Ring {
  /** Rayon de l'anneau, en unités du repère de dessin. */
  r: number;
  /** Épaisseur des barres. */
  w: number;
  /** Secondes par tour ; négatif : sens antihoraire. */
  period: number;
  bars: Arc[];
  /** Losange (jalon) posé dans un intervalle de l'anneau. */
  diamond?: { at: number; size: number; milestone?: boolean };
}

const c = COLORS;

// Les rayons et les épaisseurs croissent d'environ 19 % par anneau : c'est ce qui donne la profondeur.
export const RINGS: Ring[] = [
  {
    r: 290, w: 34, period: 70,
    bars: [
      { start: 0, sweep: 70, color: c.violet, task: 0 },
      { start: 84, sweep: 40, color: c.yellow, task: 1 },
      { start: 138, sweep: 95, color: c.red, task: 2 },
      { start: 247, sweep: 30, color: c.cyan, task: 3 },
      { start: 291, sweep: 55, color: c.green, task: 4 },
    ],
    diamond: { at: 77, size: 20, milestone: true },
  },
  {
    r: 345, w: 42, period: -95,
    bars: [
      { start: 20, sweep: 110, color: c.blue, task: 5 },
      { start: 144, sweep: 50, color: c.orange, task: 6 },
      { start: 208, sweep: 80, color: c.magenta, task: 7 },
      { start: 302, sweep: 64, color: c.yellow },
    ],
  },
  {
    r: 410, w: 50, period: 80,
    bars: [
      { start: 10, sweep: 45, color: c.red },
      { start: 67, sweep: 75, color: c.green },
      { start: 154, sweep: 30, color: c.violet },
      { start: 196, sweep: 60, color: c.cyan },
      { start: 268, sweep: 50, color: c.orange },
      { start: 330, sweep: 28, color: c.blue },
    ],
    diamond: { at: 148, size: 22 },
  },
  {
    r: 490, w: 60, period: -120,
    bars: [
      { start: 40, sweep: 90, color: c.yellow },
      { start: 143, sweep: 120, color: c.violet },
      { start: 276, sweep: 44, color: c.red },
      { start: 333, sweep: 54, color: c.green },
    ],
  },
  {
    r: 585, w: 72, period: 100,
    bars: [
      { start: 5, sweep: 60, color: c.magenta },
      { start: 77, sweep: 85, color: c.cyan },
      { start: 174, sweep: 40, color: c.orange },
      { start: 226, sweep: 70, color: c.blue },
      { start: 308, sweep: 45, color: c.red },
    ],
    diamond: { at: 71, size: 30 },
  },
  {
    r: 700, w: 88, period: -140,
    bars: [
      { start: 25, sweep: 100, color: c.green },
      { start: 137, sweep: 66, color: c.yellow },
      { start: 215, sweep: 84, color: c.magenta },
      { start: 311, sweep: 62, color: c.violet },
    ],
  },
  {
    r: 840, w: 106, period: 120,
    bars: [
      { start: 0, sweep: 70, color: c.blue },
      { start: 82, sweep: 50, color: c.red },
      { start: 144, sweep: 90, color: c.orange },
      { start: 246, sweep: 46, color: c.cyan },
      { start: 304, sweep: 44, color: c.violet },
    ],
  },
];

export interface Task {
  /** Début et fin sur une échelle de temps de 0 à 100. */
  start: number;
  end: number;
  color: string;
}

// Le planning d'arrivée : huit tâches en cascade (chaque tâche démarre à la fin de la précédente),
// dans l'ordre des indices `task` ci-dessus, puis un jalon à la fin.
export const TASKS: Task[] = [
  { start: 0, end: 16, color: c.violet },
  { start: 16, end: 26, color: c.yellow },
  { start: 26, end: 40, color: c.red },
  { start: 40, end: 58, color: c.cyan },
  { start: 58, end: 70, color: c.green },
  { start: 70, end: 80, color: c.blue },
  { start: 80, end: 92, color: c.orange },
  { start: 92, end: 100, color: c.magenta },
];

/** Longueur d'un arc en unités du repère. */
export function arcLength(r: number, sweepDeg: number): number {
  return (r * sweepDeg * Math.PI) / 180;
}
