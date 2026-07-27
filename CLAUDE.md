# Interest-Man 🎮💰

Jeu d'investissement en **PWA** : le joueur investit (crypto, or, actions, immobilier, biens).
**Vrais chiffres** (prix live via API quand possible, sinon valeurs 100% réalistes) mais
mécaniques **fun et simples** — un jeu, pas une simulation compliquée.

## ⚡ Reprise de session (À LIRE EN 1er)
1. Lis **`docs/PROGRESS.md`** → état actuel : ✅ fait / 🔜 à faire / ⚠️ pièges.
2. Besoin de la vision/règles du jeu ? → **`docs/GAME_DESIGN.md`**.
3. Le code est la source détaillée ; ces 2 docs orientent, ne recopie pas le code dedans.

## Les 3 modes (chacun sa sauvegarde)
📊 Réaliste · 🔥 Chaos (krachs inventés) · 💼 Business Man (**coop à 2** en P2P, entraide ≠ compétition)

## Règles d'or
- Stack : **Vite + React + TS + Tailwind + Zustand + vite-plugin-pwa**. Courbes en SVG maison.
- State global + sauvegarde dans `src/store/` (Zustand `persist` → localStorage).
- Prix : `src/services/prices.ts` (CoinGecko sans clé + **fallback** valeurs figées, jamais de crash).
- Coop : P2P WebRTC via Trystero (`src/coop/p2p.ts`) — **pas de Supabase/Firebase** (quotas pleins).
- Le jeu doit rester **jouable hors-ligne** et **mobile-first**.
- Langue de l'UI et des docs : **français**.
- Branche de dev : `claude/investment-game-pwa-iyt6m4`. Pas de PR sauf demande explicite.
- **À la fin de chaque session : mettre à jour `docs/PROGRESS.md`.**

## Commandes
`npm run dev` · `npm run build` · `npm run preview` · `npm test`
