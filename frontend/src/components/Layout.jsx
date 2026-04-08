import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-slate-900 text-lg">💰 Budget Manager</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              Bonjour, <span className="font-medium text-slate-700">{user?.username}</span>
            </span>
            <button onClick={logout} className="btn-secondary text-sm py-1.5">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}