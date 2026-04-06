// Les onglets disponibles dans le dashboard admin
const TABS = [
  { key: 'stats', label: 'Statistiques' },
  { key: 'visitors', label: 'Visiteurs' },
  { key: 'settings', label: 'Paramètres' },
] as const

export type TabKey = (typeof TABS)[number]['key']

interface Props {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 bg-white px-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
            activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}