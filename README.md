# AkashiGame

Pack de mini-jeux jouables dans le navigateur. Thème noir, aucune publicité, aucun tracker, aucune dépendance externe.

## Comment ça marche

La page d'accueil (`index.html`) ne connaît aucun jeu en dur : elle charge `games.json`, un fichier généré automatiquement en scannant le dossier `/games`.

**Pour ajouter un jeu :**

1. Crée un dossier dans `games/`, par exemple `games/mon-jeu/`.
2. Mets un `index.html` jouable à l'intérieur.
3. (Optionnel) Ajoute une image dedans (`cover.png`, `screenshot.jpg`, peu importe le nom) → elle sera utilisée comme vignette sur l'accueil.
4. (Optionnel) Ajoute un `meta.json` pour personnaliser titre / description / catégorie :
   ```json
   {
     "title": "Mon Jeu",
     "description": "Une phrase qui donne envie d'y jouer.",
     "category": "Arcade"
   }
   ```
   Sans `meta.json`, le titre est déduit automatiquement du nom du dossier (`mon-jeu` → `Mon jeu`).
5. Push sur GitHub.

C'est tout — pas besoin de toucher à `index.html` ou au JavaScript de l'accueil.

## Pourquoi un fichier games.json et pas une vraie liste "automatique" ?

GitHub Pages est un hébergement 100% statique : le navigateur ne peut pas demander "liste-moi les dossiers de /games", ce n'est possible qu'avec un serveur. `games.json` est le pont entre les deux :

- **En local**, régénère-le à la main après avoir ajouté un jeu :
  ```
  node tools/build-manifest.js
  ```
- **Sur GitHub**, c'est automatique : la GitHub Action `.github/workflows/update-manifest.yml` régénère et commit `games.json` à chaque push qui touche `/games`. Tu n'as jamais besoin de la lancer toi-même une fois le repo en place.

## Mise en ligne sur GitHub Pages

1. Crée un dépôt (par exemple `akashigame`).
2. Mets tout le contenu de ce dossier à la racine du dépôt et push.
3. Dans les paramètres du dépôt → **Pages**, choisis la branche `main` et le dossier `/ (root)`.
4. Dans **Settings → Actions → General**, vérifie que les workflows ont la permission "Read and write" (nécessaire pour que l'Action puisse commit `games.json`).
5. Ton site est en ligne à `https://<ton-pseudo>.github.io/akashigame/`.

## Structure

```
akashigame/
├── index.html                          → accueil, lit games.json
├── games.json                          → généré automatiquement, ne pas éditer à la main
├── assets/theme.css                    → thème visuel partagé
├── tools/build-manifest.js             → script qui scanne /games
├── .github/workflows/update-manifest.yml → automatise le script ci-dessus
└── games/
    ├── snake/           (index.html, meta.json, cover.svg)
    ├── pong/
    ├── casse-briques/
    ├── 2048/
    ├── chute-de-blocs/
    ├── demineur/
    ├── morpion/
    ├── memoire/
    ├── flap/
    └── sequence/
```

## Tester en local

`fetch("games.json")` ne fonctionne pas si tu ouvres juste `index.html` depuis l'explorateur de fichiers (`file://`). Lance un petit serveur local à la racine du dossier, par exemple :

```
python3 -m http.server 8000
```

puis ouvre `http://localhost:8000`.

## Easter egg

Console du navigateur (F12) :

```js
temp("on")   // écran de maintenance plein écran
temp("off")  // relance le site
```

État mémorisé dans le navigateur (localStorage).
