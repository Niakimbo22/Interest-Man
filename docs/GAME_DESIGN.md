# Game Design — Interest-Man

> Source de vérité de la **vision** du jeu. Évolue peu. (L'état d'avancement est dans `PROGRESS.md`.)

## Concept
Jeu d'investissement mobile où on part avec un petit capital et on essaie de **devenir riche**.
Vrais actifs, vrais ordres de grandeur, mais règles **simples et fun**. Pas une simulation.

## Les 3 modes
| Mode | Esprit | Spécificités |
|------|--------|--------------|
| 📊 **Réaliste** | Vrais marchés, progression posée | Volatilité ×1, départ 10 000 € |
| 🔥 **Chaos** | Non-réaliste, krachs **inventés**, absurde et fun | Volatilité ×4, événements délirants |
| 💼 **Business Man** | **Coop à 2** : une boîte commune avec un ami | Départ 25 000 €, rôles complémentaires, P2P |

Chaque mode a sa **propre sauvegarde** : changer de mode ne détruit rien.

### Mode Coop — principe directeur
**Ce n'est PAS de la compétition, c'est de la communication.** Deux associés, **un seul
portefeuille**. Les rôles sont volontairement **incomplets** pour qu'ils aient besoin l'un de l'autre :
- 📈 **Trader** — seul à pouvoir acheter/vendre, mais ne voit pas les tendances.
- 🔍 **Analyste** — voit les tendances et recommande, mais ne peut pas passer d'ordre.

Connexion **P2P directe** (WebRTC/Trystero) via un code de room : aucun compte, aucun serveur.

## Piliers (validés avec le user)
- **Vrais chiffres** : prix live via API si possible, sinon valeurs réalistes figées.
- **Missions & niveaux** : objectifs, XP, déblocages progressifs d'actifs/fonctionnalités.
- **Risque & effet de levier** : emprunts, levier, **faillite possible** (prendre des risques).
- **Empire de biens interactif** : acheter biens/business (style *Richman Empire* mais + interactif
  qu'une simple carte) → revenus passifs, upgrades.
- **Style** : « fun mais sérieux » — crédible côté finance, agréable côté jeu mobile.

## Classes d'actifs & sources de prix
| Classe       | Exemples                        | Source prix                          | Volatilité (jeu) |
|--------------|---------------------------------|--------------------------------------|------------------|
| Crypto       | BTC, ETH, SOL, DOGE             | **CoinGecko live** (+ fallback figé) | Très haute       |
| Or / métaux  | Or, Argent                      | Valeur réaliste figée + tick simulé  | Basse            |
| Actions      | Apple, Tesla, Nvidia, LVMH…     | Valeur réaliste figée + tick simulé  | Moyenne          |
| Immobilier   | Studio, Appart, Immeuble        | Valeur réaliste figée + tick simulé  | Très basse       |
| Biens/Empire | Food-truck, boutique, hôtel…    | Prix figé, génère un **revenu/tour** | —                |

Prix de départ = ordres de grandeur réels (ex : or ~2000 €/once, action ~150-900 €).
`marketTick` fait varier les actifs non-live par random-walk calibré (voir `src/services/marketTick.ts`).

## Modèle de données (conceptuel — voir `src/store` et `src/data` pour le détail exact)
- **Player** : cash, niveau, xp, historique net worth, flags de déblocage.
- **Asset** : id, nom, catégorie, prix courant, prix précédent, volatilité, live?, unité.
- **Position** : assetId, quantité, prix moyen d'achat.
- **Mission** : id, description, condition (prédicat sur l'état), récompense (cash/xp), état.

## Boucle de jeu
Ouvrir l'app → `marketTick` fait bouger les prix + refresh crypto live → consulter Marché →
acheter/vendre → net worth évolue → missions se valident → XP → niveau → déblocages.

## Roadmap (haut niveau)
Voir `PROGRESS.md` pour le détail à jour. Grandes étapes prévues :
1. **[Base jouable]** portefeuille, marché, buy/sell, missions/niveaux, PWA. ← 1re session
2. Effet de levier / emprunts (risque, faillite).
3. Empire de biens interactif (revenus passifs, upgrades).
4. Événements & news qui bougent les marchés.
5. Achievements, prestige, classements, polish visuel/animations.
