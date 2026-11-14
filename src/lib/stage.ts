// Scène d'ouverture : le tunnel de barres tourne, puis se déroule en planning au fil du scroll.
// Rendu sur un canvas 2D collant ; la progression vient de la position de scroll dans `.stage`.
//
// Principe du déroulé : chaque barre est un arc de cercle décrit par son milieu, sa direction,
// sa longueur, sa courbure et son épaisseur. Dans le tunnel la courbure vaut 1 / rayon ; dans le
// planning elle vaut 0 (une barre droite). On interpole ces cinq grandeurs : l'arc s'ouvre et s'aplatit.

import { DESIGN_H, DESIGN_W, INK, RINGS, TASKS } from './tunnel';

const DEG = Math.PI / 180;
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Ramène un angle dans ]-π, π]. */
function wrapAngle(a: number): number {
  let r = a % (2 * Math.PI);
  if (r > Math.PI) r -= 2 * Math.PI;
  if (r <= -Math.PI) r += 2 * Math.PI;
  return r;
}

// Entrée au chargement, en secondes : la page part du blanc, les anneaux se dessinent l'un après
// l'autre du centre vers l'extérieur (chaque barre s'allonge en tournant), puis le texte apparaît.
const INTRO = { stagger: 0.13, span: 1.2, twist: 0.9, heroDelay: 0.35, heroSpan: 0.9 };

// Jalons de la progression (0 = haut de la scène, 1 = fin de la scène).
const HERO_FADE = { from: 0.03, span: 0.15 };
const FLY_OUT = { from: 0.06, span: 0.42 };
const MORPH = { from: 0.1, span: 0.5, stagger: 0.022 };
const PITCH_IN = { from: 0.5, span: 0.18 };
const DETAIL_IN = { from: 0.74, span: 0.14 };

interface Chart {
  x0: number;
  x1: number;
  labelX: number;
  right: number;
  top: number;
  rowH: number;
  barH: number;
  showLabels: boolean;
  fontSize: number;
}

declare global {
  interface Window {
    __pcStage?: boolean;
  }
}

export function initStage(root: HTMLElement): void {
  if (!document.documentElement.classList.contains('js-live')) return;
  const sticky = root.querySelector<HTMLElement>('.stage__sticky');
  const canvas = root.querySelector<HTMLCanvasElement>('.stage__canvas');
  const hero = root.querySelector<HTMLElement>('.hero__content');
  const pitch = root.querySelector<HTMLElement>('.pitch');
  const column = pitch?.querySelector<HTMLElement>('.wrap') ?? null;
  const ctx = canvas?.getContext('2d');
  if (!sticky || !canvas || !hero || !pitch || !ctx) return;
  window.__pcStage = true;

  let labels: string[] = [];
  try {
    labels = JSON.parse(root.dataset.labels ?? '[]') as string[];
  } catch {
    labels = [];
  }

  const rows = TASKS.length + 1; // les tâches, puis la ligne du jalon
  let W = 0;
  let H = 0;
  let dpr = 1;
  let scale = 1;
  let chart: Chart = { x0: 0, x1: 0, labelX: 0, right: 0, top: 0, rowH: 0, barH: 0, showLabels: false, fontSize: 15 };
  let time = 0;
  let last = 0;
  let shown = 0; // progression affichée, lissée
  let raf = 0;
  let onScreen = true;
  let intro = 0; // secondes écoulées depuis le début de l'entrée

  function layout(): void {
    const rect = sticky!.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    scale = Math.max(W / DESIGN_W, H / DESIGN_H);

    // Le planning s'aligne sur la colonne de texte du titre (le `.wrap` de la page).
    let cx0 = W < 720 ? 16 : 32;
    let cw = W - 2 * cx0;
    if (column) {
      const box = column.getBoundingClientRect();
      const style = getComputedStyle(column);
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const padRight = parseFloat(style.paddingRight) || 0;
      cx0 = box.left - rect.left + padLeft;
      cw = box.width - padLeft - padRight;
    }
    const showLabels = W >= 760;
    const labelW = showLabels ? Math.min(230, cw * 0.24) : 0;
    const pitchBottom = pitch!.offsetTop + pitch!.offsetHeight;
    const top = pitchBottom + Math.max(28, H * 0.06);
    const bottom = H - Math.max(28, H * 0.06);
    const rowH = Math.max(14, Math.min((bottom - top) / rows, 56));
    chart = {
      x0: cx0 + labelW,
      x1: cx0 + cw - 30,
      labelX: cx0,
      right: cx0 + cw,
      top,
      rowH,
      barH: Math.min(rowH * 0.56, 30),
      showLabels,
      fontSize: rowH < 34 ? 13 : 15,
    };
  }

  /** Trace un arc défini par son milieu, sa direction, sa longueur et sa courbure. */
  function strokeArc(px: number, py: number, theta: number, length: number, curvature: number): void {
    ctx!.beginPath();
    if (curvature * length < 0.002) {
      const dx = (Math.cos(theta) * length) / 2;
      const dy = (Math.sin(theta) * length) / 2;
      ctx!.moveTo(px - dx, py - dy);
      ctx!.lineTo(px + dx, py + dy);
    } else {
      const radius = 1 / curvature;
      // Le centre est du côté de la normale (tangente tournée de +90°).
      const ccx = px - Math.sin(theta) * radius;
      const ccy = py + Math.cos(theta) * radius;
      const mid = theta - Math.PI / 2;
      const half = (length * curvature) / 2;
      ctx!.arc(ccx, ccy, radius, mid - half, mid + half);
    }
    ctx!.stroke();
  }

  function taskX(position: number): number {
    return lerp(chart.x0, chart.x1, position / 100);
  }
  function rowY(row: number): number {
    return chart.top + chart.rowH * (row + 0.5);
  }

  function draw(p: number): void {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2;
    const out = easeInOut(clamp01((p - FLY_OUT.from) / FLY_OUT.span));
    const detail = clamp01((p - DETAIL_IN.from) / DETAIL_IN.span);
    ctx!.lineCap = 'round';

    // Lignes du tableau, sous les barres.
    if (detail > 0) {
      ctx!.globalAlpha = detail;
      ctx!.strokeStyle = '#E3E5E8';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (let i = 0; i <= rows; i++) {
        const y = Math.round(chart.top + i * chart.rowH) + 0.5;
        ctx!.moveTo(chart.labelX, y);
        ctx!.lineTo(chart.right, y);
      }
      ctx!.stroke();
    }

    for (const [index, ring] of RINGS.entries()) {
      // Entrée : 0 = anneau pas encore là, 1 = anneau complet.
      const grown = easeOut(clamp01((intro - index * INTRO.stagger) / INTRO.span));
      if (grown <= 0) continue;
      const fade = clamp01(grown * 3);
      const twist = Math.sign(ring.period) * (1 - grown) * INTRO.twist;
      const rot = (360 / ring.period) * time;
      const radius = ring.r * scale;

      for (const bar of ring.bars) {
        const a0 = (bar.start + rot) * DEG - twist;
        const sweep = bar.sweep * DEG * grown;
        ctx!.strokeStyle = bar.color;

        if (bar.task === undefined) {
          // Barre qui s'envole : l'anneau grossit et s'efface, comme si on traversait le tunnel.
          if (out >= 1) continue;
          ctx!.globalAlpha = fade * (1 - clamp01((out - 0.35) / 0.65));
          ctx!.lineWidth = ring.w * scale * (1 + 1.4 * out);
          ctx!.beginPath();
          ctx!.arc(cx, cy, radius * (1 + 2.4 * out), a0, a0 + sweep);
          ctx!.stroke();
          continue;
        }

        // Barre qui devient une tâche du planning.
        const task = TASKS[bar.task];
        if (!task) continue;
        const e = easeInOut(clamp01((p - MORPH.from - bar.task * MORPH.stagger) / MORPH.span));
        const mid = a0 + sweep / 2;
        const thetaFrom = wrapAngle(mid + Math.PI / 2);
        const xs = taskX(task.start);
        const xe = taskX(task.end);
        // Les bouts arrondis ajoutent une épaisseur à la longueur : on la retire pour tenir entre xs et xe.
        const lengthTo = Math.max(1, xe - xs - chart.barH);
        ctx!.globalAlpha = fade;
        ctx!.lineWidth = lerp(ring.w * scale, chart.barH, e);
        strokeArc(
          lerp(cx + Math.cos(mid) * radius, (xs + xe) / 2, e),
          lerp(cy + Math.sin(mid) * radius, rowY(bar.task), e),
          thetaFrom + wrapAngle(0 - thetaFrom) * e,
          lerp(radius * sweep, lengthTo, e),
          (1 - e) / radius,
        );
      }

      if (ring.diamond) {
        const angle = (ring.diamond.at + rot) * DEG - twist;
        ctx!.fillStyle = INK;
        ctx!.save();
        if (ring.diamond.milestone) {
          const e = easeInOut(clamp01((p - MORPH.from - TASKS.length * MORPH.stagger) / MORPH.span));
          const size = lerp(ring.diamond.size * scale * grown, chart.barH * 0.62, e);
          ctx!.globalAlpha = fade;
          ctx!.translate(
            lerp(cx + Math.cos(angle) * radius, chart.x1 + 10, e),
            lerp(cy + Math.sin(angle) * radius, rowY(TASKS.length), e),
          );
          ctx!.rotate(lerp(wrapAngle(angle + Math.PI / 4), Math.PI / 4, e));
          ctx!.fillRect(-size / 2, -size / 2, size, size);
        } else if (out < 1) {
          const size = ring.diamond.size * scale * grown * (1 + 1.4 * out);
          const far = radius * (1 + 2.4 * out);
          ctx!.globalAlpha = fade * (1 - clamp01((out - 0.35) / 0.65));
          ctx!.translate(cx + Math.cos(angle) * far, cy + Math.sin(angle) * far);
          ctx!.rotate(angle + Math.PI / 4);
          ctx!.fillRect(-size / 2, -size / 2, size, size);
        }
        ctx!.restore();
      }
    }

    if (detail > 0) {
      // Liens fin-début : on sort du bout de la tâche, on descend sur la suivante.
      ctx!.globalAlpha = detail;
      ctx!.strokeStyle = '#4A4F57';
      ctx!.fillStyle = '#4A4F57';
      ctx!.lineWidth = 1.5;
      ctx!.lineCap = 'butt';
      for (let i = 0; i < TASKS.length; i++) {
        const task = TASKS[i];
        if (!task) continue;
        const x = taskX(task.end) + 10;
        const yFrom = rowY(i);
        const lastRow = i === TASKS.length - 1;
        const yTo = rowY(i + 1) - (lastRow ? chart.barH * 0.44 : chart.barH / 2) - 5;
        ctx!.beginPath();
        ctx!.moveTo(x - 10, yFrom);
        ctx!.lineTo(x, yFrom);
        ctx!.lineTo(x, yTo);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(x - 4, yTo - 1);
        ctx!.lineTo(x + 4, yTo - 1);
        ctx!.lineTo(x, yTo + 5);
        ctx!.closePath();
        ctx!.fill();
      }

      if (chart.showLabels) {
        ctx!.fillStyle = INK;
        ctx!.font = `500 ${chart.fontSize}px "Inter Variable", Inter, system-ui, sans-serif`;
        ctx!.textBaseline = 'middle';
        for (let i = 0; i < rows; i++) {
          const label = labels[i];
          if (label) ctx!.fillText(label, chart.labelX, rowY(i) + 1);
        }
      }
    }
    ctx!.globalAlpha = 1;
  }

  function applyDom(p: number): void {
    const heroIn = easeOut(clamp01((intro - INTRO.heroDelay) / INTRO.heroSpan));
    const heroOpacity = 1 - clamp01((p - HERO_FADE.from) / HERO_FADE.span);
    hero!.style.opacity = (heroOpacity * heroIn).toFixed(3);
    hero!.style.transform = `translateY(${((1 - heroIn) * 14).toFixed(1)}px) scale(${(0.9 + 0.1 * heroOpacity).toFixed(4)})`;
    hero!.toggleAttribute('inert', heroOpacity < 0.05);
    const pitchOpacity = clamp01((p - PITCH_IN.from) / PITCH_IN.span);
    pitch!.style.opacity = pitchOpacity.toFixed(3);
    pitch!.style.transform = `translateY(${((1 - pitchOpacity) * 28).toFixed(1)}px)`;
  }

  function target(): number {
    const rect = root.getBoundingClientRect();
    const travel = rect.height - H;
    return travel > 0 ? clamp01(-rect.top / travel) : 0;
  }

  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    intro += dt;
    // Lissage exponentiel : la scène suit le scroll sans à-coups, quel que soit le taux d'images.
    shown += (target() - shown) * (1 - Math.exp(-dt * 14));
    draw(shown);
    applyDom(shown);
    raf = requestAnimationFrame(frame);
  }

  function start(): void {
    if (raf || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop(): void {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  layout();
  shown = target();
  // Page rechargée plus bas que le premier écran : pas d'entrée, la scène est déjà en place.
  if (shown > 0.02) intro = Number.POSITIVE_INFINITY;
  new ResizeObserver(layout).observe(sticky);
  new ResizeObserver(layout).observe(pitch);
  new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    if (onScreen) start();
    else stop();
  }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}
