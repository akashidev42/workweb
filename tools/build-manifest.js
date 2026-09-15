#!/usr/bin/env node
/**
 * Scanne le dossier /games et régénère games.json à la racine.
 * Chaque sous-dossier de /games devient une entrée automatiquement :
 *  - le titre vient de meta.json ("title") ou, à défaut, du nom du dossier
 *  - la description vient de meta.json ("description"), optionnelle
 *  - la catégorie vient de meta.json ("category"), optionnelle
 *  - l'image de couverture est le premier fichier image trouvé dans le dossier
 *    (png, jpg, jpeg, webp, gif, svg) — aucun nom précis requis
 *  - le lien pointe toujours vers games/<dossier>/index.html
 *
 * Utilisation :
 *   node tools/build-manifest.js
 *
 * Ce script tourne aussi automatiquement via GitHub Actions
 * (voir .github/workflows/update-manifest.yml) à chaque push.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GAMES_DIR = path.join(ROOT, 'games');
const OUT_FILE = path.join(ROOT, 'games.json');
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

function prettifyName(name) {
  var s = name.replace(/[-_]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function findEntryHtml(dirPath) {
  if (fs.existsSync(path.join(dirPath, 'index.html'))) return 'index.html';
  var files = fs.readdirSync(dirPath);
  var htmlFile = files.find(function (f) { return f.toLowerCase().endsWith('.html'); });
  return htmlFile || null;
}

function findCoverImage(dirPath, files) {
  var img = files.find(function (f) { return IMAGE_EXT.test(f); });
  return img || null;
}

function build() {
  if (!fs.existsSync(GAMES_DIR)) {
    console.error('Dossier /games introuvable.');
    process.exit(1);
  }

  var entries = fs.readdirSync(GAMES_DIR, { withFileTypes: true })
    .filter(function (d) { return d.isDirectory(); })
    .map(function (d) { return d.name; })
    .sort();

  var games = [];

  entries.forEach(function (slug) {
    var dirPath = path.join(GAMES_DIR, slug);
    var files = fs.readdirSync(dirPath);

    var entryHtml = findEntryHtml(dirPath);
    if (!entryHtml) {
      console.warn('⚠ ' + slug + ' ignoré : aucun fichier .html trouvé.');
      return;
    }

    var meta = {};
    if (files.includes('meta.json')) {
      try {
        meta = JSON.parse(fs.readFileSync(path.join(dirPath, 'meta.json'), 'utf8'));
      } catch (e) {
        console.warn('⚠ meta.json invalide dans ' + slug + ', ignoré.');
      }
    }

    var cover = findCoverImage(dirPath, files);

    games.push({
      slug: slug,
      title: meta.title || prettifyName(slug),
      description: meta.description || '',
      category: meta.category || null,
      image: cover ? 'games/' + slug + '/' + cover : null,
      href: 'games/' + slug + '/' + entryHtml
    });
  });

  fs.writeFileSync(OUT_FILE, JSON.stringify(games, null, 2) + '\n');
  console.log('✓ games.json généré avec ' + games.length + ' jeu(x).');
}

build();
