import { useState, useEffect } from 'react'
import { getVisitors, getStats, getToken, clearToken } from '../api/api'
import type { Visitor, Stats } from '../api/api'
import LoginForm from '../components/LoginForm'
import AdminHeader from '../components/AdminHeader'
import TabBar from '../components/TabBar'
import type { TabKey } from '../components/TabBar'
import StatsTab from '../components/StatsTab'
import VisitorsTab from '../components/VisitorTab'
import SettingsTab from '../components/SettingsTab'

const LIMIT = 15

export default function Admin() {
  const [authed, setAuthed] = useState(() => !!getToken())
  const [tab, setTab] = useState<TabKey>('stats')

  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [deptFilter, setDeptFilter] = useState('')
  const [bacFilter, setBacFilter] = useState('')
  const [reoFilter, setReoFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authed) fetchAll()
  }, [authed, deptFilter, bacFilter, reoFilter, dateFilter, searchFilter, page])

  async function fetchAll() {
    setLoading(true)
    setError('')
    try {
      const [visitorsRes, statsRes] = await Promise.all([
        getVisitors(page, LIMIT, deptFilter, bacFilter, reoFilter, dateFilter, searchFilter),
        getStats(),
      ])
      setVisitors(visitorsRes.data)
      setTotal(visitorsRes.pagination.total)
      setStats(statsRes)
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminHeader onLogout={() => { clearToken(); setAuthed(false) }} />

      <TabBar activeTab={tab} onTabChange={setTab} />

      <main className="p-6 max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3">
            {error}
          </div>
        )}

        {tab === 'stats' && (
          <StatsTab stats={stats} visitors={visitors} />
        )}

        {tab === 'visitors' && (
          <VisitorsTab
            visitors={visitors}
            total={total}
            page={page}
            limit={LIMIT}
            loading={loading}
            deptFilter={deptFilter}
            bacFilter={bacFilter}
            reoFilter={reoFilter}
            dateFilter={dateFilter}
            searchFilter={searchFilter}
            onDeptFilterChange={(v) => { setDeptFilter(v); setPage(1) }}
            onBacFilterChange={(v) => { setBacFilter(v); setPage(1) }}
            onReoFilterChange={(v) => { setReoFilter(v); setPage(1) }}
            onDateFilterChange={(v) => { setDateFilter(v); setPage(1) }}
            onSearchChange={(v) => { setSearchFilter(v); setPage(1) }}
            onPageChange={setPage}
            onRefresh={fetchAll}
          />
        )}

        {tab === 'settings' && <SettingsTab />}
      </main>

    </div>
  )
}