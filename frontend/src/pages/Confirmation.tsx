import { useLocation, useNavigate } from 'react-router-dom'

interface Visitor {
  first_name: string
  last_name:  string
  email:      string
  bac_type:   string
  department: string
  ine?:       string
  reorientation: boolean
  immersion?:    boolean
  dossier_particulier?: boolean
  specialite_1?: string
  specialite_2?: string
  etablissement?: string
  ville?:         string
  created_at?: string
}

interface Feedback {
  note:      number
  comment?:  string
  heard_from?: string
}

const C = {
  bordeaux:      '#A0284A',
  bordeauxLight: '#f9eef2',
  sauge:         '#6AADA0',
  saugeDark:     '#4e8c80',
  saugeLight:    '#edf6f4',
  anthracite:    '#3A3A3A',
  gray:          '#6b7280',
  grayLight:     '#f4f4f4',
  border:        '#e2e2e2',
  white:         '#ffffff',
}


function CheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? '#f59e0b' : 'none'}
      stroke={filled ? '#f59e0b' : C.border}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IUTWordmark({ inverted = false }: { inverted?: boolean }) {
  const main   = inverted ? C.white : C.anthracite
  const accent = inverted ? C.sauge : C.bordeaux
  return (
    <svg width="52" height="34" viewBox="0 0 52 34" fill="none">
      <rect x="0"  y="5"  width="6" height="25" fill={main} />
      <rect x="0"  y="0"  width="6" height="5"  fill={accent} />
      <rect x="11" y="5"  width="6" height="25" fill={main} />
      <rect x="23" y="5"  width="6" height="25" fill={main} />
      <rect x="11" y="24" width="18" height="6"  fill={main} />
      <rect x="34" y="5"  width="6" height="25" fill={main} />
      <rect x="34" y="5"  width="18" height="6"  fill={main} />
      <rect x="46" y="5"  width="6" height="6"   fill={accent} />
    </svg>
  )
}


export default function Confirmation() {
  const { state } = useLocation() as { state: { visitor?: Visitor; feedback?: Feedback } }
  const navigate  = useNavigate()
  const visitor   = state?.visitor
  const feedback  = state?.feedback

  const registrationDate = visitor?.created_at
    ? new Date(visitor.created_at)
    : new Date()

  const dateStr = registrationDate.toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
  const timeStr = registrationDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  })

  const btnPrimary: React.CSSProperties = {
    background: C.bordeaux, color: C.white, border: 'none',
    borderRadius: '10px', padding: '12px 20px', fontSize: '14px',
    fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer', flex: 1,
  }
  const btnSecondary: React.CSSProperties = {
    background: C.white, color: C.gray, border: `1.5px solid ${C.border}`,
    borderRadius: '10px', padding: '12px 20px', fontSize: '14px',
    fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer', flex: 1,
  }

  const page = (content: React.ReactNode) => (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; } body { margin: 0; }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .confirmation-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            border-radius: 8px !important;
            max-width: 100% !important;
          }
        }
        .print-only { display: none; }
      `}</style>
      <div style={{
        minHeight: '100vh', background: C.white,
        fontFamily: "'DM Sans', sans-serif", color: C.anthracite,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {content}
        </div>
      </div>
    </>
  )

  if (!visitor) {
    return page(
      <div style={{
        borderRadius: '20px', border: `1px solid ${C.border}`,
        boxShadow: '0 4px 28px rgba(0,0,0,0.09)', overflow: 'hidden',
      }}>
        <div style={{ background: C.bordeaux, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <IUTWordmark inverted />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: C.white }}>Journée Portes Ouvertes</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>IUT de Montreuil · Université Paris 8</div>
          </div>
        </div>
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ color: C.gray, marginBottom: '20px', fontSize: '15px' }}>Aucune donnée trouvée.</p>
          <button onClick={() => navigate('/')} style={{ ...btnPrimary, flex: 'unset', padding: '12px 28px' }}>
            Retour au formulaire
          </button>
        </div>
      </div>
    )
  }

  const recapRows: [string, string][] = [
    ['Nom',         `${visitor.first_name} ${visitor.last_name}`],
    ['E-mail',      visitor.email],
    ['Bac',         visitor.bac_type],
    ...(visitor.specialite_1 ? [['Spécialité', [visitor.specialite_1, visitor.specialite_2].filter(Boolean).join(', ')] as [string, string]] : []),
    ['Département', visitor.department],
    ...(visitor.ine         ? [['INE', visitor.ine] as [string, string]] : []),
    ...(visitor.etablissement ? [['Lycée', [visitor.etablissement, visitor.ville].filter(Boolean).join(' — ')] as [string, string]] : []),
    ['Date',        dateStr],
    ['Heure',       timeStr],
  ]

  const badges: { label: string; active: boolean }[] = [
    { label: 'Réorientation',      active: visitor.reorientation },
    { label: 'Immersion souhaitée',active: !!visitor.immersion },
    { label: 'Dossier particulier',active: !!visitor.dossier_particulier },
  ]

  // ── Rendu principal ───────────────────────────────────

  return page(
    <div className="confirmation-card" style={{
      borderRadius: '20px', border: `1px solid ${C.border}`,
      boxShadow: '0 4px 28px rgba(0,0,0,0.09)', overflow: 'hidden', background: C.white,
    }}>

      <div style={{ background: C.bordeaux, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-8px', top: '-16px', width: '70px', height: '90px', background: 'rgba(255,255,255,0.07)', transform: 'skewX(-15deg)' }} />
        <div style={{ position: 'absolute', right: '48px', top: '-8px', width: '35px', height: '90px', background: 'rgba(255,255,255,0.05)', transform: 'skewX(-15deg)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          <IUTWordmark inverted />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: C.white, letterSpacing: '-0.01em' }}>Journée Portes Ouvertes</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>IUT de Montreuil · Université Paris 8</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '22px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '54px', height: '54px', borderRadius: '50%',
            background: C.saugeLight, border: `2px solid ${C.sauge}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <CheckIcon size={26} color={C.sauge} />
          </div>
          <h1 style={{ fontSize: '19px', fontWeight: 800, color: C.anthracite, margin: '0 0 4px' }}>
            Inscription confirmée !
          </h1>
          <p style={{ fontSize: '13px', color: C.gray, margin: 0 }}>
            Vos informations ont bien été enregistrées.
          </p>
        </div>

        <div style={{ background: C.grayLight, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 700, color: C.gray, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Récapitulatif
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recapRows.map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
                <span style={{ color: C.gray, flexShrink: 0 }}>{label}</span>
                <span style={{ fontWeight: 600, color: C.anthracite, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
              </div>
            ))}
          </div>
          {badges.some(b => b.active) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
              {badges.filter(b => b.active).map(b => (
                <span key={b.label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: C.saugeLight, border: `1px solid ${C.sauge}`,
                  color: C.saugeDark, fontSize: '11px', fontWeight: 600,
                  padding: '4px 10px', borderRadius: '20px',
                }}>
                  <CheckIcon size={11} color={C.saugeDark} />
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
        {feedback && feedback.note > 0 && (
          <div style={{ background: '#fffbea', border: '1px solid #f3e08a', borderRadius: '12px', padding: '12px 16px', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: '#92400e', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Votre avis
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: feedback.comment ? '8px' : 0 }}>
              {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= feedback.note} />)}
              <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, marginLeft: '4px' }}>
                {['','Insuffisant','Passable','Bien','Très bien','Excellent !'][feedback.note]}
              </span>
            </div>
            {feedback.comment && (
              <p style={{ margin: 0, fontSize: '13px', color: '#78350f', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{feedback.comment}"
              </p>
            )}
          </div>
        )}
        <div style={{
          background: C.bordeauxLight, borderRadius: '10px',
          padding: '11px 14px', marginBottom: '18px',
          display: 'flex', gap: '10px', alignItems: 'flex-start',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p style={{ margin: 0, fontSize: '12px', color: C.bordeaux, lineHeight: 1.6 }}>
            Vos données sont conservées par l'IUT de Montreuil et <strong>supprimées automatiquement après 120 jours</strong>, conformément à votre consentement RGPD.
          </p>
        </div>

        {/* Justificatif — visible à l'écran et à l'impression */}
        <div style={{
          border: `1.5px dashed ${C.border}`, borderRadius: '10px',
          padding: '12px 16px', marginBottom: '18px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: C.gray, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Justificatif de présence
            </p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: C.anthracite }}>
              {dateStr}
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: C.gray }}>
              {timeStr} — JPO IUT de Montreuil
            </p>
          </div>
        </div>

        {/* Mention visible uniquement à l'impression */}
        <div className="print-only" style={{
          borderTop: `1px solid ${C.border}`, paddingTop: '10px',
          marginTop: '4px', fontSize: '11px', color: C.gray, lineHeight: 1.6,
        }}>
          Document généré automatiquement lors de l'inscription à la Journée Portes Ouvertes
          de l'IUT de Montreuil — Université Paris 8. Ce document atteste de la présence
          de <strong>{visitor.first_name} {visitor.last_name}</strong> le {dateStr} à {timeStr}.
        </div>

        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/')} style={btnSecondary}>
            Nouveau visiteur
          </button>
          <button onClick={() => window.print()} style={btnPrimary}>
            Imprimer
          </button>
        </div>

      </div>
    </div>
  )
}
