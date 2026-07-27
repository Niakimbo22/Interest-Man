# Interest-Man 💰📈

Jeu d'investissement en PWA : crypto, or, actions, immobilier. **Vrais chiffres**, mécaniques fun.
Installable sur téléphone, jouable hors-ligne.

## 📱 Installer sur ton téléphone

L'app est publiée sur GitHub Pages :

**https://niakimbo22.github.io/Interest-Man/**

> ⚠️ **La toute première fois**, il faut activer GitHub Pages (une seule fois) :
> `Settings` → `Pages` → **Source : GitHub Actions**. Le déploiement se lance ensuite
> à chaque push, et l'URL devient active en 1-2 min.

### iPhone (Safari — obligatoire, ça ne marche pas dans Chrome iOS)
1. Ouvre le lien **dans Safari**
2. Bouton **Partager** (le carré avec la flèche ↑, en bas)
3. **« Sur l'écran d'accueil »**
4. **Ajouter** → l'icône apparaît sur ton écran d'accueil 🎉

### Android (Chrome)
1. Ouvre le lien dans Chrome
2. Menu **⋮** en haut à droite
3. **« Installer l'application »** (ou « Ajouter à l'écran d'accueil »)
4. **Installer** → l'icône apparaît dans ton tiroir d'applis 🎉

Une fois installée, elle s'ouvre **en plein écran, sans barre d'adresse**, comme une vraie
app — et elle **fonctionne sans connexion** (seuls les prix crypto en direct ont besoin du réseau).

## 💻 Développement local

```sh
npm install
npm run dev       # serveur de dev
npm run build     # build de production
npm run preview   # prévisualiser le build
npm test          # tests unitaires
```

Pour tester depuis ton téléphone **sur ton propre PC** (même Wi-Fi) :
```sh
npm run dev -- --host
```
puis ouvre l'adresse `http://192.168.x.x:5173` affichée dans le terminal.
⚠️ En HTTP local l'installation PWA est limitée — pour le vrai test d'installation,
utilise le lien GitHub Pages (HTTPS).

## 🎮 Les 3 modes

| Mode | Esprit |
|------|--------|
| 📊 **Réaliste** | Vrais marchés, progression posée |
| 🔥 **Chaos** | Krachs et booms **inventés**, marché déchaîné |
| 💼 **Business Man** | **Coop à 2** : une boîte commune avec un ami, en P2P |

En mode Coop, deux associés partagent **un seul portefeuille**, avec des rôles
complémentaires qui les obligent à communiquer (le Trader achète mais ne voit pas les
tendances, l'Analyste voit mais ne peut pas acheter).

## 📚 Documentation

- [`docs/PROGRESS.md`](docs/PROGRESS.md) — état d'avancement, à lire en premier
- [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) — vision et règles du jeu
