import { C, font } from '../theme'

function IUTWordmark() {
  return (
    <svg width="40" height="26" viewBox="0 0 52 34" fill="none">
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

interface Props { onLogout: () => void }

export default function AdminHeader({ onLogout }: Props) {
  return (
    <header style={{
      background: C.anthracite, padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: font, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <IUTWordmark />
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: C.white, letterSpacing: '-0.01em' }}>
            Tableau de bord
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>
            IUT de Montreuil · Journée Portes Ouvertes
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="/" style={{ fontSize: '12px', color: C.sauge, textDecoration: 'none', fontWeight: 600 }}>
          ← Formulaire
        </a>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
        <button
          onClick={onLogout}
          style={{ background: 'none', border: 'none', fontSize: '13px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: font, padding: '4px 0', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}
