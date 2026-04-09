import { useState } from 'react'
import { changePassword } from '../api/api'
import { C, font, inputStyle, labelStyle, btnPrimary, card } from '../theme'

export default function SettingsTab() {
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd,     setNewPwd]     = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')

  const focusStyle = { borderColor: C.bordeaux, boxShadow: `0 0 0 3px ${C.bordeauxLight}` }
  const blurStyle  = { borderColor: C.border,   boxShadow: 'none' }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (newPwd !== confirm)     { setError('Les mots de passe ne correspondent pas.'); return }
    if (newPwd.length < 4)      { setError('Minimum 4 caractères.'); return }
    setLoading(true)
    try {
      await changePassword(currentPwd, newPwd)
      setSuccess(true)
      setCurrentPwd(''); setNewPwd(''); setConfirm('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.')
    } finally { setLoading(false) }
  }

  const field = (
    label: string, value: string,
    onChange: (v: string) => void,
    placeholder = '••••••••',
  ) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="password" value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle()}
        onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ maxWidth: '420px', width: '100%' }}>
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: `1px solid ${C.grayLight}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '4px', height: '22px', background: C.bordeaux, borderRadius: '2px' }} />
          <div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: C.anthracite, fontFamily: font }}>Changer le mot de passe</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.gray, fontFamily: font }}>Le changement est effectif immédiatement.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: font }}>
          {field('Mot de passe actuel',               currentPwd, setCurrentPwd)}
          {field('Nouveau mot de passe',              newPwd,     setNewPwd)}
          {field('Confirmer le nouveau mot de passe', confirm,    setConfirm)}

          {error && (
            <div style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: C.bordeaux }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: C.saugeLight, border: `1px solid ${C.sauge}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: C.saugeDark }}>
              ✓ Mot de passe modifié avec succès.
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
          >
            {loading ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}
