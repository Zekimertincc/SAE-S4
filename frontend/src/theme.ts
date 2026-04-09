export const C = {
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
  red:           '#dc2626',
  redBg:         '#fef2f2',
  redBorder:     '#fecaca',
}

export const font = "'DM Sans', sans-serif"

export const inputStyle = (error?: boolean): React.CSSProperties => ({
  width: '100%', boxSizing: 'border-box',
  border: `1.5px solid ${error ? C.bordeaux : C.border}`,
  borderRadius: '9px', padding: '10px 14px',
  fontSize: '14px', fontFamily: font,
  color: C.anthracite, background: error ? C.errorBg : C.white,
  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  appearance: 'none' as const,
})

export const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: C.anthracite, marginBottom: '5px',
}

export const btnPrimary: React.CSSProperties = {
  background: C.bordeaux, color: C.white, border: 'none',
  borderRadius: '9px', padding: '11px 20px', fontSize: '14px',
  fontWeight: 700, fontFamily: font, cursor: 'pointer',
  width: '100%', transition: 'opacity 0.15s',
}

export const btnSecondary: React.CSSProperties = {
  background: C.white, color: C.gray,
  border: `1.5px solid ${C.border}`,
  borderRadius: '9px', padding: '10px 20px', fontSize: '14px',
  fontWeight: 600, fontFamily: font, cursor: 'pointer',
}

export const btnDanger: React.CSSProperties = {
  background: C.red, color: C.white, border: 'none',
  borderRadius: '9px', padding: '10px 20px', fontSize: '14px',
  fontWeight: 700, fontFamily: font, cursor: 'pointer',
}

export const card: React.CSSProperties = {
  background: C.white, borderRadius: '14px',
  border: `1px solid ${C.border}`,
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
}
