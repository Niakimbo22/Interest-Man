// Événements 100% INVENTÉS pour le mode Chaos.
// Krachs absurdes, hype délirante — rien de tout ça n'est réel, c'est là pour le fun.
// `impact` = variation appliquée au prix (0.5 = +50%, -0.4 = -40%).

import type { Category } from './types'

export interface ChaosEvent {
  id: string
  headline: string
  detail: string
  emoji: string
  /** Cible : une catégorie entière, un actif précis, ou tout le marché. */
  target: { kind: 'category'; category: Category } | { kind: 'asset'; assetId: string } | { kind: 'all' }
  /** Variation relative immédiate. */
  impact: number
  tone: 'boom' | 'krach' | 'weird'
}

export const CHAOS_EVENTS: ChaosEvent[] = [
  // ---- KRACHS INVENTÉS ----
  {
    id: 'krach_hamster',
    headline: 'LE GRAND KRACH DU HAMSTER',
    detail: 'Un hamster s\'est endormi sur le clavier du plus gros trader de Wall Street. 400 milliards vendus par erreur.',
    emoji: '🐹',
    target: { kind: 'all' },
    impact: -0.28,
    tone: 'krach',
  },
  {
    id: 'krach_wifi',
    headline: 'PANNE DE WIFI MONDIALE',
    detail: 'Plus personne ne peut vérifier son portefeuille. La panique est totale. Les crypto s\'effondrent.',
    emoji: '📡',
    target: { kind: 'category', category: 'crypto' },
    impact: -0.42,
    tone: 'krach',
  },
  {
    id: 'krach_or_faux',
    headline: 'L\'OR ÉTAIT DU PLASTIQUE',
    detail: 'Un scientifique révèle que 30% de l\'or mondial serait du plastique peint. Enquête en cours.',
    emoji: '🪙',
    target: { kind: 'category', category: 'metal' },
    impact: -0.35,
    tone: 'krach',
  },
  {
    id: 'krach_immo_licorne',
    headline: 'DES LICORNES DANS LES IMMEUBLES',
    detail: 'Une colonie de licornes squatte les nouveaux immeubles. Les acheteurs fuient. Le marché s\'écroule.',
    emoji: '🦄',
    target: { kind: 'category', category: 'realestate' },
    impact: -0.22,
    tone: 'krach',
  },
  {
    id: 'krach_lundi_noir',
    headline: 'LUNDI ULTRA-NOIR',
    detail: 'Personne ne sait pourquoi. Tout le monde vend. C\'est lundi, c\'est comme ça.',
    emoji: '🌑',
    target: { kind: 'all' },
    impact: -0.33,
    tone: 'krach',
  },
  {
    id: 'krach_ia_boude',
    headline: 'LES IA FONT LA GRÈVE',
    detail: 'Toutes les IA de trading refusent de travailler tant qu\'on ne dit pas "merci". Les actions tech plongent.',
    emoji: '🤖',
    target: { kind: 'category', category: 'stock' },
    impact: -0.38,
    tone: 'krach',
  },

  // ---- BOOMS DÉLIRANTS ----
  {
    id: 'boom_chat_pdg',
    headline: 'UN CHAT NOMMÉ PDG',
    detail: 'Le conseil d\'administration a élu un chat à la tête du groupe. Les investisseurs adorent. +80%.',
    emoji: '🐱',
    target: { kind: 'category', category: 'stock' },
    impact: 0.8,
    tone: 'boom',
  },
  {
    id: 'boom_doge_lune',
    headline: 'DOGE SUR LA LUNE (LITTÉRALEMENT)',
    detail: 'Une fusée a gravé le logo Dogecoin sur la Lune. C\'est visible depuis la Terre. La hype explose.',
    emoji: '🚀',
    target: { kind: 'asset', assetId: 'doge' },
    impact: 2.5,
    tone: 'boom',
  },
  {
    id: 'boom_or_alien',
    headline: 'DE L\'OR TROUVÉ SUR MARS… PUIS PERDU',
    detail: 'On a trouvé une montagne d\'or sur Mars, mais impossible de la ramener. L\'or terrestre devient précieux.',
    emoji: '👽',
    target: { kind: 'category', category: 'metal' },
    impact: 0.65,
    tone: 'boom',
  },
  {
    id: 'boom_teletravail_espace',
    headline: 'TÉLÉTRAVAIL DEPUIS L\'ESPACE',
    detail: 'Tout le monde veut un appartement avec vue sur orbite. L\'immobilier s\'envole.',
    emoji: '🛰️',
    target: { kind: 'category', category: 'realestate' },
    impact: 0.45,
    tone: 'boom',
  },
  {
    id: 'boom_btc_monnaie',
    headline: 'UN PAYS ENTIER PASSE AU BITCOIN',
    detail: 'La République Imaginaire de Nowhereland adopte le BTC. Même les baguettes se paient en satoshis.',
    emoji: '₿',
    target: { kind: 'asset', assetId: 'btc' },
    impact: 1.2,
    tone: 'boom',
  },
  {
    id: 'boom_euphorie',
    headline: 'EUPHORIE GÉNÉRALISÉE',
    detail: 'Un influenceur a dit "achetez tout". Les gens ont acheté tout. Vraiment tout.',
    emoji: '🤩',
    target: { kind: 'all' },
    impact: 0.55,
    tone: 'boom',
  },

  // ---- BIZARRE ----
  {
    id: 'weird_pluie_argent',
    headline: 'IL PLEUT DES PIÈCES SUR LYON',
    detail: 'Un avion transportant de la monnaie a eu un souci de trappe. L\'argent devient bizarrement commun.',
    emoji: '🌧️',
    target: { kind: 'asset', assetId: 'silver' },
    impact: -0.5,
    tone: 'weird',
  },
  {
    id: 'weird_inversion',
    headline: 'LES MARCHÉS SONT À L\'ENVERS',
    detail: 'Un bug cosmique a inversé tous les graphiques. Les experts sont perplexes. Les prix aussi.',
    emoji: '🙃',
    target: { kind: 'all' },
    impact: 0.18,
    tone: 'weird',
  },
  {
    id: 'weird_tesla_vole',
    headline: 'LES VOITURES VOLENT (POUR DE VRAI)',
    detail: 'Une mise à jour logicielle a rendu les voitures capables de voler. Personne n\'avait prévu ça.',
    emoji: '🛸',
    target: { kind: 'asset', assetId: 'tsla' },
    impact: 1.6,
    tone: 'boom',
  },
]

/** Tire un événement au hasard. */
export function randomChaosEvent(): ChaosEvent {
  return CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]
}
