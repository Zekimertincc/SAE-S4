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