import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { BAC_TYPES, DEPARTMENTS } from '../api/api'

const schema = z.object({
  first_name: z.string().min(2, 'Minimum 2 caractères'),
  last_name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('E-mail invalide'),
  bac_type: z.string().min(1, 'Champ requis'),
  department: z.string().min(1, 'Champ requis'),
  ine: z.string().length(11, 'Le numéro INE doit contenir exactement 11 caractères'),
  reorientation: z.boolean(),
})

type FormData = z.infer<typeof schema>
type Errors = Partial<Record<keyof FormData, string>>

const STEPS = [
  { label: 'Identité', desc: 'Vos informations personnelles' },
  { label: 'Parcours', desc: 'Votre formation et département' },
  { label: 'Consentement', desc: 'Validation RGPD' },
]


const C = {
  bordeaux:      '#A0284A',
  bordeauxDark:  '#7d1f39',
  bordeauxLight: '#f9eef2',
  sauge:         '#6AADA0',
  saugeDark:     '#4e8c80',
  saugeLight:    '#edf6f4',
  anthracite:    '#3A3A3A',
  gray:          '#6b7280',
  grayLight:     '#f4f4f4',
  border:        '#e2e2e2',
  white:         '#ffffff',
  errorBg:       '#fef2f4',
  errorBorder:   '#f5c0cb',
}


function CheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

function IUTWordmark({ inverted = false }: { inverted?: boolean }) {
  const main    = inverted ? C.white    : C.anthracite
  const accent  = inverted ? C.sauge   : C.bordeaux
  return (
    <svg width="52" height="34" viewBox="0 0 52 34" fill="none">

      <rect x="0"  y="5"  width="6" height="25" fill={main} />
      <rect x="0"  y="0"  width="6" height="5"  fill={accent} />
      <rect x="11" y="5"  width="6" height="25" fill={main} />

      <rect x="23" y="5"  width="6" height="25" fill={main} />
      <rect x="11" y="24" width="18" height="6" fill={main} />
      <rect x="34" y="5"  width="6" height="25" fill={main} />
      <rect x="34" y="5"  width="18" height="6" fill={main} />
      <rect x="46" y="5"  width="6" height="6"  fill={accent} />
    </svg>
  )
}

function fieldStyle(error?: string): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box',
    border: `1.5px solid ${error ? C.bordeaux : C.border}`,
    borderRadius: '10px', padding: '14px 16px',
    fontSize: '16px', fontFamily: "'DM Sans', sans-serif",
    color: C.anthracite, background: error ? C.errorBg : C.white,
    outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
    appearance: 'none' as const, WebkitAppearance: 'none' as const,
  }
}
const focusOn  = (err?: string) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = C.bordeaux
  e.currentTarget.style.boxShadow   = `0 0 0 3px ${C.bordeauxLight}`
}
const focusOff = (err?: string) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = err ? C.bordeaux : C.border
  e.currentTarget.style.boxShadow   = 'none'
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: C.anthracite, marginBottom: '8px', letterSpacing: '0.02em',
}
const errTxt: React.CSSProperties  = { fontSize: '12px', color: C.bordeaux, marginTop: '6px' }
const hintTxt: React.CSSProperties = { fontSize: '12px', color: C.gray,     marginTop: '6px' }

const btnPrimary: React.CSSProperties = {
  background: C.bordeaux, color: C.white, border: 'none',
  borderRadius: '12px', padding: '16px 28px', fontSize: '16px',
  fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
  cursor: 'pointer', minHeight: '52px',
}
const btnSecondary: React.CSSProperties = {
  background: C.white, color: C.gray, border: `1.5px solid ${C.border}`,
  borderRadius: '12px', padding: '14px 24px', fontSize: '15px',
  fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
  cursor: 'pointer', minHeight: '52px',
}

function RgpdModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        background: C.white, borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '640px',
        padding: '20px 24px 36px',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}>
        <div style={{ width: '40px', height: '4px', background: C.border, borderRadius: '2px', margin: '0 auto 4px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.anthracite, margin: 0 }}>
          Données personnelles
        </h2>
        <div style={{ fontSize: '14px', color: C.gray, lineHeight: 1.7, overflowY: 'auto', maxHeight: '42vh' }}>
          <p style={{ marginBottom: 10 }}>Vos données sont collectées dans le cadre de la <strong style={{ color: C.anthracite }}>Journée Portes Ouvertes de l'IUT de Montreuil</strong>.</p>
          <p style={{ marginBottom: 10 }}>Elles servent au suivi des visiteurs et à la communication post-JPO (formations, propositions d'immersion).</p>
          <p style={{ marginBottom: 10 }}>Accessibles <strong style={{ color: C.anthracite }}>uniquement aux gestionnaires autorisés</strong> de l'IUT — non transmises à des tiers.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: C.anthracite }}>Supprimées après 120 jours</strong>, conformément à la période Parcoursup.</p>
          <p>Droits d'accès et de rectification via l'administration de l'IUT.</p>
        </div>
        <button onClick={onAccept} style={{ ...btnPrimary, width: '100%', padding: '16px' }}>J'accepte</button>
        <button onClick={onClose}  style={{ ...btnSecondary, width: '100%', padding: '14px' }}>Fermer</button>
      </div>
    </div>
  )
}

function StepperBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, transition: 'all 0.2s',
              background: i <= current ? C.bordeaux : C.grayLight,
              color:      i <= current ? C.white    : C.gray,
              boxShadow:  i === current ? `0 0 0 5px ${C.bordeauxLight}` : 'none',
            }}>
              {i < current ? <CheckIcon size={16} color="white" /> : i + 1}
            </div>
            <span style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
              color: i === current ? C.bordeaux : i < current ? C.gray : '#bbb',
            }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: '2px', margin: '0 6px', marginBottom: '20px',
              background: i < current ? C.bordeaux : C.border, transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function VisitorForm() {
  const navigate = useNavigate()
  const [step, setStep]               = useState(0)
  const [form, setForm]               = useState<FormData>({
    first_name: '', last_name: '', email: '',
    bac_type: '', department: '', ine: '', reorientation: false,
  })
  const [errors, setErrors]           = useState<Errors>({})
  const [loading, setLoading]         = useState(false)
  const [apiError, setApiError]       = useState('')
  const [showRgpd, setShowRgpd]       = useState(false)
  const [rgpdConsent, setRgpdConsent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm(p => ({ ...p, [name]: val }))
    setErrors(p => ({ ...p, [name]: undefined }))
  }

  function validateStep0() {
    const r = schema.pick({ first_name: true, last_name: true, email: true, ine: true }).safeParse(form)
    if (!r.success) {
      const e: Errors = {}
      r.error.issues.forEach(i => { const k = i.path[0] as keyof FormData; if (!e[k]) e[k] = i.message })
      setErrors(e); return false
    }
    return true
  }
  function validateStep1() {
    const r = schema.pick({ bac_type: true, department: true }).safeParse(form)
    if (!r.success) {
      const e: Errors = {}
      r.error.issues.forEach(i => { const k = i.path[0] as keyof FormData; if (!e[k]) e[k] = i.message })
      setErrors(e); return false
    }
    return true
  }

  function nextStep() {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setApiError('')
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rgpd_consent: true }),
      })
      if (!res.ok) throw new Error()
      const visitor = await res.json()
      navigate('/confirmation', { state: { visitor } })
    } catch {
      setApiError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
      {showRgpd && (
        <RgpdModal
          onAccept={() => { setRgpdConsent(true); setShowRgpd(false) }}
          onClose={() => setShowRgpd(false)}
        />
      )}

      <div style={{ minHeight: '100vh', background: C.grayLight, fontFamily: "'DM Sans', sans-serif", color: C.anthracite, display: 'flex', flexDirection: 'column' }}>

        <header style={{ background: C.anthracite, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <IUTWordmark inverted />
            <div style={{ borderLeft: `1px solid rgba(255,255,255,0.15)`, paddingLeft: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.white, letterSpacing: '0.07em', textTransform: 'uppercase' }}>IUT de Montreuil</div>
              <div style={{ fontSize: '11px', color: C.sauge, letterSpacing: '0.04em', marginTop: '1px' }}>Université Paris 8</div>
            </div>
          </div>
          <div style={{ background: C.bordeaux, color: C.white, fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 11px', borderRadius: '6px', flexShrink: 0 }}>
            JPO 2025
          </div>
        </header>

        <div style={{ background: C.bordeaux, padding: '18px 20px 16px', position: 'relative', overflow: 'hidden' }}>
          {/* Accent géométrique inspiré de la charte */}
          <div style={{ position: 'absolute', right: '-10px', top: '-20px', width: '80px', height: '120px', background: 'rgba(255,255,255,0.07)', transform: 'skewX(-15deg)' }} />
          <div style={{ position: 'absolute', right: '50px', top: '-10px', width: '40px', height: '120px', background: 'rgba(255,255,255,0.05)', transform: 'skewX(-15deg)' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: C.white, margin: 0, letterSpacing: '-0.01em', position: 'relative' }}>
            Journée Portes Ouvertes
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '3px 0 0', position: 'relative' }}>
            Formulaire d'inscription visiteur
          </p>
        </div>

        <div style={{ flex: 1, padding: '24px 16px 40px', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

          <StepperBar current={step} />

          <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>

            <div style={{ marginBottom: '22px', paddingBottom: '16px', borderBottom: `1px solid ${C.grayLight}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '24px', background: C.bordeaux, borderRadius: '2px', flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: C.anthracite, margin: 0 }}>{STEPS[step].label}</h2>
                <p  style={{ fontSize: '13px', color: C.gray, margin: '2px 0 0' }}>{STEPS[step].desc}</p>
              </div>
            </div>

            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Prénom *</label>
                    <input name="first_name" value={form.first_name} onChange={handleChange}
                      placeholder="Marie" autoComplete="given-name"
                      style={fieldStyle(errors.first_name)}
                      onFocus={focusOn(errors.first_name)} onBlur={focusOff(errors.first_name)} />
                    {errors.first_name && <p style={errTxt}>{errors.first_name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input name="last_name" value={form.last_name} onChange={handleChange}
                      placeholder="Dupont" autoComplete="family-name"
                      style={fieldStyle(errors.last_name)}
                      onFocus={focusOn(errors.last_name)} onBlur={focusOff(errors.last_name)} />
                    {errors.last_name && <p style={errTxt}>{errors.last_name}</p>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>E-mail *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="marie@exemple.fr" autoComplete="email" inputMode="email"
                    style={fieldStyle(errors.email)}
                    onFocus={focusOn(errors.email)} onBlur={focusOff(errors.email)} />
                  {errors.email && <p style={errTxt}>{errors.email}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Numéro INE *</label>
                  <input name="ine" value={form.ine} onChange={handleChange}
                    placeholder="123456789A" maxLength={11} autoComplete="off"
                    style={fieldStyle(errors.ine)}
                    onFocus={focusOn(errors.ine)} onBlur={focusOff(errors.ine)} />
                  {errors.ine ? <p style={errTxt}>{errors.ine}</p> : <p style={hintTxt}>11 caractères (ex : 123456789A)</p>}
                </div>

                <button onClick={nextStep} style={{ ...btnPrimary, width: '100%', marginTop: '4px' }}>
                  Continuer →
                </button>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Bac préparé *</label>
                  <select name="bac_type" value={form.bac_type} onChange={handleChange}
                    style={fieldStyle(errors.bac_type)}
                    onFocus={focusOn(errors.bac_type)} onBlur={focusOff(errors.bac_type)}>
                    <option value="">Sélectionner…</option>
                    {BAC_TYPES.map(b => <option key={b}>{b}</option>)}
                  </select>
                  {errors.bac_type && <p style={errTxt}>{errors.bac_type}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Département visité *</label>
                  <select name="department" value={form.department} onChange={handleChange}
                    style={fieldStyle(errors.department)}
                    onFocus={focusOn(errors.department)} onBlur={focusOff(errors.department)}>
                    <option value="">Sélectionner…</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {errors.department && <p style={errTxt}>{errors.department}</p>}
                </div>

                <button type="button"
                  onClick={() => setForm(p => ({ ...p, reorientation: !p.reorientation }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: `2px solid ${form.reorientation ? C.sauge : C.border}`,
                    background: form.reorientation ? C.saugeLight : C.white,
                    transition: 'all 0.15s', width: '100%', textAlign: 'left',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    border: `2px solid ${form.reorientation ? C.sauge : C.border}`,
                    background: form.reorientation ? C.sauge : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {form.reorientation && <CheckIcon size={13} color="white" />}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: form.reorientation ? C.saugeDark : C.anthracite }}>
                    Je suis en cours de réorientation
                  </span>
                </button>

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button onClick={() => setStep(0)} style={{ ...btnSecondary, flex: 1 }}>← Retour</button>
                  <button onClick={nextStep}         style={{ ...btnPrimary,   flex: 2 }}>Continuer →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: C.grayLight, borderRadius: '10px', padding: '14px 16px', fontSize: '14px', color: C.gray, lineHeight: 1.7 }}>
                  Vos données sont collectées pour la JPO de l'IUT de Montreuil et supprimées après 120 jours.
                  En continuant, vous en autorisez le traitement par les gestionnaires autorisés.
                </div>

                {rgpdConsent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: `2px solid ${C.sauge}`, background: C.saugeLight }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: C.sauge, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckIcon size={14} color="white" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: C.saugeDark }}>Consentement RGPD accepté</span>
                    <button onClick={() => setRgpdConsent(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '12px', color: C.saugeDark, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", padding: '4px' }}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowRgpd(true)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', border: `2px dashed ${C.border}`, background: C.grayLight, width: '100%', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span style={{ fontSize: '14px', color: C.gray }}>
                      Lire et accepter les conditions RGPD <span style={{ color: C.bordeaux }}>*</span>
                    </span>
                  </button>
                )}

                {apiError && (
                  <div style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: C.bordeaux }}>
                    {apiError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button onClick={() => setStep(1)} style={{ ...btnSecondary, flex: 1 }}>← Retour</button>
                  <button onClick={handleSubmit} disabled={loading || !rgpdConsent}
                    style={{ ...btnPrimary, flex: 2, opacity: loading || !rgpdConsent ? 0.45 : 1, cursor: loading || !rgpdConsent ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Envoi…' : 'Valider mon inscription'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '20px' }}>
            Personnel IUT ?{' '}
            <a href="/admin" style={{ color: C.sauge, textDecoration: 'none' }}>Tableau de bord →</a>
          </p>
        </div>
      </div>
    </>
  )
}