import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { BAC_TYPES, DEPARTMENTS } from '../api/api'


const SPECIALITES_GENERAL = [
  'Mathématiques', 'NSI', 'Physique-Chimie', 'SVT', 'SES',
  'HGGSP', 'LLCER', 'AMC', 'Arts plastiques', 'HLP',
  'Musique', 'Théâtre', 'EPS', 'Autre',
]

type SpecConfig =
  | { kind: 'none' }
  | { kind: 'double'; options: string[] }
  | { kind: 'single'; label: string; options: string[] }
  | { kind: 'text';   label: string }

const SPEC_CONFIG: Record<string, SpecConfig> = {
  'Général': { kind: 'double', options: SPECIALITES_GENERAL },
  'STI2D': {
    kind: 'single', label: 'Spécialité STI2D',
    options: [
      "SIN — Systèmes d'Information et Numérique",
      'ITEC — Innovation Technologique et Éco-Conception',
      'EE — Énergie et Environnement',
      'AC — Architecture et Construction',
    ],
  },
  'STL': {
    kind: 'single', label: 'Spécialité STL',
    options: ['Biotechnologies', 'Sciences Physiques et Chimiques en Laboratoire'],
  },
  'STMG': {
    kind: 'single', label: 'Spécialité STMG',
    options: [
      'Gestion et Finance', 'Mercatique',
      'Management, Sciences de Gestion et Numérique',
      'Ressources Humaines et Communication',
      "Systèmes d'Information de Gestion",
    ],
  },
  'ST2S': { kind: 'none' },
  'PRO':   { kind: 'text', label: 'Spécialité Bac Pro' },
  'Autre': { kind: 'text', label: 'Précisez votre formation (optionnel)' },
}


const schema = z.object({
  first_name:    z.string().min(2, 'Minimum 2 caractères'),
  last_name:     z.string().min(2, 'Minimum 2 caractères'),
  email:         z.string().email('E-mail invalide'),
  bac_type:      z.string().min(1, 'Champ requis'),
  department:    z.string().min(1, 'Champ requis'),
  ine:           z.string().refine(v => v === '' || v.length === 11, { message: '11 caractères exacts (ex : 123456789AB)' }),
  reorientation:       z.boolean(),
  immersion:           z.boolean(),
  dossier_particulier: z.boolean(),
  etablissement: z.string().optional(),
  ville:         z.string().optional(),
  specialite_1:  z.string().optional(),
  specialite_2:  z.string().optional(),
})

type FormData = z.infer<typeof schema>
type Errors   = Partial<Record<keyof FormData, string>>
type Touched  = Partial<Record<keyof FormData, boolean>>

const STEPS = [
  { label: 'Identité',     desc: 'Vos informations personnelles' },
  { label: 'Parcours',     desc: 'Votre formation et département' },
  { label: 'Consentement', desc: 'Validation RGPD' },
  { label: 'Votre avis',   desc: 'Retour facultatif' },
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
  amber:         '#b45309',
  amberBg:       '#fffbea',
  amberBorder:   '#f3e08a',
}

function CheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

function StarIcon({ filled, size = 28 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
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

function fieldStyle(error?: string, valid?: boolean): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box',
    border: `1.5px solid ${error ? C.bordeaux : valid ? C.sauge : C.border}`,
    borderRadius: '9px', padding: '11px 14px',
    fontSize: '15px', fontFamily: "'DM Sans', sans-serif",
    color: C.anthracite,
    background: error ? C.errorBg : valid ? C.saugeLight : C.white,
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
    appearance: 'none' as const, WebkitAppearance: 'none' as const,
  }
}

function FieldWrap({ children, valid, error, hint }: {
  children: React.ReactNode; valid?: boolean; error?: string; hint?: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {valid && !error && (
        <span style={{
          position: 'absolute', right: '14px', top: '14px',
          display: 'flex', alignItems: 'center', pointerEvents: 'none',
        }}>
          <CheckIcon size={16} color={C.sauge} />
        </span>
      )}
      {error && <p style={{ fontSize: '12px', color: C.bordeaux, margin: '6px 0 0' }}>{error}</p>}
      {!error && hint && <p style={{ fontSize: '12px', color: C.gray, margin: '6px 0 0' }}>{hint}</p>}
    </div>
  )
}

const focusOn  = () => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = C.bordeaux
  e.currentTarget.style.boxShadow   = `0 0 0 3px ${C.bordeauxLight}`
}
const focusOff = (err?: string, valid?: boolean) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = err ? C.bordeaux : valid ? C.sauge : C.border
  e.currentTarget.style.boxShadow   = 'none'
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: C.anthracite, marginBottom: '5px', letterSpacing: '0.02em',
}
const optLabel: React.CSSProperties = { fontWeight: 400, color: C.gray, marginLeft: '4px' }

const btnPrimary: React.CSSProperties = {
  background: C.bordeaux, color: C.white, border: 'none',
  borderRadius: '10px', padding: '13px 24px', fontSize: '15px',
  fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
  cursor: 'pointer', minHeight: '46px', transition: 'opacity 0.15s',
}
const btnSecondary: React.CSSProperties = {
  background: C.white, color: C.gray, border: `1.5px solid ${C.border}`,
  borderRadius: '10px', padding: '11px 20px', fontSize: '14px',
  fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
  cursor: 'pointer', minHeight: '46px',
}

function ToggleCard({ checked, onChange, label, sublabel }: {
  checked: boolean; onChange: () => void; label: string; sublabel?: string
}) {
  return (
    <button type="button" onClick={onChange} style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
      border: `2px solid ${checked ? C.sauge : C.border}`,
      background: checked ? C.saugeLight : C.white,
      transition: 'all 0.15s', width: '100%', textAlign: 'left',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
        border: `2px solid ${checked ? C.sauge : C.border}`,
        background: checked ? C.sauge : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && <CheckIcon size={13} color="white" />}
      </div>
      <div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: checked ? C.saugeDark : C.anthracite, display: 'block' }}>
          {label}
        </span>
        {sublabel && (
          <span style={{ fontSize: '12px', color: C.gray, marginTop: '2px', display: 'block' }}>
            {sublabel}
          </span>
        )}
      </div>
    </button>
  )
}

function RgpdModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  const items = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Finalité de la collecte',
      text: "Vos données servent uniquement au suivi de votre visite à la JPO et à vous recontacter sur les formations qui vous intéressent (immersions, candidatures).",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: 'Accès strictement limité',
      text: "Seuls les gestionnaires habilités de l'IUT de Montreuil y ont accès. Vos données ne sont jamais vendues ni partagées avec des tiers.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: 'Durée de conservation',
      text: "Vos données sont automatiquement supprimées 120 jours après la JPO, en cohérence avec la clôture de la procédure Parcoursup.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      title: 'Vos droits',
      text: "Vous pouvez à tout moment accéder à vos données, les rectifier ou demander leur suppression en contactant l'administration de l'IUT.",
    },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{
        background: C.white, borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '640px',
        padding: '0 0 env(safe-area-inset-bottom,0)', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', background: C.border, borderRadius: '2px', margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: C.anthracite, margin: 0 }}>
              Protection de vos données
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: C.gray, margin: '0 0 16px' }}>
            Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679)
          </p>
          <div style={{ height: '1px', background: C.grayLight }} />
        </div>
        <div style={{ overflowY: 'auto', padding: '16px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '14px', padding: '14px',
              background: C.grayLight, borderRadius: '12px',
            }}>
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: C.anthracite }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: '13px', color: C.gray, lineHeight: 1.6 }}>{item.text}</p>
              </div>
            </div>
          ))}

          <div style={{ background: C.bordeauxLight, borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: C.bordeaux, lineHeight: 1.6 }}>
            <strong>Responsable du traitement :</strong> IUT de Montreuil, Université Paris 8 —
            {' '}Toute demande relative à vos données peut être adressée à l'administration de l'établissement.
          </div>
        </div>
        <div style={{ padding: '16px 24px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px', borderTop: `1px solid ${C.grayLight}` }}>
          <button onClick={onAccept} style={{ ...btnPrimary, width: '100%', padding: '16px' }}>
            ✓ J'accepte et je continue
          </button>
          <button onClick={onClose}  style={{ ...btnSecondary, width: '100%', padding: '14px' }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

function StepperBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, transition: 'all 0.2s',
              background: i < current ? C.sauge : i === current ? C.bordeaux : C.grayLight,
              color:      i <= current ? C.white : C.gray,
              boxShadow:  i === current ? `0 0 0 4px ${C.bordeauxLight}` : 'none',
            }}>
              {i < current ? <CheckIcon size={14} color="white" /> : i + 1}
            </div>
            <span className="stepper-label" style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
              textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
              color: i === current ? C.bordeaux : i < current ? C.sauge : '#bbb',
            }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: '2px', margin: '0 4px', marginBottom: '18px',
              background: i < current ? C.sauge : C.border, transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function SpecialitesBlock({ bacType, form, errors, touched, handleChange, handleBlur, isValid }: {
  bacType: string; form: FormData; errors: Errors; touched: Touched
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleBlur:   (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
  isValid: (f: keyof FormData) => boolean
}) {
  const cfg = SPEC_CONFIG[bacType]
  if (!cfg || cfg.kind === 'none') return null

  if (cfg.kind === 'double') return (
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      {(['specialite_1', 'specialite_2'] as const).map((field, idx) => (
        <div key={field}>
          <label style={labelStyle}>Spécialité {idx + 1}<span style={optLabel}>(optionnel)</span></label>
          <FieldWrap valid={touched[field] && isValid(field)} error={touched[field] ? errors[field] : undefined}>
            <select name={field} value={form[field] ?? ''} onChange={handleChange}
              onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors[field], isValid(field))(e) }}
              style={{ ...fieldStyle(touched[field] ? errors[field] : undefined, touched[field] && isValid(field)), paddingRight: '36px' }}>
              <option value="">Sélectionner…</option>
              {cfg.options.map(s => (
                <option key={s} value={s}
                  disabled={(field === 'specialite_2' && s === form.specialite_1) || (field === 'specialite_1' && s === form.specialite_2)}>
                  {s}
                </option>
              ))}
            </select>
          </FieldWrap>
        </div>
      ))}
    </div>
  )

  if (cfg.kind === 'single') return (
    <div>
      <label style={labelStyle}>{cfg.label} *</label>
      <FieldWrap valid={touched.specialite_1 && isValid('specialite_1')} error={touched.specialite_1 ? errors.specialite_1 : undefined}>
        <select name="specialite_1" value={form.specialite_1 ?? ''} onChange={handleChange}
          onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.specialite_1, isValid('specialite_1'))(e) }}
          style={{ ...fieldStyle(touched.specialite_1 ? errors.specialite_1 : undefined, touched.specialite_1 && isValid('specialite_1')), paddingRight: '36px' }}>
          <option value="">Sélectionner…</option>
          {cfg.options.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </FieldWrap>
    </div>
  )

  return (
    <div>
      <label style={labelStyle}>{cfg.label}</label>
      <FieldWrap valid={touched.specialite_1 && !!form.specialite_1} error={touched.specialite_1 ? errors.specialite_1 : undefined}
        hint="Ex : Systèmes Numériques, Comptabilité, Logistique…">
        <input name="specialite_1" value={form.specialite_1 ?? ''} onChange={handleChange}
          placeholder="Votre spécialité"
          onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff()(e) }}
          style={{ ...fieldStyle(), paddingRight: '36px' }} />
      </FieldWrap>
    </div>
  )
}

export default function VisitorForm() {
  const navigate = useNavigate()

  const [step, setStep]               = useState(0)
  const [form, setForm]               = useState<FormData>({
    first_name: '', last_name: '', email: '', ine: '',
    bac_type: '', department: '',
    reorientation: false, immersion: false, dossier_particulier: false,
    etablissement: '', ville: '',
    specialite_1: '', specialite_2: '',
  })
  const [errors,  setErrors]          = useState<Errors>({})
  const [touched, setTouched]         = useState<Touched>({})
  const [loading, setLoading]         = useState(false)
  const [apiError, setApiError]       = useState('')
  const [showRgpd, setShowRgpd]       = useState(false)
  const [rgpdConsent, setRgpdConsent] = useState(false)
  const [savedVisitor, setSavedVisitor] = useState<object | null>(null)

  const [starHover,      setStarHover]      = useState(0)
  const [starSelected,   setStarSelected]   = useState(0)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [heardFrom,      setHeardFrom]      = useState('')

  function validateField(field: keyof FormData, value: unknown): string | undefined {
    const partial = schema.pick({ [field]: true } as Record<keyof FormData, true>).safeParse({ [field]: value })
    return partial.success ? undefined : partial.error.issues[0]?.message
  }

  function isValid(field: keyof FormData): boolean {
    return !errors[field] && (field === 'ine' ? true : !!form[field])
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const field = name as keyof FormData
    setTouched(p => ({ ...p, [field]: true }))
    setErrors(p => ({ ...p, [field]: validateField(field, value) }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    let val: string | boolean = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    if (name === 'ine') val = (val as string).toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (name === 'bac_type') {
      setForm(p => ({ ...p, bac_type: val as string, specialite_1: '', specialite_2: '' }))
      setErrors(p => ({ ...p, bac_type: undefined, specialite_1: undefined, specialite_2: undefined }))
      setTouched(p => ({ ...p, specialite_1: false, specialite_2: false }))
      return
    }
    setForm(p => ({ ...p, [name]: val }))
    if (touched[name as keyof FormData]) {
      setErrors(p => ({ ...p, [name]: validateField(name as keyof FormData, val) }))
    } else {
      setErrors(p => ({ ...p, [name]: undefined }))
    }
  }

  function validateStep0() {
    const fields: (keyof FormData)[] = ['first_name', 'last_name', 'email']
    const r = schema.pick({ first_name: true, last_name: true, email: true }).safeParse(form)
    const newTouched: Touched = {}
    const newErrors:  Errors  = {}
    fields.forEach(f => { newTouched[f] = true })
    newTouched.ine = true
    if (form.ine && form.ine.length !== 11) {
      newErrors.ine = '11 caractères exacts (ex : 123456789AB)'
    }
    if (!r.success) {
      r.error.issues.forEach(i => {
        const k = i.path[0] as keyof FormData
        if (!newErrors[k]) newErrors[k] = i.message
      })
    }
    setTouched(p => ({ ...p, ...newTouched }))
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateStep1() {
    const r = schema.pick({ bac_type: true, department: true }).safeParse(form)
    const newTouched: Touched = { bac_type: true, department: true }
    const newErrors:  Errors  = {}
    if (!r.success) {
      r.error.issues.forEach(i => {
        const k = i.path[0] as keyof FormData
        if (!newErrors[k]) newErrors[k] = i.message
      })
    }
    setTouched(p => ({ ...p, ...newTouched }))
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
        body: JSON.stringify({ ...form, ine: form.ine || null, rgpd_consent: true }),
      })
      if (!res.ok) throw new Error()
      const visitor = await res.json()
      setSavedVisitor(visitor)
      setStep(3)
    } catch {
      setApiError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  async function goToConfirmation() {
    const feedback = starSelected > 0
      ? { rating: starSelected, comment: feedbackComment || undefined, heard_from: heardFrom || undefined }
      : null

    if (feedback && savedVisitor && (savedVisitor as { id?: string }).id) {
      try {
        await fetch(`http://127.0.0.1:5000/api/visitors/${(savedVisitor as { id: string }).id}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedback),
        })
      } catch {
      }
    }

    navigate('/confirmation', {
      state: {
        visitor: savedVisitor,
        feedback: feedback ? { note: starSelected, comment: feedbackComment, heard_from: heardFrom } : null,
      },
    })
  }

  const ineLen = form.ine.length

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .grid-name { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .grid-location { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .btn-row { display: flex; gap: 12px; }
        @media (max-width: 480px) {
          .grid-2, .grid-name, .grid-location { grid-template-columns: 1fr !important; }
          .stepper-label { display: none; }
          .btn-row { flex-direction: column-reverse; }
          .btn-row button { flex: unset !important; width: 100%; }
        }
      `}</style>

      {showRgpd && (
        <RgpdModal
          onAccept={() => { setRgpdConsent(true); setShowRgpd(false) }}
          onClose={() => setShowRgpd(false)}
        />
      )}

      <div style={{ minHeight: '100vh', background: C.white, fontFamily: "'DM Sans', sans-serif", color: C.anthracite, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          <div style={{ borderRadius: '20px', border: `1px solid ${C.border}`, boxShadow: '0 4px 28px rgba(0,0,0,0.09)', overflow: 'hidden', background: C.white }}>
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
            <div style={{ padding: '20px 22px 22px' }}>

              <StepperBar current={step} />
              {step < 4 && (
                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${C.grayLight}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '22px', background: C.bordeaux, borderRadius: '2px', flexShrink: 0 }} />
                  <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: C.anthracite, margin: 0 }}>{STEPS[step].label}</h2>
                    <p  style={{ fontSize: '12px', color: C.gray, margin: '2px 0 0' }}>{STEPS[step].desc}</p>
                  </div>
                </div>
              )}
              {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <div className="grid-name">
                  <div>
                    <label style={labelStyle}>Prénom *</label>
                    <FieldWrap valid={touched.first_name && isValid('first_name')} error={touched.first_name ? errors.first_name : undefined}>
                      <input name="first_name" value={form.first_name} onChange={handleChange}
                        placeholder="Marie" autoComplete="given-name"
                        style={{ ...fieldStyle(touched.first_name ? errors.first_name : undefined, touched.first_name && isValid('first_name')), paddingRight: '38px' }}
                        onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.first_name, isValid('first_name'))(e) }} />
                    </FieldWrap>
                  </div>
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <FieldWrap valid={touched.last_name && isValid('last_name')} error={touched.last_name ? errors.last_name : undefined}>
                      <input name="last_name" value={form.last_name} onChange={handleChange}
                        placeholder="Dupont" autoComplete="family-name"
                        style={{ ...fieldStyle(touched.last_name ? errors.last_name : undefined, touched.last_name && isValid('last_name')), paddingRight: '38px' }}
                        onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.last_name, isValid('last_name'))(e) }} />
                    </FieldWrap>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>E-mail *</label>
                  <FieldWrap valid={touched.email && isValid('email')} error={touched.email ? errors.email : undefined}>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="marie@exemple.fr" autoComplete="email" inputMode="email"
                      style={{ ...fieldStyle(touched.email ? errors.email : undefined, touched.email && isValid('email')), paddingRight: '38px' }}
                      onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.email, isValid('email'))(e) }} />
                  </FieldWrap>
                </div>

                <div>
                  <label style={labelStyle}>
                    Numéro INE
                    <span style={optLabel}>(optionnel)</span>
                  </label>
                  <FieldWrap
                    valid={touched.ine && !!form.ine && !errors.ine}
                    error={touched.ine ? errors.ine : undefined}
                    hint={form.ine ? `${ineLen}/11 caractères` : 'Inscrit sur votre relevé de notes ou votre carte lycéen'}
                  >
                    <input name="ine" value={form.ine} onChange={handleChange}
                      placeholder="123456789AB" maxLength={11} autoComplete="off"
                      inputMode="text" spellCheck={false}
                      style={{ ...fieldStyle(touched.ine ? errors.ine : undefined, touched.ine && !!form.ine && !errors.ine), paddingRight: '38px', fontFamily: "'Courier New', monospace", letterSpacing: '0.12em', fontSize: '15px' }}
                      onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.ine, !errors.ine && !!form.ine)(e) }} />
                  </FieldWrap>
                </div>

                <div className="grid-location">
                  <div>
                    <label style={labelStyle}>Lycée <span style={optLabel}>(optionnel)</span></label>
                    <FieldWrap valid={touched.etablissement && !!form.etablissement}>
                      <input name="etablissement" value={form.etablissement} onChange={handleChange}
                        placeholder="Lycée Henri IV" style={fieldStyle()}
                        onFocus={focusOn()} onBlur={(e) => { setTouched(p => ({ ...p, etablissement: true })); focusOff()(e) }} />
                    </FieldWrap>
                  </div>
                  <div>
                    <label style={labelStyle}>Ville <span style={optLabel}>(optionnel)</span></label>
                    <FieldWrap valid={touched.ville && !!form.ville}>
                      <input name="ville" value={form.ville} onChange={handleChange}
                        placeholder="Paris" style={fieldStyle()}
                        onFocus={focusOn()} onBlur={(e) => { setTouched(p => ({ ...p, ville: true })); focusOff()(e) }} />
                    </FieldWrap>
                  </div>
                </div>

                <button onClick={nextStep} style={{ ...btnPrimary, width: '100%' }}>
                  Continuer →
                </button>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <div>
                  <label style={labelStyle}>Bac préparé *</label>
                  <FieldWrap valid={touched.bac_type && isValid('bac_type')} error={touched.bac_type ? errors.bac_type : undefined}>
                    <select name="bac_type" value={form.bac_type} onChange={handleChange}
                      style={{ ...fieldStyle(touched.bac_type ? errors.bac_type : undefined, touched.bac_type && isValid('bac_type')), paddingRight: '36px' }}
                      onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.bac_type, isValid('bac_type'))(e) }}>
                      <option value="">Sélectionner…</option>
                      {BAC_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </FieldWrap>
                </div>

                {form.bac_type && (
                  <SpecialitesBlock
                    bacType={form.bac_type} form={form} errors={errors} touched={touched}
                    handleChange={handleChange} handleBlur={handleBlur} isValid={isValid}
                  />
                )}

                <div>
                  <label style={labelStyle}>Département visité *</label>
                  <FieldWrap valid={touched.department && isValid('department')} error={touched.department ? errors.department : undefined}
                    hint="Choisissez la formation qui vous intéresse">
                    <select name="department" value={form.department} onChange={handleChange}
                      style={{ ...fieldStyle(touched.department ? errors.department : undefined, touched.department && isValid('department')), paddingRight: '36px' }}
                      onFocus={focusOn()} onBlur={(e) => { handleBlur(e); focusOff(errors.department, isValid('department'))(e) }}>
                      <option value="">Sélectionner…</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </FieldWrap>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <ToggleCard
                    checked={form.reorientation}
                    onChange={() => setForm(p => ({ ...p, reorientation: !p.reorientation }))}
                    label="Je suis en cours de réorientation"
                    sublabel="Vous avez déjà commencé des études supérieures"
                  />
                  <ToggleCard
                    checked={form.immersion}
                    onChange={() => setForm(p => ({ ...p, immersion: !p.immersion }))}
                    label="Je suis intéressé(e) par une immersion"
                    sublabel="Passer une journée dans le département pour découvrir la formation"
                  />
                  <ToggleCard
                    checked={form.dossier_particulier}
                    onChange={() => setForm(p => ({ ...p, dossier_particulier: !p.dossier_particulier }))}
                    label="J'ai un dossier particulier"
                    sublabel="Situation de handicap, sportif de haut niveau, etc."
                  />
                </div>

                <div className="btn-row">
                  <button onClick={() => setStep(0)} style={{ ...btnSecondary, flex: 1 }}>← Retour</button>
                  <button onClick={nextStep}         style={{ ...btnPrimary,   flex: 2 }}>Continuer →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <div style={{ background: C.grayLight, borderRadius: '12px', padding: '16px' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 700, color: C.gray, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                    Récapitulatif de votre inscription
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', fontSize: '13px' }}>
                    {[
                      ['Nom', `${form.first_name} ${form.last_name}`],
                      ['E-mail', form.email],
                      ...(form.ine ? [['INE', form.ine]] : []),
                      ['Bac', form.bac_type],
                      ...(form.specialite_1 ? [['Spécialité', [form.specialite_1, form.specialite_2].filter(Boolean).join(', ')]] : []),
                      ['Département', form.department],
                    ].map(([k, v]) => (
                      <>
                        <span key={`k-${k}`} style={{ color: C.gray }}>{k}</span>
                        <span key={`v-${k}`} style={{ fontWeight: 600, color: C.anthracite, wordBreak: 'break-all' }}>{v}</span>
                      </>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: '13px', color: C.amber, lineHeight: 1.6 }}>
                    Vos données sont collectées pour la gestion de la JPO — elles sont <strong>supprimées automatiquement après 120 jours</strong> et ne sont jamais communiquées à des tiers.
                    {' '}<button onClick={() => setShowRgpd(true)} style={{ background: 'none', border: 'none', padding: 0, color: C.amber, textDecoration: 'underline', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                      Lire la politique complète →
                    </button>
                  </p>
                </div>

                {rgpdConsent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: `2px solid ${C.sauge}`, background: C.saugeLight }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.sauge, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckIcon size={14} color="white" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: C.saugeDark }}>Consentement RGPD accepté</span>
                    <button onClick={() => setRgpdConsent(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '12px', color: C.saugeDark, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", padding: '4px' }}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowRgpd(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    borderRadius: '12px', cursor: 'pointer', border: `2px dashed ${C.border}`,
                    background: C.grayLight, width: '100%', textAlign: 'left',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span style={{ fontSize: '14px', color: C.gray }}>
                      Lire et accepter la politique RGPD <span style={{ color: C.bordeaux }}>*</span>
                    </span>
                  </button>
                )}

                {apiError && (
                  <div style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: C.bordeaux }}>
                    {apiError}
                  </div>
                )}

                <div className="btn-row">
                  <button onClick={() => setStep(1)} style={{ ...btnSecondary, flex: 1 }}>← Retour</button>
                  <button onClick={handleSubmit} disabled={loading || !rgpdConsent}
                    style={{ ...btnPrimary, flex: 2, opacity: loading || !rgpdConsent ? 0.45 : 1, cursor: loading || !rgpdConsent ? 'not-allowed' : 'pointer' }}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Envoi en cours…
                      </span>
                    ) : 'Valider mon inscription'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: C.saugeLight, border: `2px solid ${C.sauge}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <CheckIcon size={26} color={C.sauge} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: C.anthracite, margin: '0 0 4px' }}>
                    Inscription enregistrée !
                  </h3>
                  <p style={{ fontSize: '13px', color: C.gray, margin: 0 }}>
                    Vous pouvez maintenant nous laisser un avis — c'est totalement facultatif.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.anthracite, margin: '0 0 12px' }}>
                    Comment s'est passée votre journée ?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button"
                        onMouseEnter={() => setStarHover(n)}
                        onMouseLeave={() => setStarHover(0)}
                        onClick={() => setStarSelected(s => s === n ? 0 : n)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.1s', transform: (starHover || starSelected) >= n ? 'scale(1.15)' : 'scale(1)' }}>
                        <StarIcon filled={(starHover || starSelected) >= n} size={34} />
                      </button>
                    ))}
                  </div>
                  {starSelected > 0 && (
                    <p style={{ fontSize: '12px', color: C.gray, margin: '8px 0 0' }}>
                      {['', 'Insuffisant', 'Passable', 'Bien', 'Très bien', 'Excellent !'][starSelected]}
                    </p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>
                    Un commentaire ou une suggestion ?
                    <span style={optLabel}>(optionnel)</span>
                  </label>
                  <textarea
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Ce qui vous a plu, ce qui pourrait être amélioré…"
                    rows={3}
                    onFocus={focusOn()} onBlur={focusOff()}
                    style={{
                      ...fieldStyle(), paddingRight: '16px', resize: 'vertical', minHeight: '90px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '15px', lineHeight: 1.5,
                    } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Comment avez-vous entendu parler de la JPO ?
                    <span style={optLabel}>(optionnel)</span>
                  </label>
                  <select value={heardFrom} onChange={e => setHeardFrom(e.target.value)}
                    onFocus={focusOn()} onBlur={focusOff()}
                    style={{ ...fieldStyle(undefined, !!heardFrom), paddingRight: '36px' }}>
                    <option value="">Sélectionner…</option>
                    <option>Réseaux sociaux</option>
                    <option>Site web de l'IUT</option>
                    <option>Mon lycée / professeur</option>
                    <option>Bouche-à-oreille</option>
                    <option>Parcoursup</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="btn-row">
                  <button onClick={goToConfirmation} style={{ ...btnSecondary, flex: 1 }}>
                    Passer
                  </button>
                  <button onClick={goToConfirmation}
                    style={{ ...btnPrimary, flex: 2, opacity: starSelected === 0 && !feedbackComment ? 0.7 : 1 }}>
                    Envoyer mon avis
                  </button>
                </div>
              </div>
            )}

            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '14px' }}>
            Personnel IUT ?{' '}
            <a href="/admin" style={{ color: C.sauge, textDecoration: 'none', fontWeight: 600 }}>Tableau de bord →</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
