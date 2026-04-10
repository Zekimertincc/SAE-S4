import { C, font } from '../theme'

interface Props {
  label: string
  value: number | string
  accent?: 'bordeaux' | 'sauge' | 'amber'
  icon: string
  sub?: string
}

const ACCENT = {
  bordeaux: { fg: C.bordeaux, bg: C.bordeauxLight, bar: C.bordeaux },
  sauge:    { fg: C.sauge,    bg: C.saugeLight,    bar: C.sauge    },
  amber:    { fg: '#b45309',  bg: '#fef3c7',       bar: '#d97706'  },
}

export default function StatCard({ label, value, accent = 'bordeaux', icon, sub }: Props) {
  const a = ACCENT[accent]

  return (
    <div style={{
      background: C.white,
      borderRadius: '16px',
      border: `1px solid ${C.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontFamily: font,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '4px', background: a.bar, borderRadius: '16px 0 0 16px',
      }} />

      <div style={{
        flexShrink: 0,
        width: '48px', height: '48px',
        borderRadius: '12px',
        background: a.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={a.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '26px', fontWeight: 800, color: C.anthracite, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: C.gray, fontWeight: 500, marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: '11px', color: a.fg, fontWeight: 600, marginTop: '2px' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}
