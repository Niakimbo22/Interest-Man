import { create } from 'zustand'
import type { CoopRole } from './roles'

// État de la session coop (connexion P2P, associé, messages).
// Volontairement NON persisté : une session coop se rejoue en se reconnectant.

export type ConnState = 'idle' | 'connecting' | 'connected' | 'lost' | 'error'

export interface ChatMessage {
  id: string
  from: 'me' | 'partner'
  text: string
  at: number
  /** Message de type "recommandation d'actif" envoyé par l'Analyste. */
  assetId?: string
}

export interface Suggestion {
  assetId: string
  action: 'buy' | 'sell'
  from: CoopRole
  at: number
}

interface CoopState {
  roomCode: string | null
  role: CoopRole | null
  connState: ConnState
  partnerPresent: boolean
  error: string | null
  messages: ChatMessage[]
  /** Recommandation en attente envoyée par l'Analyste au Trader. */
  suggestion: Suggestion | null

  setRoom: (code: string, role: CoopRole) => void
  setConnState: (s: ConnState, error?: string) => void
  setPartnerPresent: (p: boolean) => void
  addMessage: (m: ChatMessage) => void
  setSuggestion: (s: Suggestion | null) => void
  leave: () => void
}

export const useCoop = create<CoopState>((set) => ({
  roomCode: null,
  role: null,
  connState: 'idle',
  partnerPresent: false,
  error: null,
  messages: [],
  suggestion: null,

  setRoom: (code, role) => set({ roomCode: code, role }),
  setConnState: (s, error) => set({ connState: s, error: error ?? null }),
  setPartnerPresent: (p) => set({ partnerPresent: p }),
  addMessage: (m) => set((st) => ({ messages: [...st.messages, m].slice(-60) })),
  setSuggestion: (s) => set({ suggestion: s }),
  leave: () =>
    set({
      roomCode: null,
      role: null,
      connState: 'idle',
      partnerPresent: false,
      error: null,
      messages: [],
      suggestion: null,
    }),
}))

/** Code de room court et lisible à dicter à un ami (évite les caractères ambigus). */
export function generateRoomCode(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}
