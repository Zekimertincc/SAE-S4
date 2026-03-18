import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const BAC_TYPES = ['Général', 'STI2D', 'STL', 'STMG', 'ST2S', 'PRO', 'Autre']
const DEPARTMENTS = ['Informatique', 'GACO', 'INFOCOM', 'QLIO']

const schema = z.object({
  first_name: z.string().min(2, 'Minimum 2 caractères'),
  last_name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('E-mail invalide'),
  bac_type: z.string().min(1, 'Champ requis'),
  department: z.string().min(1, 'Champ requis'),
  ine: z.string().optional(),
  reorientation: z.boolean(),
})

type FormData = z.infer<typeof schema>
type Errors = Partial<Record<keyof FormData, string>>

export default function VisitorForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '',
    bac_type: '', department: '', ine: '', reorientation: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')
    const result = schema.safeParse(form)
    if (!result.success) {
      const errs: Errors = {}
      result.error.errors.forEach((err) => {
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
        body: JSON.stringify(result.data),
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Journée Portes Ouvertes</h1>
        <p className="text-gray-500 text-sm mb-6">IUT Montreuil — Formulaire d'inscription</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input name="first_name" value={form.first_name} onChange={handleChange}
                placeholder="Marie"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input name="last_name" value={form.last_name} onChange={handleChange}
                placeholder="Dupont"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="marie@exemple.fr"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bac préparé *</label>
            <select name="bac_type" value={form.bac_type} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner…</option>
              {BAC_TYPES.map((b) => <option key={b}>{b}</option>)}
            </select>
            {errors.bac_type && <p className="text-red-500 text-xs mt-1">{errors.bac_type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département visité *</label>
            <select name="department" value={form.department} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner…</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro INE <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input name="ine" value={form.ine} onChange={handleChange}
              placeholder="1234567890A" maxLength={11}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="reorientation" checked={form.reorientation}
              onChange={handleChange} className="w-4 h-4 accent-blue-600" />
            <span className="text-sm text-gray-700">Je suis en cours de réorientation</span>
          </label>

          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            Vos données sont collectées dans le cadre de la JPO et supprimées après Parcoursup (RGPD).
          </p>

          {apiError && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{apiError}</p>}

          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white font-semibold rounded-xl py-3 hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? 'Envoi…' : 'Valider mon inscription'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Personnel IUT ? <a href="/admin" className="text-blue-500 hover:underline">Tableau de bord →</a>
        </p>
      </div>
    </div>
  )
}
