import { C, font } from '../theme'

const COLORS = [
  C.bordeaux,
  C.sauge,
  '#C4526F',
  '#4e8c80',
  '#8b5cf6',
  '#d97706',
  '#0ea5e9',
  '#ec4899',
]

interface BarItem { label: string; count: number }

export default function BarChart({ data }: { data: BarItem[] }) {
  if (!data.length) {
    return (
      <p style={{ textAlign: 'center', color: C.gray, fontSize: '13px', padding: '24px 0', fontFamily: font }}>
        Aucune donnée
      </p>
    )
  }

  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: font }}>
      {data.map((item, i) => {
        const pct = Math.max((item.count / max) * 100, 2)
        const color = COLORS[i % COLORS.length]
        return (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '80px', flexShrink: 0,
              fontSize: '12px', color: C.anthracite, fontWeight: 500,
              textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.label}
            </div>

            <div style={{ flex: 1, height: '26px', background: '#f1f1f1', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: color,
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '8px',
                transition: 'width 0.4s ease',
                minWidth: '26px',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{item.count}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
