import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import BarChart from '../components/BarChart'

const API = 'http://127.0.0.1:5000/api'
const DEPARTMENTS = ['Informatique', 'GEII', 'TC', 'GEA', 'MMI', 'RT', 'Carrières Sociales']

interface Visitor {
  _id: string
  first_name: string
  last_name: string
  email: string
  bac_type: string
  department: string
  ine?: string
  reorientation: boolean
  created_at: string
}

interface Stats {
  total_visitors: number
  by_department: { department: string; count: number }[]
  by_bac_type: { bac_type: string; count: number }[]
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`${API}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const data = await res.json()
      onLogin(data.token)
    } else {
      setError('Mot de passe incorrect.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Espace gestionnaire</h1>
        <p className="text-gray-400 text-sm mb-6">IUT Montreuil — Accès réservé</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoFocus
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit"
            className="bg-blue-600 text-white font-semibold rounded-xl py-2.5 hover:bg-blue-700 transition">
            Se connecter
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          <a href="/" className="hover:underline">← Retour au formulaire</a>
        </p>
      </div>
    </div>
  )
}

export default function Admin() {
  const [token, setToken] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'stats' | 'visitors'>('stats')
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const LIMIT = 15

  useEffect(() => {
    if (authed) fetchAll()
  }, [authed, deptFilter, page])

  async function fetchAll() {
    setLoading(true)
    setError('')
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
      if (deptFilter) params.set('department', deptFilter)

      const [visRes, totalRes, deptRes, bacRes] = await Promise.all([
        fetch(`${API}/visitors?${params}`, { headers }),
        fetch(`${API}/stats/total`),
        fetch(`${API}/stats/department`),
        fetch(`${API}/stats/visitors`),
      ])

      const visJson = await visRes.json()
      const totalJson = await totalRes.json()
      const deptJson = await deptRes.json()
      const bacJson = await bacRes.json()

      setVisitors(visJson.data ?? [])
      setTotal(visJson.pagination?.total ?? 0)
      setStats({
        total_visitors: totalJson.total_visitors ?? 0,
        by_department: deptJson.by_department ?? [],
        by_bac_type: bacJson.by_bac_type ?? [],
      })
    } catch {
      setError('API inaccessible — données de démo affichées.')
      setVisitors([
        { _id: '1', first_name: 'Marie', last_name: 'Dupont', email: 'marie@ex.fr', bac_type: 'Général', department: 'Informatique', reorientation: false, created_at: new Date().toISOString() },
        { _id: '2', first_name: 'Lucas', last_name: 'Martin', email: 'lucas@ex.fr', bac_type: 'STI2D', department: 'GEII', reorientation: true, ine: '1234567890A', created_at: new Date().toISOString() },
        { _id: '3', first_name: 'Camille', last_name: 'Bernard', email: 'camille@ex.fr', bac_type: 'Général', department: 'TC', reorientation: false, created_at: new Date().toISOString() },
      ])
      setTotal(148)
      setStats({
        total_visitors: 148,
        by_department: [
          { department: 'Informatique', count: 62 },
          { department: 'GEII', count: 38 },
          { department: 'TC', count: 24 },
          { department: 'MMI', count: 18 },
        ],
        by_bac_type: [
          { bac_type: 'Général', count: 89 },
          { bac_type: 'STI2D', count: 32 },
          { bac_type: 'STMG', count: 16 },
          { bac_type: 'PRO', count: 11 },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleExport(filename: string, fields?: string) {
    const url = fields ? `${API}/visitors/export?fields=${fields}` : `${API}/visitors/export`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  if (!authed) return <LoginForm onLogin={(t) => { setToken(t); setAuthed(true) }} />

  const filtered = visitors.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return v.first_name.toLowerCase().includes(q) ||
      v.last_name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-xs text-gray-400">IUT Montreuil — Journée Portes Ouvertes</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleExport('visiteurs.csv')}
            className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition">
            Export CSV
          </button>
          <button onClick={() => setAuthed(false)}
            className="text-sm text-gray-400 hover:text-gray-600 transition">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex border-b border-gray-200 bg-white px-6">
        {(['stats', 'visitors'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            {t === 'stats' ? 'Statistiques' : 'Visiteurs'}
          </button>
        ))}
      </div>

      <main className="p-6 max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded-lg p-3">
            {error}
          </div>
        )}

        {tab === 'stats' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total visiteurs" value={stats?.total_visitors ?? '—'} />
              <StatCard label="Départements" value={stats?.by_department.length ?? '—'} />
              <StatCard label="Types de bac" value={stats?.by_bac_type.length ?? '—'} />
              <StatCard label="Réorientations" value={visitors.filter((v) => v.reorientation).length} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="font-semibold text-gray-700 mb-4">Par département</h2>
                <BarChart data={(stats?.by_department ?? []).map((d) => ({ label: d.department, count: d.count }))} />
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="font-semibold text-gray-700 mb-4">Par type de bac</h2>
                <BarChart data={(stats?.by_bac_type ?? []).map((d) => ({ label: d.bac_type, count: d.count }))} />
              </div>
            </div>
          </div>
        )}

        {tab === 'visitors' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="Rechercher par nom ou email…"
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" />
              <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1) }}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48">
                <option value="">Tous les départements</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <button onClick={fetchAll} disabled={loading}
                className="border rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
                {loading ? '…' : 'Actualiser'}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Nom', 'E-mail', 'Bac', 'Département', 'INE', 'Date', 'Statut'].map((col) => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 7 }).map((_, j) => (
                            <td key={j} className="px-4 py-3">
                              <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                          Aucun visiteur trouvé.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((v) => (
                        <tr key={v._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{v.first_name} {v.last_name}</td>
                          <td className="px-4 py-3 text-gray-500">{v.email}</td>
                          <td className="px-4 py-3 text-gray-600">{v.bac_type}</td>
                          <td className="px-4 py-3 text-gray-600">{v.department}</td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">{v.ine ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(v.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              v.reorientation ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {v.reorientation ? 'Réorientation' : 'Lycéen'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-400">Page {page} / {totalPages} — {total} visiteurs</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40">←</button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40">→</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleExport('visiteurs.csv')}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition">
                Export complet (CSV)
              </button>
              <button onClick={() => handleExport('emails.csv', 'first_name,last_name,email')}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition">
                Liste e-mails (CSV)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
