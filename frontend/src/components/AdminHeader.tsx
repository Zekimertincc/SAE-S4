import { getExportUrl } from '../api/api'

interface Props {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: Props) {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-xs text-gray-400">IUT Montreuil — Journée Portes Ouvertes</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={getExportUrl()}
          download="visiteurs.csv"
          className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition"
        >
          Export CSV
        </a>
        <button
          onClick={onLogout}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}