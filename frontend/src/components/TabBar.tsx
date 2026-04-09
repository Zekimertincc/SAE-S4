import { C, font } from '../theme'

const TABS = [
  { key: 'stats',    label: 'Statistiques', icon: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18' },
  { key: 'visitors', label: 'Visiteurs',    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { key: 'avis',     label: 'Avis',         icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { key: 'settings', label: 'Paramètres',   icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
] as const

export type TabKey = (typeof TABS)[number]['key']

interface Props { activeTab: TabKey; onTabChange: (tab: TabKey) => void }

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div style={{
      background: C.white, borderBottom: `1px solid ${C.border}`,
      display: 'flex', padding: '0 24px', fontFamily: font,
    }}>
      {TABS.map(({ key, label, icon }) => {
        const active = activeTab === key
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '13px 16px', background: 'none', border: 'none',
              borderBottom: `2.5px solid ${active ? C.bordeaux : 'transparent'}`,
              marginBottom: '-1px', cursor: 'pointer',
              fontFamily: font, fontSize: '13px', fontWeight: active ? 700 : 500,
              color: active ? C.bordeaux : C.gray,
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = C.anthracite }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = C.gray }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon} />
            </svg>
            {label}
          </button>
        )
      })}
    </div>
  )
}
