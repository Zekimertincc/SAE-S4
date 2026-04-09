const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startDeg))
  const y1 = cy + r * Math.sin(toRad(startDeg))
  const x2 = cx + r * Math.cos(toRad(endDeg))
  const y2 = cy + r * Math.sin(toRad(endDeg))
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export default function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>
  }

  let angle = -90 // on part du haut (12h)

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width="160" height="160" viewBox="0 0 200 200" className="flex-shrink-0">
        {data.map((item, i) => {
          // Si un seul segment, on évite start === end (dégénéré en SVG)
          const slice = item.value / total === 1 ? 359.99 : (item.value / total) * 360
          const path = arcPath(100, 100, 90, angle, angle + slice)
          angle += slice
          return <path key={item.label} d={path} fill={COLORS[i % COLORS.length]} />
        })}
      </svg>

      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800 ml-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
