# Progression — Interest-Man

> Fichier à lire EN PREMIER pour reprendre le projet. Le tenir COURT.
> Dernière mise à jour : session 1.

## ✅ Fait
- **Base technique** : Vite + React + TS + Tailwind + Zustand + PWA (installable, offline, SW OK).
- **3 modes de jeu**, chacun avec sa **propre sauvegarde** (`src/data/gameModes.ts`) :
  - 📊 **Réaliste** — vrais chiffres, volatilité ×1, départ 10 000 €
  - 🔥 **Chaos** — volatilité ×4 + événements inventés, départ 10 000 €
  - 💼 **Business Man** — coop à 2, volatilité ×1.5, départ 25 000 €
- **Marché** : crypto en live (CoinGecko, sans clé) + or/actions/immobilier simulés sur valeurs réelles.
  Fallback systématique → jamais de crash sans réseau.
- **Jeu** : achat/vente (presets %, PRU, +/- value), patrimoine net, courbes SVG maison.
- **Missions & niveaux** : 6 missions, XP → niveau, actifs débloqués par niveau.
- **Mode Chaos** : 15 événements délirants (`src/data/chaosEvents.ts`) + popup plein écran.
- **Mode Coop** : lobby (créer/rejoindre par code), 2 rôles complémentaires, chat, sync P2P.
- **Tests** : 16 tests verts (`npm test`) sur achat/vente/niveaux/marché/événements.

- **Déploiement** : GitHub Pages via `.github/workflows/deploy.yml` (build + tests + deploy).
  URL → https://niakimbo22.github.io/Interest-Man/ · icônes PWA propres (192/512/maskable/apple).

## 🔜 À faire (prochaines sessions)
0. ⚠️ **Activer GitHub Pages** une seule fois : Settings → Pages → Source = **GitHub Actions**.
1. ⚠️ **Tester le coop P2P en vrai** (2 vrais téléphones) — voir pièges ci-dessous.
2. **Effet de levier / emprunts** (risque, faillite possible) — prévu, pas encore commencé.
3. **Empire de biens interactif** (business qui rapportent, upgrades) — style Richman ++.
4. **Missions propres au mode Coop** (objectifs communs de la boîte).
5. Plus d'actifs, achievements, animations/polish.

## ⚠️ Décisions & pièges
- **Coop = COOPÉRATIF, pas compétitif.** Le but est de s'entraider comme des associés.
  Les rôles sont volontairement **incomplets** pour forcer la communication :
  Trader = passe les ordres mais ne voit pas les tendances ; Analyste = voit mais ne peut pas acheter.
- **Pas de Supabase/Firebase** (quotas du user déjà pleins) → P2P WebRTC via **Trystero**
  (relais Nostr publics pour la mise en relation uniquement, données chiffrées en direct).
- **Le P2P n'a PAS pu être testé** : le sandbox de dev bloque tous les relais externes.
  Le code suit l'API Trystero 0.25 et dégrade proprement (reste « en attente », aucun crash),
  mais **la connexion réelle reste à valider sur 2 vrais appareils**.
- **Modèle coop** : l'hôte (celui qui crée la boîte) fait autorité sur le marché et le portefeuille.
  L'invité envoie des demandes d'ordre et reçoit l'état. Évite les conflits d'état.
- `makeAction` de Trystero renvoie un **objet** `{send, onMessage}` (pas un tuple), et
  `onPeerJoin`/`onPeerLeave` sont des **propriétés à assigner**. Casts JSON isolés dans `p2p.ts`.
- **Base path** : le build Pages utilise `base: '/Interest-Man/'` (activé par `GITHUB_PAGES=true`).
  En local on reste à `/`. Le manifeste utilise `start_url: '.'` — un start_url hors du scope
  **empêche l'installation** de la PWA.
- Icônes régénérables : `public/icon.svg` est la source ; les PNG sont rasterisés via Chromium.
- CoinGecko est limité en requêtes → refresh live toutes les **60 s** seulement.
- Les prix simulés sont bornés autour du prix de base (évite les dérives absurdes en Réaliste).

## 🗺️ Où est quoi
```
src/data/       assets.ts (actifs réels) · chaosEvents.ts · missions.ts · gameModes.ts
src/services/   prices.ts (CoinGecko+fallback) · marketTick.ts (simulation + impact événements)
src/store/      gameStore.ts (partie, buy/sell) · sessionStore.ts (mode) · leveling.ts
src/coop/       p2p.ts (WebRTC) · coopStore.ts · roles.ts
src/features/   market/ portfolio/ missions/ modes/ chaos/ coop/
```
