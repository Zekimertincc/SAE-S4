import StatCard from './StatCard'
import BarChart from './BarChart'
import PieChart from './PieChart'
import type { Stats, Visitor } from '../api/api'

interface Props {
  stats: Stats | null
  visitors: Visitor[]
}

export default function StatsTab({ stats, visitors }: Props) {
  // Nombre de visiteurs en réorientation (calculé côté client)
  const reorientationCount = visitors.filter((v) => v.reorientation).length

  return (
    <div className="flex flex-col gap-6">

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total visiteurs" value={stats?.total_visitors ?? '—'} />
        <StatCard label="Départements" value={stats?.by_department.length ?? '—'} />
        <StatCard label="Types de bac" value={stats?.by_bac_type.length ?? '—'} />
        <StatCard label="Réorientations" value={reorientationCount} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Par département</h2>
          <BarChart
            data={(stats?.by_department ?? []).map((d) => ({
              label: d.department,
              count: d.count,
            }))}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Par type de bac</h2>
          <BarChart
            data={(stats?.by_bac_type ?? []).map((d) => ({
              label: d.bac_type,
              count: d.count,
            }))}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Répartition par département</h2>
          <PieChart
            data={(stats?.by_department ?? []).map((d) => ({
              label: d.department,
              value: d.count,
            }))}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Répartition par bac</h2>
          <PieChart
            data={(stats?.by_bac_type ?? []).map((d) => ({
              label: d.bac_type,
              value: d.count,
            }))}
          />
        </div>
      </div>

    </div>
  )
}