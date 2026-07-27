// Les deux associés d'une même boîte. Rôles COMPLÉMENTAIRES : chacun a un pouvoir
// que l'autre n'a pas → il faut se parler et s'entraider pour bien jouer.

export type CoopRole = 'trader' | 'analyste'

export interface CoopRoleDef {
  id: CoopRole
  name: string
  title: string
  emoji: string
  power: string
  /** Ce que l'associé ne peut PAS faire seul → oblige à communiquer. */
  needs: string
}

export const COOP_ROLES: Record<CoopRole, CoopRoleDef> = {
  trader: {
    id: 'trader',
    name: 'Trader',
    title: 'Directeur des investissements',
    emoji: '📈',
    power: 'Seul à pouvoir passer les ordres d\'achat et de vente de la boîte.',
    needs: 'Mais il ne voit pas les tendances : il a besoin des analyses de son associé.',
  },
  analyste: {
    id: 'analyste',
    name: 'Analyste',
    title: 'Directeur de la recherche',
    emoji: '🔍',
    power: 'Voit les tendances cachées du marché et peut recommander des actifs.',
    needs: 'Mais il ne peut pas acheter lui-même : il doit convaincre son associé.',
  },
}

export const ROLE_LIST = Object.values(COOP_ROLES)

export function otherRole(role: CoopRole): CoopRole {
  return role === 'trader' ? 'analyste' : 'trader'
}
