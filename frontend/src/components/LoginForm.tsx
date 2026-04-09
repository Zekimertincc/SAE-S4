import { useState } from 'react'
import { login } from '../api/api'

interface Props {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const success = await login(password)
      if (success) {
        onLogin()
      } else {
        setError('Mot de passe incorrect.')
      }
    } catch {
      setError('Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      <div className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 bg-blue-600 p-10">
        <div>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold leading-snug">
            Espace<br />gestionnaire
          </h2>
          <p className="text-blue-200 text-sm mt-3 leading-relaxed">
            Accès réservé au personnel autorisé de l'IUT de Montreuil.
            Consultez et gérez les inscriptions à la Journée Portes Ouvertes.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', label: 'Suivi des inscriptions' },
            { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', label: 'Gestion des visiteurs' },
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Données sécurisées RGPD' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
              <span className="text-blue-100 text-sm">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-blue-300 text-xs">IUT de Montreuil — JPO {new Date().getFullYear()}</p>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          <div className="md:hidden mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h1>
          <p className="text-gray-400 text-sm mb-8">IUT Montreuil — Accès réservé</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                autoFocus
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                  error
                    ? 'border-red-400 bg-red-50 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {error && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="bg-blue-600 text-white font-semibold rounded-xl py-2.5 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            <a href="/" className="hover:text-blue-500 transition">← Retour au formulaire</a>
          </p>
        </div>
      </div>
    </div>
  )
}