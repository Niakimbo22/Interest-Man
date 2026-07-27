import { joinRoom, type Room } from 'trystero'
import { useCoop, type ChatMessage } from './coopStore'
import type { CoopRole } from './roles'
import { useGame } from '@/store/gameStore'

// Connexion directe navigateur ↔ navigateur (WebRTC via Trystero).
// Aucun compte, aucun serveur à héberger : Trystero utilise un réseau public
// UNIQUEMENT pour la mise en relation. Ensuite les données passent en direct,
// chiffrées de bout en bout, entre les deux joueurs.

const APP_ID = 'interest-man-coop'

// Trystero contraint ses charges utiles à du JSON pur. Nos objets le sont, mais le
// typage structurel de la lib ne le reconnaît pas : on encapsule les casts ici,
// une seule fois, plutôt que de les disséminer dans le code de jeu.
type Json = null | string | number | boolean | Json[] | { [k: string]: Json }
const toWire = <T,>(v: T) => v as unknown as Json
const fromWire = <T,>(v: unknown) => v as T

/** Charge utile synchronisée : l'état de la boîte commune. */
interface SharedState {
  cash: number
  xp: number
  positions: Record<string, { assetId: string; quantity: number; avgPrice: number }>
  prices: Record<string, number>
  missionStatus: Record<string, string>
  netWorthHistory: number[]
}

interface TradeRequest {
  action: 'buy' | 'sell'
  assetId: string
  quantity: number
}

interface ChatPayload {
  text: string
  assetId?: string
}

let room: Room | null = null
let sendState: ((s: SharedState) => void) | null = null
let sendTrade: ((t: TradeRequest) => void) | null = null
let sendChat: ((m: ChatPayload) => void) | null = null
let isHost = false
let stateTimer: ReturnType<typeof setInterval> | null = null

function snapshot(): SharedState {
  const s = useGame.getState()
  return {
    cash: s.cash,
    xp: s.xp,
    positions: s.positions,
    prices: s.prices,
    missionStatus: s.missionStatus as unknown as Record<string, string>,
    netWorthHistory: s.netWorthHistory,
  }
}

/** L'hôte fait autorité sur le marché et le portefeuille commun. */
export function isCoopHost() {
  return isHost
}

/** Diffuse l'état courant aux associés (appelé par l'hôte). */
export function broadcastState() {
  if (isHost && sendState) sendState(snapshot())
}

/**
 * Rejoint (ou crée) une boîte partagée.
 * @param code  code de room, partagé entre les deux amis
 * @param role  rôle choisi par CE joueur
 * @param host  true si ce joueur a créé la boîte (fait autorité sur le marché)
 */
export async function joinCoopRoom(code: string, role: CoopRole, host: boolean) {
  await leaveCoopRoom()

  const coop = useCoop.getState()
  coop.setRoom(code, role)
  coop.setConnState('connecting')
  isHost = host

  let joined: Room
  try {
    // Le code de room sert aussi de mot de passe → chiffrement de bout en bout.
    joined = joinRoom({ appId: APP_ID, password: code }, code)
  } catch (err) {
    useCoop.getState().setConnState('error', err instanceof Error ? err.message : 'Connexion impossible')
    return
  }
  room = joined

  // --- État commun : seul l'invité applique, l'hôte fait autorité ---
  const stateAction = joined.makeAction('state', {
    onMessage: (raw) => {
      if (isHost) return
      const state = fromWire<SharedState>(raw)
      useGame.getState().applyRemoteState({
        cash: state.cash,
        xp: state.xp,
        positions: state.positions,
        prices: state.prices,
        missionStatus: state.missionStatus as never,
        netWorthHistory: state.netWorthHistory,
      })
    },
  })

  // --- Ordres : seul l'hôte les exécute, puis rediffuse l'état ---
  const tradeAction = joined.makeAction('trade', {
    onMessage: (raw) => {
      if (!isHost) return
      const req = fromWire<TradeRequest>(raw)
      const game = useGame.getState()
      if (req.action === 'buy') game.buy(req.assetId, req.quantity)
      else game.sell(req.assetId, req.quantity)
      broadcastState()
    },
  })

  // --- Chat / recommandations ---
  const chatAction = joined.makeAction('chat', {
    onMessage: (raw) => {
      const msg = fromWire<ChatPayload>(raw)
      useCoop.getState().addMessage({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        from: 'partner',
        text: msg.text,
        at: Date.now(),
        assetId: msg.assetId,
      } satisfies ChatMessage)
    },
  })

  sendState = (s) => void stateAction.send(toWire(s))
  sendTrade = (t) => void tradeAction.send(toWire(t))
  sendChat = (m) => void chatAction.send(toWire(m))

  joined.onPeerJoin = () => {
    useCoop.getState().setPartnerPresent(true)
    useCoop.getState().setConnState('connected')
    // L'hôte synchronise immédiatement le nouvel arrivant.
    broadcastState()
  }

  joined.onPeerLeave = () => {
    const stillThere = Object.keys(joined.getPeers()).length > 0
    useCoop.getState().setPartnerPresent(stillThere)
    if (!stillThere) useCoop.getState().setConnState('lost')
  }

  useCoop.getState().setConnState('connected')

  // L'hôte pousse l'état régulièrement (le marché bouge de son côté).
  if (isHost) stateTimer = setInterval(broadcastState, 3000)
}

/** Envoie un ordre : exécuté localement si on est l'hôte, sinon transmis à l'hôte. */
export function requestTrade(action: 'buy' | 'sell', assetId: string, quantity: number) {
  if (isHost) {
    const game = useGame.getState()
    const res = action === 'buy' ? game.buy(assetId, quantity) : game.sell(assetId, quantity)
    broadcastState()
    return res
  }
  if (sendTrade) {
    sendTrade({ action, assetId, quantity })
    return { ok: true }
  }
  return { ok: false, error: 'Pas connecté à ton associé' }
}

/** Envoie un message (ou une recommandation d'actif) à l'associé. */
export function sendCoopMessage(text: string, assetId?: string) {
  useCoop.getState().addMessage({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    from: 'me',
    text,
    at: Date.now(),
    assetId,
  })
  if (sendChat) sendChat({ text, assetId })
}

export async function leaveCoopRoom() {
  if (stateTimer) {
    clearInterval(stateTimer)
    stateTimer = null
  }
  if (room) {
    try {
      await room.leave()
    } catch {
      // rien à faire : on quitte de toute façon
    }
    room = null
  }
  sendState = null
  sendTrade = null
  sendChat = null
  isHost = false
  useCoop.getState().leave()
}
