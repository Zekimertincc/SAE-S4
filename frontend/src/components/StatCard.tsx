export default function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-1">
      <span className="text-3xl font-bold text-gray-800">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}
