// Pages d'entrée de la version web pour les adresses que le relais envoie (D-011) :
// lien de connexion `/app/login?token=…`, retours de paiement `/app/credits/success` et `/app/credits/cancel`.
// Chacune est une copie de `dist/app/index.html` avec `<base href="/app/">` : les chemins relatifs de
// l'application (`./plannercraft-web-….js`) restent résolus sous /app/, et l'application lit le chemin
// d'origine pour reconnaître le retour. GitHub Pages sert `login.html` pour `/app/login`, sans redirection.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const app = process.argv[2] ?? 'dist/app';
const index = readFileSync(join(app, 'index.html'), 'utf8');
if (!/<head>/i.test(index)) throw new Error(`${app}/index.html : balise <head> introuvable`);
if (/<base\s/i.test(index)) throw new Error(`${app}/index.html : une balise <base> existe déjà`);
const page = index.replace(/<head>/i, '<head>\n  <base href="/app/">');

for (const entry of ['login.html', 'credits/success.html', 'credits/cancel.html']) {
  const file = join(app, entry);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log(`écrit : ${file}`);
}
