import StatCard from './StatCard'
import BarChart from './BarChart'
import PieChart from './PieChart'
import type { Stats, Visitor } from '../api/api'
import { C, font } from '../theme'

interface Props { stats: Stats | null; visitors: Visitor[] }

const ICONS = {
  users:     'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2 6v-1a3 3 0 0 0-3-3h-1',
  dept:      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  bac:       'M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5',
  reo:       'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6',
  immersion: 'M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 6v4l3 3',
  star:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ width: '3px', height: '18px', background: C.bordeaux, borderRadius: '2px' }} />
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: C.anthracite, fontFamily: font }}>
        {children}
      </p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: '20px 22px',
      fontFamily: font,
    }}>
      <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: C.anthracite }}>
        {title}
      </p>
      {children}
    </div>
  )
}

export default function StatsTab({ stats, visitors }: Props) {
  const reorientationCount = visitors.filter(v => v.reorientation).length
  const immersionCount     = visitors.filter(v => (v as unknown as { immersion?: boolean }).immersion).length

  const rated     = visitors.filter(v => (v as unknown as { rating?: number }).rating)
  const avgRating = rated.length
    ? (rated.reduce((s, v) => s + ((v as unknown as { rating?: number }).rating ?? 0), 0) / rated.length).toFixed(1)
    : null

  const deptData = (stats?.by_department ?? []).map(d => ({ label: d.department, count: d.count }))
  const bacData  = (stats?.by_bac_type  ?? []).map(d => ({ label: d.bac_type,    count: d.count }))

  return (
    <>
      <style>{`
        .stats-kpi   { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .stats-charts{ display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) {
          .stats-kpi    { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 900px) {
          .stats-kpi    { grid-template-columns: repeat(4, 1fr); }
          .stats-charts { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: font }}>

        <section>
          <SectionTitle>Vue d'ensemble</SectionTitle>
          <div className="stats-kpi">
            <StatCard
              label="Total visiteurs"
              value={stats?.total_visitors ?? '—'}
              accent="bordeaux"
              icon={ICONS.users}
            />
            <StatCard
              label="Réorientations"
              value={reorientationCount}
              accent="bordeaux"
              icon={ICONS.reo}
              sub={
                stats?.total_visitors && reorientationCount
                  ? `${Math.round((reorientationCount / stats.total_visitors) * 100)} % des inscrits`
                  : undefined
              }
            />
            <StatCard
              label="Types de bac"
              value={stats?.by_bac_type.length ?? '—'}
              accent="sauge"
              icon={ICONS.bac}
            />
            <StatCard
              label="Départements"
              value={stats?.by_department.length ?? '—'}
              accent="sauge"
              icon={ICONS.dept}
            />
            {immersionCount > 0 && (
              <StatCard
                label="Immersions"
                value={immersionCount}
                accent="amber"
                icon={ICONS.immersion}
              />
            )}
            {avgRating !== null && (
              <StatCard
                label="Note moyenne"
                value={`${avgRating} / 5`}
                accent="amber"
                icon={ICONS.star}
                sub={`${rated.length} avis`}
              />
            )}
          </div>
        </section>

        <section>
          <SectionTitle>Répartitions</SectionTitle>
          <div className="stats-charts">
            <ChartCard title="Inscriptions par département">
              <BarChart data={deptData} />
            </ChartCard>

            <ChartCard title="Inscriptions par type de bac">
              <BarChart data={bacData} />
            </ChartCard>

            <ChartCard title="Répartition par département">
              <PieChart data={deptData.map(d => ({ label: d.label, value: d.count }))} />
            </ChartCard>

            <ChartCard title="Répartition par type de bac">
              <PieChart data={bacData.map(d => ({ label: d.label, value: d.count }))} />
            </ChartCard>
          </div>
        </section>

      </div>
    </>
  )
}
