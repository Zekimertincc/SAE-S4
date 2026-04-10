import { useState, useEffect } from 'react'
import { getVisitors, getStats, getToken, clearToken } from '../api/api'
import type { Visitor, Stats } from '../api/api'
import LoginForm   from '../components/LoginForm'
import AdminHeader from '../components/AdminHeader'
import TabBar      from '../components/TabBar'
import type { TabKey } from '../components/TabBar'
import StatsTab    from '../components/StatsTab'
import VisitorsTab from '../components/VisitorTab'
import AvisTab     from '../components/AvisTab'
import SettingsTab from '../components/SettingsTab'
import { C, font } from '../theme'

const LIMIT = 15

export default function Admin() {
  const [authed, setAuthed] = useState(() => !!getToken())
  const [tab,    setTab]    = useState<TabKey>('stats')

  const [visitors,      setVisitors]      = useState<Visitor[]>([])
  const [stats,         setStats]         = useState<Stats | null>(null)
  const [total,         setTotal]         = useState(0)
  const [page,          setPage]          = useState(1)
  const [deptFilter,      setDeptFilter]      = useState('')
  const [bacFilter,       setBacFilter]       = useState('')
  const [reoFilter,       setReoFilter]       = useState('')
  const [immersionFilter, setImmersionFilter] = useState('')
  const [dossierFilter,   setDossierFilter]   = useState('')
  const [dateFilter,      setDateFilter]      = useState('')
  const [searchFilter,    setSearchFilter]    = useState('')
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')

  useEffect(() => {
    if (authed) fetchAll()
  }, [authed, deptFilter, bacFilter, reoFilter, immersionFilter, dossierFilter, dateFilter, searchFilter, page])

  async function fetchAll() {
    setLoading(true); setError('')
    try {
      const [visitorsRes, statsRes] = await Promise.all([
        getVisitors(page, LIMIT, deptFilter, bacFilter, reoFilter, dateFilter, searchFilter, immersionFilter, dossierFilter),
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
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>

      <style>{`
        .admin-main { flex: 1; padding: 24px; max-width: 1280px; width: 100%; margin: 0 auto; box-sizing: border-box; }
        @media (max-width: 640px)  { .admin-main { padding: 14px; } }
        @media (min-width: 641px) and (max-width: 1024px) { .admin-main { padding: 20px; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', flexDirection: 'column', fontFamily: font }}>

        <AdminHeader onLogout={() => { clearToken(); setAuthed(false) }} />
        <TabBar activeTab={tab} onTabChange={t => { setTab(t); setPage(1) }} />

        <main className="admin-main">

          {error && (
            <div style={{ marginBottom: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {tab === 'stats' && (
            <StatsTab stats={stats} visitors={visitors} />
          )}

          {tab === 'visitors' && (
            <VisitorsTab
              visitors={visitors} total={total} page={page} limit={LIMIT} loading={loading}
              deptFilter={deptFilter} bacFilter={bacFilter} reoFilter={reoFilter}
              immersionFilter={immersionFilter} dossierFilter={dossierFilter}
              dateFilter={dateFilter} searchFilter={searchFilter}
              onDeptFilterChange={v      => { setDeptFilter(v);      setPage(1) }}
              onBacFilterChange={v       => { setBacFilter(v);       setPage(1) }}
              onReoFilterChange={v       => { setReoFilter(v);       setPage(1) }}
              onImmersionFilterChange={v => { setImmersionFilter(v); setPage(1) }}
              onDossierFilterChange={v   => { setDossierFilter(v);   setPage(1) }}
              onDateFilterChange={v      => { setDateFilter(v);      setPage(1) }}
              onSearchChange={v          => { setSearchFilter(v);    setPage(1) }}
              onPageChange={setPage}
              onRefresh={fetchAll}
            />
          )}

          {tab === 'avis'     && <AvisTab />}
          {tab === 'settings' && <SettingsTab />}

        </main>
      </div>
    </>
  )
}
