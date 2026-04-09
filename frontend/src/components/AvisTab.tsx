import { useState, useEffect } from 'react'
import type { Visitor } from '../api/api'
import { getAllAvis } from '../api/api'
import { C, font, card } from '../theme'

const LABELS = ['', 'Insuffisant', 'Passable', 'Bien', 'Très bien', 'Excellent']

function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= n ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

export default function AvisTab() {
  const [avis,    setAvis]    = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getAllAvis()
      .then(setAvis)
      .catch(() => setError('Impossible de charger les avis.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0', fontFamily: font, color: C.gray }}>
        Chargement des avis…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#dc2626', fontFamily: font }}>
        {error}
      </div>
    )
  }

  if (avis.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', color: C.gray, fontFamily: font, gap: '12px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <p style={{ margin: 0, fontSize: '14px' }}>Aucun avis reçu pour l'instant.</p>
      </div>
    )
  }

  const avg    = avis.reduce((s, v) => s + (v.rating ?? 0), 0) / avis.length
  const counts = [1, 2, 3, 4, 5].map(n => ({ note: n, count: avis.filter(v => v.rating === n).length }))
  const max    = Math.max(...counts.map(c => c.count), 1)
  const avecCommentaire = avis.filter(v => v.comment)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: font }}>
      <style>{`
        .avis-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 700px) { .avis-grid { grid-template-columns: 260px 1fr; } }
      `}</style>

      <div className="avis-grid">

        <div style={{ ...card, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div style={{ fontSize: '56px', fontWeight: 800, color: C.anthracite, lineHeight: 1 }}>
            {avg.toFixed(1)}
          </div>
          <Stars n={Math.round(avg)} size={22} />
          <div style={{ fontSize: '13px', color: C.gray, marginTop: '4px', textAlign: 'center' }}>
            {avis.length} avis{avecCommentaire.length > 0 && ` · ${avecCommentaire.length} avec commentaire`}
          </div>
        </div>

        <div style={{ ...card, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
          {[5, 4, 3, 2, 1].map(n => {
            const c   = counts.find(x => x.note === n)!
            const pct = Math.round((c.count / max) * 100)
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.anthracite, width: '8px', flexShrink: 0 }}>{n}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none" style={{ flexShrink: 0 }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div style={{ flex: 1, height: '10px', background: '#f1f1f1', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '5px', minWidth: c.count > 0 ? '10px' : '0' }} />
                </div>
                <span style={{ fontSize: '12px', color: C.gray, width: '24px', textAlign: 'right', flexShrink: 0 }}>{c.count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {avecCommentaire.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '3px', height: '18px', background: C.bordeaux, borderRadius: '2px' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: C.anthracite }}>
              Commentaires ({avecCommentaire.length})
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {avecCommentaire.map(v => (
              <div key={v.id} style={{ ...card, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: C.bordeauxLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: C.bordeaux, flexShrink: 0 }}>
                      {v.first_name[0]}{v.last_name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: C.anthracite }}>{v.first_name} {v.last_name}</div>
                      <div style={{ fontSize: '11px', color: C.gray }}>{v.department} · {new Date(v.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <Stars n={v.rating!} />
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>{LABELS[v.rating!]}</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: C.anthracite, lineHeight: 1.65, fontStyle: 'italic' }}>
                  "{v.comment}"
                </p>

                {v.heard_from && (
                  <div style={{ marginTop: '10px', fontSize: '11px', color: C.gray, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    A entendu parler via : <strong style={{ color: C.anthracite, marginLeft: '2px' }}>{v.heard_from}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {avis.filter(v => !v.comment).length > 0 && (
        <p style={{ margin: 0, fontSize: '12px', color: C.gray, textAlign: 'center' }}>
          + {avis.filter(v => !v.comment).length} avis sans commentaire
        </p>
      )}
    </div>
  )
}
