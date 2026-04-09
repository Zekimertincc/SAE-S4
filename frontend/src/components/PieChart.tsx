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

function donutPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startDeg: number, endDeg: number,
) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const s = startDeg, e = endDeg
  const x1 = cx + outerR * Math.cos(toRad(s))
  const y1 = cy + outerR * Math.sin(toRad(s))
  const x2 = cx + outerR * Math.cos(toRad(e))
  const y2 = cy + outerR * Math.sin(toRad(e))
  const x3 = cx + innerR * Math.cos(toRad(e))
  const y3 = cy + innerR * Math.sin(toRad(e))
  const x4 = cx + innerR * Math.cos(toRad(s))
  const y4 = cy + innerR * Math.sin(toRad(s))
  const large = e - s > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`
}

export default function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  if (total === 0) {
    return (
      <p style={{ textAlign: 'center', color: C.gray, fontSize: '13px', padding: '24px 0', fontFamily: font }}>
        Aucune donnée
      </p>
    )
  }

  let angle = -90
  const slices = data.map((item, i) => {
    const sweep = item.value / total === 1 ? 359.99 : (item.value / total) * 360
    const path  = donutPath(100, 100, 90, 52, angle, angle + sweep)
    angle += sweep
    return { ...item, path, color: COLORS[i % COLORS.length] }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontFamily: font }}>
      <div style={{ position: 'relative', flexShrink: 0, width: '150px', height: '150px' }}>
        <svg width="150" height="150" viewBox="0 0 200 200">
          {slices.map(s => (
            <path key={s.label} d={s.path} fill={s.color} />
          ))}
          <text x="100" y="96"  textAnchor="middle" fontSize="22" fontWeight="800" fill={C.anthracite}>{total}</text>
          <text x="100" y="114" textAnchor="middle" fontSize="11" fill={C.gray}>visiteurs</text>
        </svg>
      </div>

      {/* legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flex: 1, minWidth: '120px' }}>
        {slices.map(s => {
          const pct = Math.round((s.value / total) * 100)
          return (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: C.anthracite, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.label}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: C.gray, flexShrink: 0 }}>
                {s.value} <span style={{ fontWeight: 400, color: '#aaa' }}>({pct}%)</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
