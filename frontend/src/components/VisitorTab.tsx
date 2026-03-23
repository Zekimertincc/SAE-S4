import { useState } from 'react'
import type { Visitor } from '../api/api'
import { getExportUrl } from '../api/api'

const DEPARTMENTS = ['Informatique', 'GACO', 'INFOCOM', 'QLIO']

interface Props {
  visitors: Visitor[]
  total: number
  page: number
  limit: number
  loading: boolean
  deptFilter: string
  onDeptFilterChange: (dept: string) => void
  onPageChange: (page: number) => void
  onRefresh: () => void
}

export default function VisitorsTab({
  visitors,
  total,
  page,
  limit,
  loading,
  deptFilter,
  onDeptFilterChange,
  onPageChange,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState('')
  const totalPages = Math.ceil(total / limit)

  // Filtration par nom/email (la pagination vient du backend)
  const filtered = visitors.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      v.first_name.toLowerCase().includes(q) ||
      v.last_name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-4">

      {/* recherhe truc */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <select
          value={deptFilter}
          onChange={(e) => { onDeptFilterChange(e.target.value); onPageChange(1) }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48"
        >
          <option value="">Tous les départements</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="border rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          {loading ? '…' : 'Actualiser'}
        </button>
      </div>

      {/* tablo */}
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
                // bura temel iskeleti
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
                        v.reorientation
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
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
            <span className="text-gray-400">
              Page {page} / {totalPages} — {total} visiteurs
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >←</button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >→</button>
            </div>
          </div>
        )}
      </div>

      {/* export buton */}
      <div className="flex gap-3">
        <a
          href={getExportUrl()}
          download="visiteurs.csv"
          className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition"
        >
          Export complet (CSV)
        </a>
        <a
          href={getExportUrl('first_name,last_name,email')}
          download="emails.csv"
          className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition"
        >
          Liste e-mails (CSV)
        </a>
      </div>

    </div>
  )
}