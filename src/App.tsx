import { useState } from 'react'
import { Header } from '@/components/Header'
import { TabBar, type Tab } from '@/components/TabBar'
import { MarketScreen } from '@/features/market/MarketScreen'
import { PortfolioScreen } from '@/features/portfolio/PortfolioScreen'
import { MissionsScreen } from '@/features/missions/MissionsScreen'
import { ModeSelectScreen } from '@/features/modes/ModeSelectScreen'
import { EventPopup } from '@/features/chaos/EventPopup'
import { CoopLobby } from '@/features/coop/CoopLobby'
import { CoopRoom } from '@/features/coop/CoopRoom'
import { useMarketLoop } from '@/hooks/useMarketLoop'
import { useGame } from '@/store/gameStore'
import { useSession } from '@/store/sessionStore'
import { useCoop } from '@/coop/coopStore'
import { GAME_MODES } from '@/data/gameModes'

export default function App() {
  const [tab, setTab] = useState<Tab>('market')
  const mode = useSession((s) => s.mode)
  useMarketLoop()

  const claimable = useGame(
    (s) => Object.values(s.missionStatus).filter((v) => v === 'claimable').length,
  )
  const inCoopRoom = useCoop((s) => s.roomCode !== null)

  // Aucun mode choisi → écran d'accueil.
  if (!mode) return <ModeSelectScreen />

  const modeDef = GAME_MODES[mode]
  const isBusiness = mode === 'business'

  return (
    <div className={`h-full flex flex-col max-w-md mx-auto bg-base-900 ${isBusiness ? 'theme-business' : ''}`}>
      <Header />
      <main className="flex-1 overflow-y-auto">
        {tab === 'market' && <MarketScreen />}
        {tab === 'portfolio' && <PortfolioScreen />}
        {tab === 'missions' && <MissionsScreen />}
        {tab === 'coop' && (inCoopRoom ? <CoopRoom /> : <CoopLobby />)}
      </main>
      <TabBar
        active={tab}
        onChange={setTab}
        missionBadge={claimable}
        showCoop={isBusiness}
        coopAccent={modeDef.accent}
      />
      {/* Événements délirants du mode Chaos */}
      <EventPopup />
    </div>
  )
}
