// Écrit src/data/release.json à partir de la version publiée la plus récente de l'application
// (pré-versions comprises, brouillons exclus). Lancé par le déploiement avant `pnpm build` ;
// sans réseau ou sans version publiée, le fichier garde ses liens de repli (page des versions).
import { writeFile } from 'node:fs/promises';

const REPO = 'DVP-Th30/plannercraft';
const OUT = new URL('../src/data/release.json', import.meta.url);
/** Fin du nom de fichier de chaque téléchargement (`plannercraft-<version><fin>`). */
const SUFFIXES = {
  mac: '-macos-universal.dmg',
  win: '-windows-x86_64.zip',
  linux: '-linux-x86_64.tar.gz',
  web: '-web.tar.gz',
};

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'plannercraft-site' };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;

const response = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=20`, { headers });
if (!response.ok) throw new Error(`GitHub a répondu ${response.status} pour la liste des versions`);
const release = (await response.json()).find((entry) => !entry.draft);
if (!release) {
  console.warn('Aucune version publiée : les boutons mèneront à la page des versions.');
  process.exit(0);
}

const assets = {};
for (const [id, suffix] of Object.entries(SUFFIXES)) {
  const asset = release.assets.find((entry) => entry.name.endsWith(suffix));
  assets[id] = asset ? asset.browser_download_url : null;
}
const data = {
  tag: release.tag_name,
  version: release.tag_name.replace(/^v/, ''),
  page: release.html_url,
  assets,
};
await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Version ${data.version} : ${Object.values(assets).filter(Boolean).length} téléchargements sur 4.`);
