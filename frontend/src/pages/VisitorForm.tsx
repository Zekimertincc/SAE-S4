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

function RgpdModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-7 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-800">Informations sur vos données personnelles</h2>
        <div className="text-sm text-gray-600 flex flex-col gap-3">
          <p>Vos données sont collectées dans le cadre de la <strong>Journée Portes Ouvertes de l'IUT de Montreuil</strong>.</p>
          <p>Elles sont utilisées pour le suivi des visiteurs et la communication post-JPO (informations sur les formations, propositions d'immersion).</p>
          <p>Elles sont accessibles <strong>uniquement aux gestionnaires autorisés</strong> de l'IUT. Elles ne sont pas transmises à des tiers.</p>
          <p>Elles sont <strong>supprimées automatiquement après 120 jours</strong>, conformément à la période Parcoursup.</p>
          <p>Vous pouvez exercer vos droits d'accès, de rectification ou de suppression en contactant l'administration de l'IUT.</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Fermer
          </button>
          <button
            onClick={onAccept}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            J'accepte
          </button>
        </div>
      </div>
    </div>
  )
}

function fieldClass(error?: string) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
    error
      ? 'border-red-400 bg-red-50 focus:ring-red-400'
      : 'border-gray-300 focus:ring-blue-500'
  }`
}

export default function VisitorForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '',
    bac_type: '', department: '', ine: '', reorientation: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showRgpdModal, setShowRgpdModal] = useState(false)
  const [rgpdConsent, setRgpdConsent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    if (e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.type === 'submit') return
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value }
    const result = schema.safeParse(updatedForm)
    if (!result.success) {
      const issues = result.error?.issues ?? []
      const fieldError = issues.find((err) => err.path[0] === name)
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [name]: fieldError.message }))
        return
      }
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')
    const result = schema.safeParse(form)
    if (!result.success) {
      const errs: Errors = {}
      const issues = result.error?.issues ?? []
      issues.forEach((err) => {
        const key = err.path[0] as keyof FormData
        if (!errs[key]) errs[key] = err.message
      })
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, rgpd_consent: true }),
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
    {showRgpdModal && (
      <RgpdModal
        onAccept={() => { setRgpdConsent(true); setShowRgpdModal(false) }}
        onClose={() => setShowRgpdModal(false)}
      />
    )}
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Journée Portes Ouvertes</h1>
        <p className="text-gray-500 text-sm mb-6">IUT Montreuil — Formulaire d'inscription</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} onBlur={handleBlur}
                placeholder="Marie"
                className={fieldClass(errors.first_name)} />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} onBlur={handleBlur}
                placeholder="Dupont"
                className={fieldClass(errors.last_name)} />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur}
              placeholder="marie@exemple.fr"
              className={fieldClass(errors.email)} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bac préparé *</label>
            <select name="bac_type" value={form.bac_type} onChange={handleChange} onBlur={handleBlur}
              className={fieldClass(errors.bac_type)}>
              <option value="">Sélectionner…</option>
              {BAC_TYPES.map((b) => <option key={b}>{b}</option>)}
            </select>
            {errors.bac_type && <p className="text-red-500 text-xs mt-1">{errors.bac_type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département visité *</label>
            <select name="department" value={form.department} onChange={handleChange} onBlur={handleBlur}
              className={fieldClass(errors.department)}>
              <option value="">Sélectionner…</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro INE *</label>
            <input name="ine" value={form.ine} onChange={handleChange} onBlur={handleBlur}
              placeholder="123456789A" maxLength={11}
              className={fieldClass(errors.ine)} />
            {errors.ine
              ? <p className="text-red-500 text-xs mt-1">{errors.ine}</p>
              : <p className="text-gray-400 text-xs mt-1">11 caractères (ex : 123456789A)</p>
            }
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="reorientation" checked={form.reorientation}
              onChange={handleChange} className="w-4 h-4 accent-blue-600" />
            <span className="text-sm text-gray-700">Je suis en cours de réorientation</span>
          </label>

          {rgpdConsent ? (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-700">Consentement RGPD accepté</span>
              <button
                type="button"
                onClick={() => setRgpdConsent(false)}
                className="ml-auto text-xs text-green-600 hover:underline"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowRgpdModal(true)}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 transition text-left"
            >
              Lire et accepter les conditions RGPD <span className="text-red-400">*</span>
            </button>
          )}

          {apiError && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{apiError}</p>}

          <button type="submit" disabled={loading || !rgpdConsent}
            className="bg-blue-600 text-white font-semibold rounded-xl py-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Envoi…' : 'Valider mon inscription'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Personnel IUT ? <a href="/admin" className="text-blue-500 hover:underline">Tableau de bord →</a>
        </p>
      </div>
    </div>
    </>
  )
}
