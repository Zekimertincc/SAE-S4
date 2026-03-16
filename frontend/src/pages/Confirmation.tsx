import { useLocation, useNavigate } from 'react-router-dom'

interface Visitor {
  first_name: string
  last_name: string
  email: string
  bac_type: string
  department: string
  ine?: string
  reorientation: boolean
}

export default function Confirmation() {
  const { state } = useLocation() as { state: { visitor?: Visitor } }
  const navigate = useNavigate()
  const visitor = state?.visitor

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-sm w-full">
          <p className="text-gray-500 mb-4">Aucune donnée trouvée.</p>
          <button onClick={() => navigate('/')}
            className="bg-blue-600 text-white rounded-xl px-6 py-2 text-sm hover:bg-blue-700 transition">
            Retour au formulaire
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Inscription confirmée !</h1>
          <p className="text-gray-500 text-sm mt-1">Vos informations ont bien été enregistrées.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 flex flex-col gap-3 text-sm">
          {[
            ['Nom', `${visitor.first_name} ${visitor.last_name}`],
            ['E-mail', visitor.email],
            ['Bac', visitor.bac_type],
            ['Département', visitor.department],
            ...(visitor.ine ? [['INE', visitor.ine]] : []),
            ['Réorientation', visitor.reorientation ? 'Oui' : 'Non'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800 text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => navigate('/')}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
            Nouveau visiteur
          </button>
          <button onClick={() => window.print()}
            className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 transition">
            Imprimer
          </button>
        </div>
      </div>
    </div>
  )
}
