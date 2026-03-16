export default function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="flex items-end gap-3 h-36">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-semibold text-gray-700">{item.count}</span>
          <div
            className="w-full bg-blue-500 rounded-t-md"
            style={{ height: `${(item.count / max) * 100}%` }}
          />
          <span className="text-xs text-gray-500 truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
