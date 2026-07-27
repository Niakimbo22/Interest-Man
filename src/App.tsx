import { useState } from 'react'
import { Header } from '@/components/Header'
import { TabBar, type Tab } from '@/components/TabBar'
import { MarketScreen } from '@/features/market/MarketScreen'
import { PortfolioScreen } from '@/features/portfolio/PortfolioScreen'
import { MissionsScreen } from '@/features/missions/MissionsScreen'
import { useMarketLoop } from '@/hooks/useMarketLoop'
import { useGame } from '@/store/gameStore'

export default function App() {
  const [tab, setTab] = useState<Tab>('market')
  useMarketLoop()

  const claimable = useGame(
    (s) => Object.values(s.missionStatus).filter((v) => v === 'claimable').length,
  )

  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-base-900">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {tab === 'market' && <MarketScreen />}
        {tab === 'portfolio' && <PortfolioScreen />}
        {tab === 'missions' && <MissionsScreen />}
      </main>
      <TabBar active={tab} onChange={setTab} missionBadge={claimable} />
    </div>
  )
}
