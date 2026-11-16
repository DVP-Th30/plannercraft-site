// Fabrique les images de partage (Open Graph, 1200 × 630), une par langue : public/og-fr.png et public/og-en.png.
// Outil de poste, lancé à la main (`pnpm og`) quand le slogan, le logo ou le tunnel changent ; les PNG sont versionnés.
// Le tunnel vient de src/lib/tunnel.ts et le slogan de src/i18n : aucune géométrie ni aucun texte recopié ici.
// Demande Google Chrome (variable CHROME pour un autre chemin) : il rend la page avec les polices du site.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { en } from '../src/i18n/en.ts';
import { fr } from '../src/i18n/fr.ts';
import { COLORS, INK, RINGS, arcLength } from '../src/lib/tunnel.ts';

const WIDTH = 1200;
const HEIGHT = 630;
const root = fileURLToPath(new URL('..', import.meta.url));
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const font = (name) => pathToFileURL(join(root, 'node_modules/@fontsource-variable', name, 'files', `${name}-latin-wght-normal.woff2`)).href;

// Même dessin que le SVG statique de Stage.astro, à l'échelle 1 du repère du tunnel.
const tunnel = RINGS.map((ring) => {
  const bars = ring.bars
    .map(
      (bar) =>
        `<circle r="${ring.r}" transform="rotate(${bar.start})" stroke="${bar.color}" stroke-dasharray="${arcLength(ring.r, bar.sweep).toFixed(1)} 99999"/>`,
    )
    .join('');
  const d = ring.diamond;
  const diamond = d
    ? `<rect x="${-d.size / 2}" y="${-d.size / 2}" width="${d.size}" height="${d.size}" transform="rotate(${d.at}) translate(${ring.r} 0) rotate(45)" fill="${INK}" stroke="none"/>`
    : '';
  return `<g fill="none" stroke-linecap="round" stroke-width="${ring.w}">${bars}${diamond}</g>`;
}).join('');

const page = (copy) => `<!doctype html>
<html lang="${copy.lang}">
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Inter Tight'; font-weight: 100 900; src: url('${font('inter-tight')}') format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #fff; }
  body { display: grid; place-items: center; font-family: 'Inter Tight', sans-serif; color: ${INK}; -webkit-font-smoothing: antialiased; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  main { position: relative; display: grid; justify-items: center; gap: 14px; width: 420px; text-align: center; }
  .logo { position: relative; width: 92px; height: 92px; border-radius: 20px; background: #000; }
  .logo i { position: absolute; left: 37.4%; top: 12.4%; width: 50%; height: 75%; background: ${COLORS.violet}; }
  .logo b { position: absolute; left: 12.4%; top: 68.7%; width: 18.9%; height: 18.9%; background: #fff; }
  h1 { margin-top: 6px; font-size: 62px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
  p { font-size: 31px; font-weight: 600; line-height: 1.16; letter-spacing: -0.02em; }
</style>
<svg viewBox="${-WIDTH / 2} ${-HEIGHT / 2} ${WIDTH} ${HEIGHT}" aria-hidden="true">${tunnel}</svg>
<main>
  <div class="logo"><i></i><b></b></div>
  <h1>PlannerCraft</h1>
  <p>${copy.hero.slogan.replace(', ', ',<br>')}</p>
</main>
</html>`;

const work = mkdtempSync(join(tmpdir(), 'plannercraft-og-'));
try {
  for (const copy of [fr, en]) {
    const html = join(work, `og-${copy.lang}.html`);
    const png = join(root, 'public', `og-${copy.lang}.png`);
    writeFileSync(html, page(copy));
    execFileSync(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--virtual-time-budget=3000',
        `--window-size=${WIDTH},${HEIGHT}`,
        `--screenshot=${png}`,
        pathToFileURL(html).href,
      ],
      { stdio: 'ignore' },
    );
    console.log(`écrit : public/og-${copy.lang}.png`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
