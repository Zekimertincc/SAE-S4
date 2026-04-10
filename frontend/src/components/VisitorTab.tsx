import { useState } from 'react'
import type { Visitor } from '../api/api'
import { getToken, updateVisitor, deleteVisitor, deleteAllVisitors, BAC_TYPES, DEPARTMENTS } from '../api/api'
import { C, font, inputStyle, labelStyle, btnPrimary, btnSecondary, btnDanger, card } from '../theme'

interface Props {
  visitors: Visitor[]; total: number; page: number; limit: number; loading: boolean
  deptFilter: string; bacFilter: string; reoFilter: string; immersionFilter: string
  dossierFilter: string; dateFilter: string; searchFilter: string
  onDeptFilterChange: (v: string) => void; onBacFilterChange: (v: string) => void
  onReoFilterChange: (v: string) => void; onImmersionFilterChange: (v: string) => void
  onDossierFilterChange: (v: string) => void; onDateFilterChange: (v: string) => void
  onSearchChange: (v: string) => void; onPageChange: (p: number) => void; onRefresh: () => void
}

interface EditForm {
  first_name: string; last_name: string; email: string
  bac_type: string; department: string; ine: string
  reorientation: boolean; immersion: boolean; dossier_particulier: boolean
}

function FilterInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle(), fontSize: '13px', padding: '9px 12px', minWidth: 0 }}
      onFocus={e => { e.currentTarget.style.borderColor = C.bordeaux; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.bordeauxLight}` }}
      onBlur={e  => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.boxShadow = 'none' }}
    />
  )
}

function FilterSelect({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle(), fontSize: '13px', padding: '9px 12px', minWidth: 0, cursor: 'pointer' }}
      onFocus={e => { e.currentTarget.style.borderColor = C.bordeaux; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.bordeauxLight}` }}
      onBlur={e  => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.boxShadow = 'none' }}
    >
      {children}
    </select>
  )
}

function ModalInput({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle(), fontSize: '13px' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.bordeaux; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.bordeauxLight}` }}
        onBlur={e  => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.boxShadow = 'none' }}
      />
    </div>
  )
}

function ModalSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle(), fontSize: '13px', cursor: 'pointer' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.bordeaux; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.bordeauxLight}` }}
        onBlur={e  => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.boxShadow = 'none' }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function VisitorsTab({
  visitors, total, page, limit, loading,
  deptFilter, bacFilter, reoFilter, immersionFilter, dossierFilter, dateFilter, searchFilter,
  onDeptFilterChange, onBacFilterChange, onReoFilterChange, onImmersionFilterChange,
  onDossierFilterChange, onDateFilterChange, onSearchChange, onPageChange, onRefresh,
}: Props) {
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  const [editForm,       setEditForm]       = useState<EditForm | null>(null)
  const [saving,         setSaving]         = useState(false)
  const [deletingId,     setDeletingId]     = useState<string | null>(null)
  const [showDeleteAll,  setShowDeleteAll]  = useState(false)
  const [deletingAll,    setDeletingAll]    = useState(false)

  const totalPages = Math.ceil(total / limit)

  function openEdit(v: Visitor) {
    setEditingVisitor(v)
    setEditForm({ first_name: v.first_name, last_name: v.last_name, email: v.email, bac_type: v.bac_type, department: v.department, ine: v.ine ?? '', reorientation: v.reorientation, immersion: v.immersion, dossier_particulier: v.dossier_particulier })
  }
  function closeEdit() { setEditingVisitor(null); setEditForm(null) }

  async function handleSave() {
    if (!editingVisitor || !editForm) return
    setSaving(true)
    try { await updateVisitor(editingVisitor.id, { ...editForm, ine: editForm.ine || null }); closeEdit(); onRefresh() }
    catch { alert('Erreur lors de la sauvegarde.') }
    finally { setSaving(false) }
  }

  async function handleDelete(v: Visitor) {
    if (!confirm(`Supprimer ${v.first_name} ${v.last_name} ?`)) return
    setDeletingId(v.id)
    try { await deleteVisitor(v.id); onRefresh() }
    catch { alert('Erreur lors de la suppression.') }
    finally { setDeletingId(null) }
  }

  async function handleDeleteAll() {
    setDeletingAll(true)
    try { await deleteAllVisitors(); setShowDeleteAll(false); onRefresh() }
    catch { alert('Erreur lors de la suppression.') }
    finally { setDeletingAll(false) }
  }

  async function handleExport(filename: string, fields?: string) {
    const token = getToken()
    if (!token) return
    const params = new URLSearchParams({ token })
    if (fields)            params.set('fields', fields)
    if (deptFilter)        params.set('department', deptFilter)
    if (bacFilter)         params.set('bac_type', bacFilter)
    if (reoFilter)         params.set('reorientation', reoFilter)
    if (immersionFilter)   params.set('immersion', immersionFilter)
    if (dossierFilter)     params.set('dossier_particulier', dossierFilter)
    if (dateFilter)        params.set('date', dateFilter)
    if (searchFilter)      params.set('search', searchFilter)

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/visitors/export?${params}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de l\'export.')
    }
  }


  const th: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '11px 14px', fontSize: '13px', color: C.anthracite, verticalAlign: 'middle' }
  const actionBtn = (color: string): React.CSSProperties => ({ background: 'none', border: 'none', fontSize: '12px', fontWeight: 700, color, cursor: 'pointer', fontFamily: font, padding: '3px 0' })
  const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }
  const modal: React.CSSProperties = { background: C.white, borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', width: '100%', maxWidth: '440px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: font }
  const exportBtn: React.CSSProperties = { ...btnSecondary, fontSize: '13px', padding: '9px 16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: font }}>
      <style>{`
        .vt-filters { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; align-items: start; }
        @media (min-width: 640px)  { .vt-filters { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px)  { .vt-filters { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div className="vt-filters">
        <FilterInput value={searchFilter} onChange={v => { onSearchChange(v) }} placeholder="Nom, email ou INE…" />
        <FilterSelect value={deptFilter} onChange={v => { onDeptFilterChange(v) }}>
          <option value="">Tous les départements</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </FilterSelect>
        <FilterSelect value={bacFilter} onChange={v => { onBacFilterChange(v) }}>
          <option value="">Tous les bacs</option>
          {BAC_TYPES.map(b => <option key={b}>{b}</option>)}
        </FilterSelect>
        <FilterSelect value={reoFilter} onChange={v => { onReoFilterChange(v) }}>
          <option value="">Lycéen & Réorientation</option>
          <option value="false">Lycéen uniquement</option>
          <option value="true">Réorientation uniquement</option>
        </FilterSelect>
        <FilterSelect value={immersionFilter} onChange={v => { onImmersionFilterChange(v) }}>
          <option value="">Immersion (tous)</option>
          <option value="true">Immersion souhaitée</option>
          <option value="false">Sans immersion</option>
        </FilterSelect>
        <FilterSelect value={dossierFilter} onChange={v => { onDossierFilterChange(v) }}>
          <option value="">Dossier (tous)</option>
          <option value="true">Dossier particulier</option>
          <option value="false">Sans dossier</option>
        </FilterSelect>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <FilterInput type="date" value={dateFilter} onChange={v => { onDateFilterChange(v) }} />
          {dateFilter && (
            <button onClick={() => onDateFilterChange('')} style={{ ...actionBtn(C.gray), fontSize: '16px', flexShrink: 0 }}>✕</button>
          )}
        </div>
        <button onClick={onRefresh} disabled={loading}
          style={{ ...btnSecondary, fontSize: '13px', padding: '9px 16px', opacity: loading ? 0.5 : 1 }}>
          {loading ? '…' : '↺ Actualiser'}
        </button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.grayLight, borderBottom: `1px solid ${C.border}` }}>
                {['Nom', 'E-mail', 'Bac', 'Département', 'INE', 'Date', 'Statut', 'Actions'].map(col => (
                  <th key={col} style={th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.grayLight}` }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} style={td}>
                        <div style={{ height: '14px', background: C.grayLight, borderRadius: '4px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...td, textAlign: 'center', color: C.gray, padding: '48px 14px' }}>
                    Aucun visiteur trouvé.
                  </td>
                </tr>
              ) : visitors.map(v => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${C.grayLight}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.grayLight)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...td, fontWeight: 600 }}>{v.first_name} {v.last_name}</td>
                  <td style={{ ...td, color: C.gray }}>{v.email}</td>
                  <td style={{ ...td, color: C.gray }}>{v.bac_type}</td>
                  <td style={{ ...td, color: C.gray }}>{v.department}</td>
                  <td style={{ ...td, color: C.gray, fontFamily: 'monospace', fontSize: '12px' }}>{v.ine ?? '—'}</td>
                  <td style={{ ...td, color: C.gray, fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(v.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: '11px', fontWeight: 600,
                        padding: '3px 9px', borderRadius: '20px',
                        background: v.reorientation ? '#fef3c7' : C.saugeLight,
                        color:      v.reorientation ? '#92400e'  : C.saugeDark,
                        border: `1px solid ${v.reorientation ? '#f3e08a' : C.sauge}`,
                      }}>
                        {v.reorientation ? 'Réorientation' : 'Lycéen'}
                      </span>
                      {v.immersion && (
                        <span style={{
                          display: 'inline-block', fontSize: '11px', fontWeight: 600,
                          padding: '3px 9px', borderRadius: '20px',
                          background: '#eff6ff', color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                        }}>
                          Immersion
                        </span>
                      )}
                      {v.dossier_particulier && (
                        <span style={{
                          display: 'inline-block', fontSize: '11px', fontWeight: 600,
                          padding: '3px 9px', borderRadius: '20px',
                          background: '#fdf4ff', color: '#7e22ce',
                          border: '1px solid #e9d5ff',
                        }}>
                          Dossier particulier
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => openEdit(v)} style={actionBtn(C.bordeaux)}>Modifier</button>
                      <button onClick={() => handleDelete(v)} disabled={deletingId === v.id}
                        style={{ ...actionBtn(C.red), opacity: deletingId === v.id ? 0.4 : 1 }}>
                        {deletingId === v.id ? '…' : 'Suppr.'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${C.grayLight}` }}>
            <span style={{ fontSize: '12px', color: C.gray }}>
              Page {page} / {totalPages} — {total} visiteurs
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
                style={{ ...btnSecondary, padding: '6px 14px', fontSize: '13px', opacity: page === 1 ? 0.4 : 1 }}>←</button>
              <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
                style={{ ...btnSecondary, padding: '6px 14px', fontSize: '13px', opacity: page === totalPages ? 0.4 : 1 }}>→</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => handleExport('visiteurs.csv')} style={exportBtn}>
          ↓ Export filtré (CSV)
        </button>
        <button onClick={() => handleExport('emails.csv', 'first_name,last_name,email')} style={exportBtn}>
          ↓ Liste e-mails (CSV)
        </button>
        <button onClick={() => setShowDeleteAll(true)}
          style={{ ...btnSecondary, fontSize: '13px', padding: '9px 16px', color: C.red, borderColor: '#fecaca', marginLeft: 'auto' }}>
          Supprimer tout
        </button>
      </div>

      {showDeleteAll && (
        <div style={overlay} onClick={() => setShowDeleteAll(false)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, color: C.anthracite }}>Supprimer tous les visiteurs ?</h2>
              <p style={{ margin: 0, fontSize: '13px', color: C.gray, lineHeight: 1.6 }}>
                Cette action est <strong style={{ color: C.red }}>irréversible</strong>. Tous les visiteurs enregistrés seront définitivement supprimés.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteAll(false)} disabled={deletingAll} style={{ ...btnSecondary, width: 'auto' }}>Annuler</button>
              <button onClick={handleDeleteAll} disabled={deletingAll}
                style={{ ...btnDanger, width: 'auto', opacity: deletingAll ? 0.6 : 1 }}>
                {deletingAll ? 'Suppression…' : 'Oui, tout supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingVisitor && editForm && (
        <div style={overlay} onClick={closeEdit}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '4px', paddingBottom: '14px', borderBottom: `1px solid ${C.grayLight}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '22px', background: C.bordeaux, borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: C.anthracite }}>Modifier le visiteur</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <ModalInput label="Prénom" value={editForm.first_name} onChange={v => setEditForm({ ...editForm, first_name: v })} />
              <ModalInput label="Nom"    value={editForm.last_name}  onChange={v => setEditForm({ ...editForm, last_name:  v })} />
            </div>
            <ModalInput label="E-mail" type="email" value={editForm.email} onChange={v => setEditForm({ ...editForm, email: v })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <ModalSelect label="Type de bac"  value={editForm.bac_type}   onChange={v => setEditForm({ ...editForm, bac_type:   v })} options={BAC_TYPES} />
              <ModalSelect label="Département"  value={editForm.department} onChange={v => setEditForm({ ...editForm, department: v })} options={DEPARTMENTS} />
            </div>
            <ModalInput label="INE (optionnel)" value={editForm.ine} onChange={v => setEditForm({ ...editForm, ine: v.toUpperCase() })} />

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { key: 'reorientation' as const, label: 'Réorientation' },
                { key: 'immersion' as const, label: 'Immersion' },
                { key: 'dossier_particulier' as const, label: 'Dossier particulier' },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: C.anthracite }}>
                  <input type="checkbox" checked={editForm[key]}
                    onChange={e => setEditForm({ ...editForm, [key]: e.target.checked })}
                    style={{ accentColor: C.bordeaux, width: '15px', height: '15px' }}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
              <button onClick={closeEdit} style={{ ...btnSecondary, width: 'auto' }}>Annuler</button>
              <button onClick={handleSave} disabled={saving}
                style={{ ...btnPrimary, width: 'auto', padding: '10px 22px', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
