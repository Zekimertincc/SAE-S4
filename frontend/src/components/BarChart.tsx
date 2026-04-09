const BAR_MAX_PX = 120
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

export default function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="flex items-end gap-3">
      {data.map((item, i) => (
        <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-semibold text-gray-700">{item.count}</span>
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${Math.max((item.count / max) * BAR_MAX_PX, 4)}px`,
              backgroundColor: COLORS[i % COLORS.length],
            }}
          />
          <span className="text-xs text-gray-500 truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
