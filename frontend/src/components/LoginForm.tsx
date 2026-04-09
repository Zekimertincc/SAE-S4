import { useState } from 'react'
import { login } from '../api/api'
import { C, font, inputStyle, btnPrimary } from '../theme'

interface Props { onLogin: () => void }

function IUTWordmark() {
  return (
    <svg width="48" height="32" viewBox="0 0 52 34" fill="none">
      <rect x="0"  y="5"  width="6" height="25" fill="white" />
      <rect x="0"  y="0"  width="6" height="5"  fill={C.sauge} />
      <rect x="11" y="5"  width="6" height="25" fill="white" />
      <rect x="23" y="5"  width="6" height="25" fill="white" />
      <rect x="11" y="24" width="18" height="6"  fill="white" />
      <rect x="34" y="5"  width="6" height="25" fill="white" />
      <rect x="34" y="5"  width="18" height="6"  fill="white" />
      <rect x="46" y="5"  width="6" height="6"   fill={C.sauge} />
    </svg>
  )
}

const FEATURES = [
  { d: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', label: 'Suivi des inscriptions' },
  { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', label: 'Gestion des visiteurs' },
  { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Données sécurisées RGPD' },
]

export default function LoginForm({ onLogin }: Props) {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const ok = await login(password)
      if (ok) { onLogin() } else { setError('Mot de passe incorrect.') }
    } catch { setError('Erreur de connexion au serveur.') }
    finally  { setLoading(false) }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: font }}>

        <div style={{
          width: '380px', flexShrink: 0, background: C.bordeaux,
          padding: '40px 36px', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
        }} className="login-left-panel">
          <div style={{ position: 'absolute', right: '-20px', top: '-30px', width: '120px', height: '180px', background: 'rgba(255,255,255,0.06)', transform: 'skewX(-12deg)' }} />
          <div style={{ position: 'absolute', right: '60px', top: '-10px', width: '60px', height: '180px', background: 'rgba(255,255,255,0.04)', transform: 'skewX(-12deg)' }} />

          <div style={{ position: 'relative' }}>
            <IUTWordmark />
            <div style={{ marginTop: '36px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.white, margin: '0 0 10px', lineHeight: 1.2 }}>
                Espace<br />gestionnaire
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>
                Accès réservé au personnel autorisé de l'IUT de Montreuil.
                Consultez et gérez les inscriptions à la Journée Portes Ouvertes.
              </p>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FEATURES.map(({ d, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d} />
                    </svg>
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', position: 'relative' }}>
            IUT de Montreuil — JPO {new Date().getFullYear()}
          </p>
        </div>

        <div style={{ flex: 1, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ width: '100%', maxWidth: '340px' }}>

            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.anthracite, margin: '0 0 6px' }}>
                Connexion
              </h1>
              <p style={{ fontSize: '13px', color: C.gray, margin: 0 }}>
                IUT Montreuil — Accès réservé
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.anthracite, marginBottom: '6px' }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  autoFocus
                  style={{
                    ...inputStyle(!!error),
                    fontSize: '15px',
                    onFocus: undefined,
                  } as React.CSSProperties}
                  onFocus={e => { e.currentTarget.style.borderColor = C.bordeaux; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.bordeauxLight}` }}
                  onBlur={e  => { e.currentTarget.style.borderColor = error ? C.bordeaux : C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
                {error && (
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: C.bordeaux, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                style={{ ...btnPrimary, opacity: loading || !password ? 0.5 : 1, cursor: loading || !password ? 'not-allowed' : 'pointer', fontSize: '15px', padding: '13px' }}
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '28px' }}>
              <a href="/" style={{ color: C.sauge, textDecoration: 'none', fontWeight: 600 }}>← Retour au formulaire</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .login-left-panel { display: none !important; } }
      `}</style>
    </>
  )
}
