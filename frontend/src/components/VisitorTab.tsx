import { useState } from 'react'
import type { Visitor } from '../api/api'
import { getExportUrl, updateVisitor, deleteVisitor, BAC_TYPES, DEPARTMENTS } from '../api/api'

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

interface EditForm {
  first_name: string
  last_name: string
  email: string
  bac_type: string
  department: string
  ine: string
  reorientation: boolean
  dossier_particulier: boolean
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
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / limit)

  const filtered = visitors.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      v.first_name.toLowerCase().includes(q) ||
      v.last_name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
    )
  })

  function openEdit(v: Visitor) {
    setEditingVisitor(v)
    setEditForm({
      first_name: v.first_name,
      last_name: v.last_name,
      email: v.email,
      bac_type: v.bac_type,
      department: v.department,
      ine: v.ine ?? '',
      reorientation: v.reorientation,
      dossier_particulier: v.dossier_particulier,
    })
  }

  function closeEdit() {
    setEditingVisitor(null)
    setEditForm(null)
  }

  async function handleSave() {
    if (!editingVisitor || !editForm) return
    setSaving(true)
    try {
      await updateVisitor(editingVisitor.id, {
        ...editForm,
        ine: editForm.ine || null,
      })
      closeEdit()
      onRefresh()
    } catch {
      alert('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(v: Visitor) {
    if (!confirm(`Supprimer ${v.first_name} ${v.last_name} ?`)) return
    setDeletingId(v.id)
    try {
      await deleteVisitor(v.id)
      onRefresh()
    } catch {
      alert('Erreur lors de la suppression.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* filtres */}
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
                {['Nom', 'E-mail', 'Bac', 'Département', 'INE', 'Date', 'Statut', 'Actions'].map((col) => (
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
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
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
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          disabled={deletingId === v.id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40"
                        >
                          {deletingId === v.id ? '…' : 'Supprimer'}
                        </button>
                      </div>
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

      {/* export */}
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

      {/* edit modal */}
      {editingVisitor && editForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">Modifier le visiteur</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
                <input
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                <input
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type de bac</label>
                <select
                  value={editForm.bac_type}
                  onChange={(e) => setEditForm({ ...editForm, bac_type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BAC_TYPES.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Département</label>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">INE (optionnel)</label>
              <input
                value={editForm.ine}
                onChange={(e) => setEditForm({ ...editForm, ine: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.reorientation}
                  onChange={(e) => setEditForm({ ...editForm, reorientation: e.target.checked })}
                  className="rounded"
                />
                Réorientation
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.dossier_particulier}
                  onChange={(e) => setEditForm({ ...editForm, dossier_particulier: e.target.checked })}
                  className="rounded"
                />
                Dossier particulier
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
              >
                {saving ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
