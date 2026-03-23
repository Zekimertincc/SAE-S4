import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import BarChart from '../components/BarChart'

const API = 'http://127.0.0.1:5000/api'
const DEPARTMENTS = ['Informatique', 'GEII', 'TC', 'GEA', 'MMI', 'RT', 'Carrières Sociales']
const BAC_TYPES = ['Général', 'STI2D', 'STL', 'STMG', 'ST2S', 'PRO', 'Autre']
const TOKEN_KEY = 'jpo_admin_token'


interface Visitor {
  id: string
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

function getStoredToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) ?? ''
}

function storeToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        onLogin(data.token)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Identifiants incorrects.')
      }
    } catch {
      setError('Serveur inaccessible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Espace gestionnaire</h1>
        <p className="text-gray-400 text-sm mb-6">IUT Montreuil — Accès réservé</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iut-montreuil.fr"
              autoFocus
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold rounded-xl py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
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
  const [token, setToken] = useState<string>(getStoredToken)
  const [authed, setAuthed] = useState<boolean>(() => Boolean(getStoredToken()))

  const [tab, setTab] = useState<'stats' | 'visitors'>('stats')
  const [visiteurs, setVisiteurs] = useState<Visitor[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [total, setTotal] = useState(0)

  const [recherche, setRecherche] = useState('')
  const [rechercheDebounce, setRechercheDebounce] = useState('')

  const [filtreDep, setfiltreDep] = useState('')
  const [filtreBac, setFiltreBac] = useState('')
  const [filtreReo, setfiltreReo] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const LIMITE = 15

  useEffect(() => {
    const timer = setTimeout(() => {
      setRechercheDebounce(recherche)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [recherche])

  useEffect(() => {
    if (authed) fetchAll()
  }, [authed, filtreDep, filtreBac, filtreReo, rechercheDebounce, page])

  function authHeaders() {
    return { Authorization: `Bearer ${token}` }
  }

  async function fetchAll() {
    setLoading(true)
    setErreur('')
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMITE) })
      if (filtreDep) params.set('department', filtreDep)
      if (filtreBac) params.set('bac_type', filtreBac)
      if (filtreReo) params.set('reorientation', filtreReo)
      if (rechercheDebounce) params.set('search', rechercheDebounce)

      const hdrs = authHeaders()
      const [visRes, totalRes, deptRes, bacRes] = await Promise.all([
        fetch(`${API}/visitors?${params}`, { headers: hdrs }),
        fetch(`${API}/stats/total`, { headers: hdrs }),
        fetch(`${API}/stats/department`, { headers: hdrs }),
        fetch(`${API}/stats/visitors`, { headers: hdrs }),
      ])

      if (visRes.status === 401) {
        handleDeconnexion()
        return
      }

      const visJson = await visRes.json()
      const totalJson = await totalRes.json()
      const deptJson = await deptRes.json()
      const bacJson = await bacRes.json()

      setVisiteurs(visJson.data ?? [])
      setTotal(visJson.pagination?.total ?? 0)
      setStats({
        total_visitors: totalJson.total_visitors ?? 0,
        by_department: deptJson.by_department ?? [],
        by_bac_type: bacJson.by_bac_type ?? [],
      })
    }catch (err) {
      setErreur("Impossible de charger les données. Vérifiez votre connexion au serveur.")
    }
    finally {
      setLoading(false)
    }
  }

async function handleExport(colonnes?: string) {
  const params = new URLSearchParams()
  let details = ""

  if (filtreDep) {
    params.set('department', filtreDep)
    details += `_${filtreDep}`
  }
  if (filtreBac) {
    params.set('bac_type', filtreBac)
    details += `_${filtreBac}`
  }
  if (filtreReo) {
    params.set('reorientation', filtreReo)
    details += filtreReo === 'true' ? '_Reorientation' : '_Lyceen'
  }
  if (rechercheDebounce) {
    params.set('search', rechercheDebounce)
    details += '_FiltreRecherche'
  }
  if (colonnes) params.set('fields', colonnes)

  const res = await fetch(`${API}/visitors/export?${params}`, {
    headers: authHeaders()
  })

  if (!res.ok) return alert("Erreur lors de l'export")

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url

  const date = new Date().toISOString().split('T')[0]
  lien.download = `export_${date}${details || '_complet'}.csv`

  lien.click()
}

  function handleLogin(tok: string) {
    storeToken(tok)
    setToken(tok)
    setAuthed(true)
  }

  function handleDeconnexion() {
    clearToken()
    setToken('')
    setAuthed(false)
  }

  if (!authed) return <LoginForm onLogin={handleLogin} />

  const totalPages = Math.ceil(total / LIMITE)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-xs text-gray-400">IUT Montreuil — Journée Portes Ouvertes</p>
        </div>
        <button onClick={handleDeconnexion} className="text-sm text-gray-400 hover:text-gray-600 transition">
          Déconnexion
        </button>
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
        {erreur && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded-lg p-3">
            {erreur}
          </div>
        )}

        {tab === 'stats' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total visiteurs" value={stats?.total_visitors ?? '—'} />
              <StatCard label="Départements" value={stats?.by_department.length ?? '—'} />
              <StatCard label="Types de bac" value={stats?.by_bac_type.length ?? '—'} />
              <StatCard label="Réorientations" value={visiteurs.filter((v) => v.reorientation).length} />
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
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <input type="text" placeholder="Rechercher par nom ou email…"
                value={recherche} onChange={(e) => setRecherche(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[180px]" />
              <select value={filtreDep} onChange={(e) => { setfiltreDep(e.target.value); setPage(1) }}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48">
                <option value="">Tous les départements</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select value={filtreBac} onChange={(e) => { setFiltreBac(e.target.value); setPage(1) }}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-40">
                <option value="">Tous les bacs</option>
                {BAC_TYPES.map((b) => <option key={b}>{b}</option>)}
              </select>
              <select value={filtreReo} onChange={(e) => { setfiltreReo(e.target.value); setPage(1) }}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44">
                <option value="">Tous les profils</option>
                <option value="true">Réorientation</option>
                <option value="false">Lycéen</option>
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
                    ) : visiteurs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                          Aucun visiteur trouvé.
                        </td>
                      </tr>
                    ) : (
                      visiteurs.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50">
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
              <button onClick={() => handleExport()}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition">
                Export complet (CSV)
              </button>
              <button onClick={() => handleExport('first_name,last_name,email')}
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
